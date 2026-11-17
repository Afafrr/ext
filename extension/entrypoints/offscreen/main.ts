import { browser } from 'wxt/browser';
import {
  MODEL_EVENT, MODEL_TARGET, emptyModelState, MODEL_IDLE_MS,
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

function publish() {
  void browser.runtime.sendMessage({ type: MODEL_EVENT, instance, sequence: ++sequence, state }).catch(() => {});
}
function clearIdle() { clearTimeout(idleTimer); idleTimer = undefined; }
function stopWorker() {
  worker?.terminate(); worker = undefined;
  clearTimeout(watchdog);
  clearInterval(heartbeat); heartbeat = undefined;
}
function release(reason: string) {
  stopped = true;
  clearIdle();
  queue.length = 0;
  current = undefined;
  stopWorker();
  state.status = 'unloaded'; state.pending = 0;
  publish();
}
function scheduleUnload() {
  clearIdle();
  state.status = 'ready';
  publish();
  idleTimer = setTimeout(() => {
    if (current || queue.length) return;
    release('idle timeout');
    // The background closes this document too, releasing its JS realm.
    void browser.runtime.sendMessage({ type: MODEL_EVENT, instance, close: true, sequence: ++sequence, state }).catch(() => {});
  }, MODEL_IDLE_MS);
}
function fail(error: string) {
  clearIdle(); queue.length = 0; current = undefined;
  stopWorker();
  state.status = 'error'; state.pending = 0; state.error = error;
  publish();
  // Preserve the error in session storage, but release the offscreen realm.
  void browser.runtime.sendMessage({ type: MODEL_EVENT, instance, close: true, sequence: ++sequence, state }).catch(() => {});
}
function processNext() {
  if (stopped || current) return;
  const job = queue.shift();
  if (!job) return;
  clearIdle(); current = job;
  const cold = !worker;
  state.status = cold ? 'loading' : 'running';
  state.preset = job.settings.preset;
  delete state.error;
  if (!worker) {
    worker = new Worker(browser.runtime.getURL('/model-worker.js'), { type: 'module' });
    worker.onerror = () => fail('Model worker stopped unexpectedly. Release and retry, or choose a smaller model.');
    worker.onmessage = ({ data }: MessageEvent<WorkerEvent>) => {
      if (stopped) return;
      if (data.kind === 'loaded') {
        state.status = 'running';
        publish();
      } else if (data.kind === 'error') {
        fail(data.error);
      } else if (data.kind === 'complete') {
        clearTimeout(watchdog);
        current = undefined;
        state.pending = queue.length;
        publish();
        if (queue.length) processNext();
        else {
          clearInterval(heartbeat); heartbeat = undefined;
          scheduleUnload();
        }
      }
    };
  }
  // Keep the event listener alive during long first-time downloads.
  if (!heartbeat) heartbeat = setInterval(publish, 20_000);
  watchdog = setTimeout(() => fail('Model processing timed out after 10 minutes. The worker was terminated.'), 600_000);
  state.pending = queue.length + 1;
  publish();
  worker.postMessage(job);
}

browser.runtime.onMessage.addListener((message, sender, respond) => {
  if (sender.id !== browser.runtime.id || message?.target !== MODEL_TARGET) return;
  if (message.action === 'status') { respond({ instance, sequence, state }); return; }
  if (message.action === 'init') {
    state = emptyModelState();
    respond({ instance }); return;
  }
  if (message.action === 'release') { release(message.reason ?? 'manual'); respond({ instance, state }); return; }
  if (message.action === 'run') {
    if (stopped) { respond({ accepted: false, stopped: true }); return; }
    if (queue.length >= 20) { respond({ accepted: false }); return; }
    queue.push(message.job as ModelJob);
    processNext();
    respond({ accepted: true });
  }
});
