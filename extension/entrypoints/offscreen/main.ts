import { browser } from 'wxt/browser';
import {
  MODEL_COMMAND, MODEL_EVENT, MODEL_TARGET, emptyModelState, MODEL_IDLE_MS,
  type ModelJob, type ModelState, type WorkerEvent,
} from '../../lib/model-state';

let state: ModelState = emptyModelState();
let worker: Worker | undefined;
let current: ModelJob | undefined;
const queue: ModelJob[] = [];
let idleTimer: ReturnType<typeof setTimeout> | undefined;
let watchdog: ReturnType<typeof setTimeout> | undefined;
let heartbeat: ReturnType<typeof setInterval> | undefined;
let stopped = false;
let sequence = 0;
const instance = crypto.randomUUID();

function publish(close = false, descriptionsChanged = false) {
  return browser.runtime.sendMessage({ type: MODEL_EVENT, instance, sequence: ++sequence, state, close, descriptionsChanged }).catch(() => {});
}
function clearIdle() {
  clearTimeout(idleTimer);
  idleTimer = undefined;
}
function stopWorker() {
  worker?.terminate();
  worker = undefined;
  clearTimeout(watchdog);
  clearInterval(heartbeat);
  heartbeat = undefined;
}
function stop(error?: string) {
  stopped = true;
  clearIdle();
  queue.length = 0;
  current = undefined;
  stopWorker();
  state.status = error ? 'error' : 'unloaded';
  state.pending = 0;
  if (error) state.error = error;
  publish(true);
}
function scheduleUnload() {
  clearIdle();
  state.status = 'ready';
  publish();
  idleTimer = setTimeout(() => {
    if (current || queue.length) return;
    stop();
  }, MODEL_IDLE_MS);
}
function resetWatchdog() {
  clearTimeout(watchdog);
  watchdog = setTimeout(() => stop('The model has not responded for 10 minutes.'), 600_000);
}
function processNext() {
  if (stopped || current) return;
  const job = queue.shift();
  if (!job) return;
  clearIdle();
  current = job;
  const cold = !worker;
  state.status = cold ? 'loading' : 'running';
  state.preset = job.preset;
  if (job.kind === 'index') {
    state.index = { completed: 0, total: job.entries.length,
      folderCount: job.folderCount, bookmarkCount: job.bookmarkCount };
  }
  delete state.error;
  if (!worker) {
    worker = new Worker(browser.runtime.getURL('/model-worker.js'), { type: 'module' });
    worker.onerror = () => stop('Model worker stopped unexpectedly. Release and retry, or choose a smaller model.');
    worker.onmessage = ({ data }: MessageEvent<WorkerEvent>) => {
      if (stopped) return;
      if (data.kind === 'page-description-permission') {
        const requestingWorker = worker;
        return browser.runtime.sendMessage({ type: MODEL_COMMAND, action: 'pageDescriptionPermission' })
          .then(result => result?.ok === true && result.allowed === true, () => false)
          .then(allowed => {
            if (!stopped && worker === requestingWorker) {
              requestingWorker?.postMessage({ kind: 'page-description-permission', allowed });
            }
          });
      } else if (data.kind === 'loaded') {
        state.status = current?.kind === 'index' ? 'indexing' : 'running';
        publish();
      } else if (data.kind === 'progress') {
        state.index = data.index;
        resetWatchdog();
        publish();
      } else if (data.kind === 'error') {
        stop(data.error);
      } else if (data.kind === 'complete') {
        if (data.index) state.index = data.index;
        if (data.suggestion) state.suggestion = data.suggestion;
        if (data.descriptionsChanged) publish(false, true);
        clearTimeout(watchdog);
        current = undefined;
        state.pending = queue.length;
        if (queue.length) processNext();
        else {
          clearInterval(heartbeat);
          heartbeat = undefined;
          scheduleUnload();
        }
      }
    };
  }
  // Keep the event listener alive during long first-time downloads.
  if (!heartbeat) heartbeat = setInterval(publish, 20_000);
  resetWatchdog();
  state.pending = queue.length + 1;
  publish();
  worker.postMessage(job);
}

browser.runtime.onMessage.addListener((message, sender, respond) => {
  if (sender.id !== browser.runtime.id || message?.target !== MODEL_TARGET) return;
  if (message.action === 'status') { respond({ instance, sequence, state }); return; }
  if (message.action === 'run') {
    if (stopped) { respond({ accepted: false, stopped: true }); return; }
    if (queue.length >= 20) { respond({ accepted: false }); return; }
    queue.push(message.job as ModelJob);
    processNext();
    respond({ accepted: true });
  }
});
