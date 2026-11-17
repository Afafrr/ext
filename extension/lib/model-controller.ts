import { browser } from 'wxt/browser';
import type { DetectedBookmark } from './detection-state';
import {
  MODEL_COMMAND, MODEL_EVENT, MODEL_SETTINGS_KEY, MODEL_STATE_KEY, MODEL_TARGET,
  emptyModelState, parseModelSettings,
  type ModelJob, type ModelSettings, type ModelState,
} from './model-state';

/** Serializes lifecycle changes; inference itself runs in an offscreen worker. */
export function createModelController() {
  let chain = Promise.resolve();
  let settings: ModelSettings;
  let state: ModelState;
  let instance: string | undefined;
  let lastSequence = 0;
  let initialized = false;
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
      ...(saved?.error ? { error: saved.error } : {}) };
    if (await hasOffscreen()) {
      try {
        const status = await send({ action: 'status' });
        instance = status.instance; state = status.state; lastSequence = status.sequence;
      } catch { await browser.offscreen.closeDocument(); }
    }
    if (!instance) {
      state = { ...state, status: state.status === 'error' ? 'error' : 'unloaded', pending: 0 };
    }
    await save(); initialized = true;
  }
  function enqueue<T>(operation: () => Promise<T>): Promise<T> {
    const result = chain.then(async () => { await initialize(); return operation(); });
    chain = result.then(() => {}, () => {});
    return result;
  }
  async function close(reason: string) {
    if (await hasOffscreen()) {
      try { state = (await send({ action: 'release', reason })).state; }
      finally { await browser.offscreen.closeDocument(); }
    }
    instance = undefined; lastSequence = 0;
    state.status = 'unloaded'; state.pending = 0;
    delete state.error;
    await save();
  }
  async function ensureOffscreen() {
    if (await hasOffscreen()) return;
    instance = undefined; lastSequence = 0;
    await browser.offscreen.createDocument({
      url: 'offscreen.html', reasons: [browser.offscreen.Reason.WORKERS],
      justification: 'Run the selected local embedding model for newly detected bookmarks.',
    });
    for (let attempt = 0; attempt < 100; attempt++) {
      try {
        const ready = await send({ action: 'init', state });
        instance = ready.instance;
        return;
      } catch { await new Promise(resolve => setTimeout(resolve, 50)); }
    }
    await browser.offscreen.closeDocument();
    throw new Error('The model document did not start.');
  }
  async function command(message: { action: string; settings?: unknown }) {
    if (message.action === 'get') return { ok: true, settings, state };
    if (message.action === 'settings') {
      const next = parseModelSettings(message.settings);
      if (!next.enabled || next.preset !== settings.preset) await close('settings changed');
      settings = next;
      await browser.storage.local.set({ [MODEL_SETTINGS_KEY]: settings });
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
        state = message.state;
        await save();
        if (message.close) {
          // Offscreen has already stopped accepting work. Old events are ignored.
          instance = undefined; lastSequence = 0;
          if (await hasOffscreen()) await browser.offscreen.closeDocument();
        }
      }).then(() => respond({ ok: true }), () => respond({ ok: false }));
      return true;
    }
  });
  return {
    onDetected(bookmark: DetectedBookmark) {
      void enqueue(async () => {
        if (!settings.enabled) return;
        // Re-read to avoid using a deleted bookmark or an obsolete title.
        const nodes = await browser.bookmarks.get(bookmark.id).catch(() => []);
        const node = nodes[0];
        if (node?.url === undefined) return;
        const job: ModelJob = {
          id: crypto.randomUUID(),
          text: (node.title || node.url).slice(0, 4000),
          settings: { ...settings },
        };
        await ensureOffscreen();
        let response = await send({ action: 'run', job });
        if (!response?.accepted && response?.stopped) {
          await close('idle timeout');
          await ensureOffscreen();
          response = await send({ action: 'run', job });
        }
        if (!response?.accepted) throw new Error('Model queue is full.');
      }).catch(async () => {
        // This path also terminates failed workers instead of retaining memory.
        void enqueue(async () => {
          await close('processing failed');
          state.status = 'error';
          state.error = 'Could not queue the model. Wyłącz i włącz przetwarzanie, aby spróbować ponownie. Kolejka mieści do 20 zakładek.';
          await save();
        }).catch(() => {});
      });
    },
  };
}
