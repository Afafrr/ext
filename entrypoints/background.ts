import { browser } from 'wxt/browser';
import { defineBackground } from 'wxt/utils/define-background';
import { createBookmarkDetector } from '../lib/bookmark-detector';
import {
  CLEAR_ACTIVITY_MESSAGE,
  STORAGE_KEY,
  emptyState,
  type DetectionState,
} from '../lib/detection-state';

export default defineBackground(() => {
  const detector = createBookmarkDetector({
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
      await browser.action.setBadgeBackgroundColor({ color: '#206a52' });
      await browser.action.setBadgeText({ text: count ? String(count) : '' });
    },
  });

  function observe(operation: Promise<void>) {
    void operation.catch(() => {
      // Deliberately omit titles and URLs from extension logs.
      console.error('Bookmark Organizer could not update its detection activity.');
    });
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
  browser.bookmarks.onChanged.addListener((id) => {
    observe(detector.refresh(id));
  });
  browser.bookmarks.onMoved.addListener((id) => {
    observe(detector.refresh(id));
  });
  browser.bookmarks.onRemoved.addListener((id) => {
    observe(detector.remove(id));
  });

  browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (
      sender.id !== browser.runtime.id ||
      message?.type !== CLEAR_ACTIVITY_MESSAGE
    ) {
      return;
    }

    void detector.clear().then(
      () => sendResponse({ ok: true }),
      () => sendResponse({ ok: false }),
    );
    return true;
  });

  observe(detector.syncBadge());
});
