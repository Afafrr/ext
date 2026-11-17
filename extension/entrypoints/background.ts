import { browser } from 'wxt/browser';
import { defineBackground } from 'wxt/utils/define-background';
import { createBookmarkLibrary, GET_LIBRARY_MESSAGE } from '../lib/bookmark-library';
import { createBookmarkDetector } from '../lib/bookmark-detector';
import { createModelController } from '../lib/model-controller';
import {
  CLEAR_ACTIVITY_MESSAGE,
  STORAGE_KEY,
  emptyState,
  type DetectionState,
} from '../lib/detection-state';

export default defineBackground(() => {
  const model = createModelController();
  const library = createBookmarkLibrary(() => browser.bookmarks.getTree());
  const detector = createBookmarkDetector({
    onDetected: model.onDetected,
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
    void operation.catch(() => {
      // Deliberately omit titles and URLs from extension logs.
      console.error('Bookmark Organizer could not update bookmark data.');
    });
  }

  for (const event of [browser.bookmarks.onCreated, browser.bookmarks.onChanged,
    browser.bookmarks.onMoved, browser.bookmarks.onRemoved, browser.bookmarks.onChildrenReordered,
    browser.bookmarks.onImportBegan, browser.bookmarks.onImportEnded]) {
    event.addListener(() => library.invalidate());
  }

  // Register listeners synchronously on every worker start, before any awaits.
  browser.bookmarks.onCreated.addListener((id, node) => {
    observe(detector.record(id, node));
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
  browser.bookmarks.onRemoved.addListener((id) => {
    observe(detector.remove(id));
  });

  browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (sender.id !== browser.runtime.id) return;
    if (message?.type === GET_LIBRARY_MESSAGE) {
      void library.get().then(
        snapshot => sendResponse({ ok: true, library: snapshot }),
        () => sendResponse({ ok: false }),
      );
      return true;
    }
    if (message?.type !== CLEAR_ACTIVITY_MESSAGE) return;

    void detector.clear().then(
      () => sendResponse({ ok: true }),
      () => sendResponse({ ok: false }),
    );
    return true;
  });

  observe(browser.action.setBadgeBackgroundColor({ color: '#206a52' }));
  observe(detector.syncBadge());
  observe(library.get());
});
