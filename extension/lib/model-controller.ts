import { browser } from 'wxt/browser';
import type { BookmarkLibrary, LibraryNode } from './bookmark-library';
import { prepareIndex, readIndexMetadata, readFolderDescriptions, saveFolderDescription, removeFolderDescriptions } from './model-index';
import { MAX_RECENT_BOOKMARKS, type DetectedBookmark } from './detection-state';
import { PAGE_DESCRIPTION_PERMISSIONS, readPageDescription } from './page-description';
import {
  MODEL_COMMAND, MODEL_EVENT, MODEL_SETTINGS_KEY, MODEL_STATE_KEY, MODEL_TARGET,
  emptyModelState, parseModelSettings,
  type ModelJob, type ModelSettings, type ModelState,
} from './model-state';

const SAVE_WINDOW_KEY = 'bookmark-organizer:save-window';

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
      preset: settings.preset, index: await readIndexMetadata(settings.preset), suggestion: saved?.suggestion,
      handledSuggestionId: saved?.handledSuggestionId, autoMoveError: saved?.autoMoveError,
      saveWindowError: saved?.saveWindowError, pendingAutoMoves: saved?.pendingAutoMoves };
    if (await hasOffscreen()) {
      try {
        const status = await send({ action: 'status' });
        instance = status.instance;
        state = { ...status.state, index: status.state.index ?? state.index, suggestion: status.state.suggestion ?? state.suggestion,
          handledSuggestionId: state.handledSuggestionId, autoMoveError: state.autoMoveError,
          saveWindowError: state.saveWindowError, pendingAutoMoves: state.pendingAutoMoves };
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
    state = { ...emptyModelState(), preset: settings.preset, index: await readIndexMetadata(settings.preset), suggestion: state.suggestion,
      handledSuggestionId: state.handledSuggestionId, autoMoveError: state.autoMoveError,
      saveWindowError: state.saveWindowError, pendingAutoMoves: state.pendingAutoMoves };
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
    state.error = 'Could not prepare the model or index. Click Try again to retry.';
    await save();
  }
  async function flushIndex() {
    if (!syncRequested || !settings.enabled || state.pending > 0 || state.status === 'error') return;
    syncRequested = false;
    await startIndex();
  }
  async function startIndex() {
    try {
      const descriptions = await readFolderDescriptions();
      const job = await prepareIndex(await getLibrary(), settings.preset, descriptions);
      const previous = await readIndexMetadata(settings.preset);
      if (previous?.fingerprint === job.fingerprint) {
        const byId = new Map(descriptions.map(folder => [folder.id, folder]));
        const needsDescriptions = job.folders.some(folder => {
          const saved = byId.get(folder.id);
          if (saved && saved.source !== 'generated') return false;
          if (!folder.bookmarks.length) return Boolean(saved);
          const input = JSON.stringify({ path: folder.path, bookmarks: folder.bookmarks, preset: job.preset });
          return !saved || saved.input !== input;
        });
        if (!needsDescriptions) {
          state.index = previous;
          await save();
          return;
        }
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
  async function command(message: { action: string; settings?: unknown; id?: unknown; parentId?: unknown; description?: unknown }) {
    if (message.action === 'get') return { ok: true, settings, state };
    if (message.action === 'pageDescriptionPermission') {
      return { ok: true, allowed: await browser.permissions.contains(PAGE_DESCRIPTION_PERMISSIONS).catch(() => false) };
    }
    if (message.action === 'settings') {
      const next = parseModelSettings(message.settings);
      const shouldIndex = next.preset !== settings.preset || state.status === 'error';
      if (shouldIndex) await close();
      await browser.storage.local.set({ [MODEL_SETTINGS_KEY]: next });
      if (next.preset !== settings.preset) delete state.suggestion;
      if (!next.enabled || !next.autoMove || next.preset !== settings.preset) delete state.pendingAutoMoves;
      settings = next;
      state.preset = settings.preset;
      state.index = await readIndexMetadata(settings.preset);
      if (shouldIndex) {
        syncRequested = false;
        await startIndex();
      } else await save();
    } else if (message.action === 'moveBookmark') {
      if (typeof message.id !== 'string' || typeof message.parentId !== 'string') throw new Error('Invalid bookmark destination.');
      const [bookmark] = await browser.bookmarks.get(message.id);
      const [folder] = await browser.bookmarks.get(message.parentId);
      if (bookmark?.url === undefined || !folder || folder.url !== undefined) throw new Error('Bookmark or folder is unavailable.');
      // An explicit selection in the extension takes priority over automation.
      state.pendingAutoMoves = state.pendingAutoMoves?.filter(move => move.bookmarkId !== bookmark.id);
      await save();
      if (bookmark.parentId !== folder.id) await browser.bookmarks.move(bookmark.id, { parentId: folder.id });
    } else if (message.action === 'folderDescription') {
      if (typeof message.id !== 'string' || typeof message.description !== 'string') throw new Error('Invalid folder description.');
      const [folder] = await browser.bookmarks.get(message.id);
      if (!folder || folder.url !== undefined) throw new Error('Folder no longer exists.');
      await saveFolderDescription({ id: folder.id, description: message.description.trim().slice(0, 2000) });
      syncRequested = true;
      await flushIndex();
    } else {
      throw new Error('Unknown model action.');
    }
    return { ok: true, settings, state };
  }
  async function autoMoveBookmark() {
    const suggestion = state.suggestion;
    if (!suggestion || suggestion.bookmarkId === state.handledSuggestionId) return;
    // Consume each result so status events cannot start the same automatic move again.
    state.handledSuggestionId = suggestion.bookmarkId;
    delete state.autoMoveError;
    await save();
    const folder = suggestion.folders[0];
    if (!settings.enabled || !settings.autoMove || !suggestion.autoMove || !folder) return;
    try {
      const [bookmark] = await browser.bookmarks.get(suggestion.bookmarkId).catch(() => []);
      if (bookmark?.url !== suggestion.autoMove.url || !bookmark.parentId || bookmark.parentId === folder.id) return;
      const [destination] = await browser.bookmarks.get(folder.id);
      if (!destination || destination.url !== undefined) throw new Error('Destination is unavailable.');
      // Chrome can still commit its original folder after our window opens.
      state.pendingAutoMoves = [...(state.pendingAutoMoves ?? []), {
        bookmarkId: bookmark.id, url: bookmark.url, sourceId: bookmark.parentId, folderId: folder.id,
      }].slice(-MAX_RECENT_BOOKMARKS);
      await save();
      await browser.bookmarks.move(bookmark.id, { parentId: folder.id });
    } catch {
      state.pendingAutoMoves = state.pendingAutoMoves?.filter(move => move.bookmarkId !== suggestion.bookmarkId);
      state.autoMoveError = 'Could not move the bookmark automatically. Choose a folder and try Move here.';
      await save();
    }
  }
  async function showSaveWindow(bookmarkId: string) {
    const baseUrl = browser.runtime.getURL('/popup.html');
    const url = `${baseUrl}?bookmark=${encodeURIComponent(bookmarkId)}`;
    const [stored, parent] = await Promise.all([
      browser.storage.session.get(SAVE_WINDOW_KEY),
      browser.windows.getLastFocused({ windowTypes: ['normal'] }).catch(() => undefined),
    ]);
    const bounds: { width: number; height: number; left?: number; top?: number } = { width: 420, height: 600 };
    if (parent?.left !== undefined && parent.top !== undefined && parent.width !== undefined && parent.height !== undefined) {
      bounds.width = Math.min(bounds.width, parent.width);
      bounds.height = Math.min(bounds.height, parent.height);
      // Keep the save window near the toolbar and inside the browser's bounds.
      bounds.left = parent.left + Math.max(0, parent.width - bounds.width - 16);
      bounds.top = parent.top + Math.min(88, Math.max(0, parent.height - bounds.height));
    }
    const windowId = stored[SAVE_WINDOW_KEY];
    if (typeof windowId === 'number') {
      const existing = await browser.windows.get(windowId, { populate: true }).catch(() => undefined);
      const tab = existing?.tabs?.[0];
      if (existing?.type === 'popup' && tab?.id !== undefined && (tab.url ?? tab.pendingUrl)?.startsWith(`${baseUrl}?bookmark=`)) {
        await browser.tabs.update(tab.id, { url });
        await browser.windows.update(windowId, { focused: true, state: 'normal', ...bounds });
        return;
      }
    }
    const created = await browser.windows.create({ url, type: 'popup', focused: true, ...bounds });
    if (created?.id === undefined) throw new Error('Save window was not created.');
    await browser.storage.session.set({ [SAVE_WINDOW_KEY]: created.id });
  }
  browser.runtime.onMessage.addListener((message, sender, respond) => {
    if (sender.id !== browser.runtime.id) return;
    if (message?.type === MODEL_COMMAND) {
      enqueue(() => command(message)).then(respond, () => respond({ ok: false, error: 'Could not update the model. Reload the extension and try again.' }));
      return true;
    }
    if (message?.type === MODEL_EVENT) {
      enqueue(async () => {
        if (!instance || message.instance !== instance || message.sequence < lastSequence) return;
        // On service-worker wake, initialize() may read a snapshot that already
        // includes this event. Its close request must still be honored.
        if (message.sequence === lastSequence && !message.close) return;
        lastSequence = message.sequence;
        if (message.descriptionsChanged) {
          const available = new Set((await getLibrary()).folders.map(folder => folder.id));
          for (const folder of await readFolderDescriptions()) {
            if (folder.source === 'generated' && !available.has(folder.id)) {
              await removeFolderDescriptions({ id: folder.id, title: '' });
            }
          }
        }
        state = { ...message.state, index: message.state.index ?? state.index, suggestion: message.state.suggestion ?? state.suggestion,
          handledSuggestionId: state.handledSuggestionId, autoMoveError: state.autoMoveError,
          saveWindowError: state.saveWindowError, pendingAutoMoves: state.pendingAutoMoves };
        await save();
        await autoMoveBookmark();
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
    start() {
      return enqueue(flushIndex);
    },
    onDetected(bookmark: DetectedBookmark) {
      return enqueue(async () => {
        if (!settings.enabled) return;
        delete state.saveWindowError;
        await showSaveWindow(bookmark.id).catch(async () => {
          state.saveWindowError = 'Could not open the save window. Open the extension to see folder suggestions.';
          await save();
        });
        let description: string | undefined;
        if (/^https?:\/\//i.test(bookmark.url) && await browser.permissions.contains(PAGE_DESCRIPTION_PERMISSIONS)) {
          const tabs = await browser.tabs.query({});
          const matching = tabs.filter(tab => tab.url === bookmark.url);
          const tab = matching.find(tab => tab.active) ?? matching[0];
          if (tab?.id !== undefined) {
            const results = await browser.scripting.executeScript({
              target: { tabId: tab.id }, func: readPageDescription, args: [bookmark.url],
              injectImmediately: true,
            }).catch(() => []);
            description = results[0]?.result;
          }
          if (!await browser.permissions.contains(PAGE_DESCRIPTION_PERMISSIONS)) description = undefined;
        }
        const [node] = await browser.bookmarks.get(bookmark.id).catch(() => []);
        if (node?.url !== bookmark.url) return;
        const library = await getLibrary();
        const index = await prepareIndex(library, settings.preset, await readFolderDescriptions());
        await submit(index);
        await submit({ kind: 'embed', preset: settings.preset, bookmarkId: node.id, title: node.title || node.url,
          text: node.title || node.url, description, library,
          ...(settings.autoMove && node.parentId ? { autoMove: { parentId: node.parentId, url: node.url } } : {}) });
      });
    },
    onRemoved(node: LibraryNode) {
      return enqueue(() => removeFolderDescriptions(node));
    },
    onMoved(id: string, info: { parentId: string; oldParentId: string }) {
      return enqueue(async () => {
        const move = state.pendingAutoMoves?.find(move => move.bookmarkId === id);
        if (!move) return;
        // This is the event generated by our initial automatic move.
        if (info.oldParentId === move.sourceId && info.parentId === move.folderId) return;
        state.pendingAutoMoves = state.pendingAutoMoves?.filter(move => move.bookmarkId !== id);
        await save();
        if (!settings.enabled || !settings.autoMove || info.oldParentId !== move.folderId || info.parentId !== move.sourceId) return;
        try {
          const [bookmark] = await browser.bookmarks.get(id).catch(() => []);
          if (bookmark?.url !== move.url || bookmark.parentId !== move.sourceId) return;
          await browser.bookmarks.move(id, { parentId: move.folderId });
        } catch {
          state.autoMoveError = 'Could not restore the AI folder after the bookmark was moved. Choose a folder and try Move here.';
          await save();
        }
      });
    },
    onLibraryChanged() {
      clearTimeout(syncTimer);
      syncTimer = setTimeout(() => {
        return enqueue(async () => {
          syncRequested = true;
          await flushIndex();
        }).catch(() => {});
      }, 250);
    },
  };
}
