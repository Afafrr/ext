import { browser } from 'wxt/browser';
import type { BookmarkLibrary } from './bookmark-library';
import { prepareIndex, readIndexMetadata } from './model-index';
import {
  MODEL_COMMAND, MODEL_EVENT, MODEL_SETTINGS_KEY, MODEL_STATE_KEY, MODEL_TARGET,
  emptyModelState, parseModelSettings,
  type ModelJob, type ModelSettings, type ModelState,
} from './model-state';

/** Serializes lifecycle changes; inference itself runs in an offscreen worker. */
export function createModelController(getLibrary: () => Promise<BookmarkLibrary>) {
  let chain = Promise.resolve();
  let settings: ModelSettings;
  let state: ModelState;
  let instance: string | undefined;
  let lastSequence = 0;
  let initialized = false;
  let syncRequested = false;
  let syncTimer: ReturnType<typeof setTimeout> | undefined;
  async function hasOffscreen() {
    return (await browser.runtime.getContexts({ contextTypes: ['OFFSCREEN_DOCUMENT'] })).length > 0;
  }
  const send = (data: Record<string, unknown>) => browser.runtime.sendMessage({ target: MODEL_TARGET, ...data });
  const save = () => browser.storage.session.set({ [MODEL_STATE_KEY]: state });
  async function initialize() {
    if (initialized) return;
    const [local, session] = await Promise.all([
      browser.storage.local.get(MODEL_SETTINGS_KEY), browser.storage.session.get(MODEL_STATE_KEY),
    ]);
    settings = parseModelSettings(local[MODEL_SETTINGS_KEY]);
    // Keep only current fields when reading storage from the performance-test version.
    const saved = session[MODEL_STATE_KEY] as Partial<ModelState> | undefined;
    state = { ...emptyModelState(), status: saved?.status === 'error' ? 'error' : 'unloaded',
      ...(saved?.error ? { error: saved.error } : {}),
      preset: settings.preset, index: await readIndexMetadata(settings.preset) };
    if (await hasOffscreen()) {
      try {
        const status = await send({ action: 'status' });
        instance = status.instance;
        state = { ...status.state, index: status.state.index ?? state.index };
        lastSequence = status.sequence;
      } catch { await browser.offscreen.closeDocument(); }
    }
    await save();
    initialized = true;
    if (settings.enabled && state.status !== 'error') {
      syncRequested = true;
      await flushIndex();
    }
  }
  function enqueue<T>(operation: () => Promise<T>): Promise<T> {
    const result = chain.then(async () => { await initialize(); return operation(); });
    chain = result.then(() => {}, () => {});
    return result;
  }
  async function close() {
    if (await hasOffscreen()) await browser.offscreen.closeDocument();
    instance = undefined;
    lastSequence = 0;
    state = { ...emptyModelState(), preset: settings.preset, index: await readIndexMetadata(settings.preset) };
    await save();
  }
  async function ensureOffscreen() {
    if (await hasOffscreen()) return;
    instance = undefined;
    lastSequence = 0;
    await browser.offscreen.createDocument({
      url: 'offscreen.html', reasons: [browser.offscreen.Reason.WORKERS],
      justification: 'Synchronize bookmark embeddings with the selected local model.',
    });
    for (let attempt = 0; attempt < 100; attempt++) {
      try {
        const ready = await send({ action: 'status' });
        instance = ready.instance;
        return;
      } catch { await new Promise(resolve => setTimeout(resolve, 50)); }
    }
    await browser.offscreen.closeDocument();
    throw new Error('The model document did not start.');
  }
  async function submit(job: ModelJob) {
    await ensureOffscreen();
    let response = await send({ action: 'run', job });
    if (!response?.accepted && response?.stopped) {
      await close();
      await ensureOffscreen();
      response = await send({ action: 'run', job });
    }
    if (!response?.accepted) throw new Error('Model queue is full.');
  }
  async function reportFailure() {
    await close();
    state.status = 'error';
    state.error = 'Could not prepare the model or index. Turn AI off and on to try again.';
    await save();
  }
  async function flushIndex() {
    if (!syncRequested || !settings.enabled || state.pending > 0 || state.status === 'error') return;
    syncRequested = false;
    await startIndex();
  }
  async function startIndex() {
    try {
      const job = await prepareIndex(await getLibrary(), settings.preset);
      const previous = await readIndexMetadata(settings.preset);
      if (previous?.fingerprint === job.fingerprint) {
        state.index = previous;
        await save();
        return;
      }
      state.pending = 1;
      state.status = 'loading';
      state.preset = settings.preset;
      state.index = { completed: 0, total: job.entries.length,
        folderCount: job.folderCount, bookmarkCount: job.bookmarkCount };
      delete state.error;
      await save();
      await submit(job);
    } catch { await reportFailure(); }
  }
  async function command(message: { action: string; settings?: unknown }) {
    if (message.action === 'get') return { ok: true, settings, state };
    if (message.action === 'settings') {
      const next = parseModelSettings(message.settings);
      const shouldIndex = next.enabled && (!settings.enabled || next.preset !== settings.preset);
      if (!next.enabled || next.preset !== settings.preset) await close();
      await browser.storage.local.set({ [MODEL_SETTINGS_KEY]: next });
      settings = next;
      state.preset = settings.preset;
      state.index = await readIndexMetadata(settings.preset);
      if (shouldIndex) {
        syncRequested = false;
        await startIndex();
      } else await save();
    } else {
      throw new Error('Unknown model action.');
    }
    return { ok: true, settings, state };
  }
  browser.runtime.onMessage.addListener((message, sender, respond) => {
    if (sender.id !== browser.runtime.id) return;
    if (message?.type === MODEL_COMMAND) {
      void enqueue(() => command(message)).then(respond, () => respond({ ok: false, error: 'Could not update the model. Reload the extension and try again.' }));
      return true;
    }
    if (message?.type === MODEL_EVENT) {
      void enqueue(async () => {
        if (!instance || message.instance !== instance || message.sequence < lastSequence) return;
        // On service-worker wake, initialize() may read a snapshot that already
        // includes this event. Its close request must still be honored.
        if (message.sequence === lastSequence && !message.close) return;
        lastSequence = message.sequence;
        state = { ...message.state, index: message.state.index ?? state.index };
        await save();
        if (message.close) {
          // Offscreen has already stopped accepting work. Old events are ignored.
          instance = undefined;
          lastSequence = 0;
          if (await hasOffscreen()) await browser.offscreen.closeDocument();
        }
        await flushIndex();
      }).then(() => respond({ ok: true }), () => respond({ ok: false }));
      return true;
    }
  });
  return {
    onLibraryChanged() {
      clearTimeout(syncTimer);
      syncTimer = setTimeout(() => {
        void enqueue(async () => {
          syncRequested = true;
          await flushIndex();
        }).catch(() => {});
      }, 250);
    },
  };
}
