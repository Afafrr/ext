import { browser } from 'wxt/browser';
import { defineBackground } from 'wxt/utils/define-background';
import { createBookmarkLibrary, GET_LIBRARY_MESSAGE } from '../lib/bookmark-library';
import { createBookmarkDetector } from '../lib/bookmark-detector';
import { createModelController } from '../lib/model-controller';
import { readFolderDescriptions } from '../lib/model-index';
import {
  CLEAR_ACTIVITY_MESSAGE,
  STORAGE_KEY,
  emptyState,
  type DetectionState,
} from '../lib/detection-state';

export default defineBackground(() => {
  const library = createBookmarkLibrary(() => browser.bookmarks.getTree());
  const model = createModelController(library.get);
  const detector = createBookmarkDetector({
    onDetected: bookmark => observe(model.onDetected(bookmark)),
    async load() {
      const stored = await browser.storage.session.get(STORAGE_KEY);
      return (stored[STORAGE_KEY] as DetectionState | undefined) ?? emptyState();
    },
    async save(state) {
      await browser.storage.session.set({ [STORAGE_KEY]: state });
    },
    async getNode(id) {
      // A node may disappear between its event and the asynchronous lookup.
      const nodes = await browser.bookmarks.get(id).catch(() => []);
      return nodes[0];
    },
    async setBadgeCount(count) {
      await browser.action.setBadgeText({ text: count ? String(count) : '' });
    },
  });

  function observe(operation: Promise<unknown>) {
    return operation.catch(() => {
      // Deliberately omit titles and URLs from extension logs.
      console.error('Bookmark Organizer could not update bookmark data.');
    });
  }

  for (const event of [browser.bookmarks.onChanged,
    browser.bookmarks.onMoved, browser.bookmarks.onRemoved, browser.bookmarks.onChildrenReordered,
    browser.bookmarks.onImportBegan, browser.bookmarks.onImportEnded]) {
    event.addListener(() => {
      library.invalidate();
      model.onLibraryChanged();
    });
  }

  // Register listeners synchronously on every worker start, before any awaits.
  browser.bookmarks.onCreated.addListener((id, node) => {
    library.invalidate();
    observe(detector.record(id, node).finally(model.onLibraryChanged));
  });
  browser.bookmarks.onImportBegan.addListener(() => {
    observe(detector.setImporting(true));
  });
  browser.bookmarks.onImportEnded.addListener(() => {
    observe(detector.setImporting(false));
  });
  for (const event of [browser.bookmarks.onChanged, browser.bookmarks.onMoved]) {
    event.addListener(id => observe(detector.refresh(id)));
  }
  browser.bookmarks.onMoved.addListener((id, info) => {
    observe(model.onMoved(id, info));
  });
  browser.bookmarks.onRemoved.addListener((id, info) => {
    observe(detector.remove(id));
    observe(model.onRemoved(info.node));
  });

  browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (sender.id !== browser.runtime.id) return;
    if (message?.type === GET_LIBRARY_MESSAGE) {
      Promise.all([library.get(), readFolderDescriptions()]).then(
        ([snapshot, descriptions]) => {
          const byId = new Map(descriptions.map(folder => [folder.id, folder.description]));
          sendResponse({ ok: true, library: { ...snapshot,
            folders: snapshot.folders.map(folder => ({ ...folder, description: byId.get(folder.id) })) } });
        },
        () => sendResponse({ ok: false }),
      );
      return true;
    }
    if (message?.type !== CLEAR_ACTIVITY_MESSAGE) return;

    detector.clear().then(
      () => sendResponse({ ok: true }),
      () => sendResponse({ ok: false }),
    );
    return true;
  });

  observe(browser.action.setBadgeBackgroundColor({ color: '#206a52' }));
  observe(detector.syncBadge());
  observe(library.get());
  observe(model.start());
});
