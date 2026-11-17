import {
  MAX_RECENT_BOOKMARKS,
  type DetectedBookmark,
  type DetectionState,
} from './detection-state.ts';

export interface BookmarkNode {
  id: string;
  title: string;
  url?: string;
  parentId?: string;
}

interface DetectorDependencies {
  load: () => Promise<DetectionState>;
  save: (state: DetectionState) => Promise<void>;
  getNode: (id: string) => Promise<BookmarkNode | undefined>;
  setBadgeCount: (count: number) => Promise<void>;
  now?: () => number;
}

/** Observes new bookmarks only. This module has no bookmark write operations. */
export function createBookmarkDetector(deps: DetectorDependencies) {
  let queue = Promise.resolve();

  // Chrome dispatches events synchronously, but storage calls are asynchronous.
  // Serialize the whole read/modify/write operation to avoid losing rapid saves
  // and to preserve ordering between import events and creation events.
  function enqueue(update: (state: DetectionState) => Promise<DetectionState>) {
    const task = queue.then(async () => {
      const state = await deps.load();
      const next = await update(state);
      if (next !== state) await deps.save(next);
      await deps.setBadgeCount(next.recent.length);
    });

    // A failed operation must not prevent later events from being handled.
    queue = task.catch(() => {});
    return task;
  }

  async function describe(node: BookmarkNode, detectedAt: number): Promise<DetectedBookmark> {
    const folderPath: string[] = [];
    const folderIds: string[] = [];
    const visited = new Set([node.id]);
    let parentId = node.parentId;

    while (parentId && !visited.has(parentId)) {
      visited.add(parentId);
      const folder = await deps.getNode(parentId);
      if (!folder) break;
      folderIds.unshift(folder.id);
      // The invisible bookmark-tree root has no parent and should not be shown.
      if (folder.parentId !== undefined) {
        folderPath.unshift(folder.title || 'Untitled folder');
      }
      parentId = folder.parentId;
    }

    return {
      id: node.id,
      title: node.title,
      url: node.url!,
      folderPath,
      folderIds,
      detectedAt,
    };
  }

  return {
    syncBadge: () => enqueue(async (state) => state),

    record(id: string, eventNode: BookmarkNode) {
      // A folder creation is also an onCreated event, but is not a saved page.
      if (eventNode.url === undefined) return Promise.resolve();

      return enqueue(async (state) => {
        if (state.importInProgress || state.recent.some((item) => item.id === id)) {
          return state;
        }

        // Re-read in case the user edited or deleted it before processing began.
        const current = await deps.getNode(id);
        if (!current || current.url === undefined) return state;
        const entry = await describe(current, deps.now?.() ?? Date.now());

        return {
          ...state,
          recent: [entry, ...state.recent].slice(0, MAX_RECENT_BOOKMARKS),
        };
      });
    },

    setImporting(importInProgress: boolean) {
      return enqueue(async (state) => ({ ...state, importInProgress }));
    },

    refresh(id: string) {
      return enqueue(async (state) => {
        const affected = state.recent.some(
          (item) => item.id === id || item.folderIds.includes(id),
        );
        if (!affected) return state;

        const recent: DetectedBookmark[] = [];
        for (const entry of state.recent) {
          if (entry.id !== id && !entry.folderIds.includes(id)) {
            recent.push(entry);
            continue;
          }
          const current = await deps.getNode(entry.id);
          if (current?.url !== undefined) {
            recent.push(await describe(current, entry.detectedAt));
          }
        }

        return { ...state, recent };
      });
    },

    remove(id: string) {
      return enqueue(async (state) => ({
        ...state,
        recent: state.recent.filter(
          (item) => item.id !== id && !item.folderIds.includes(id),
        ),
      }));
    },

    clear: () => enqueue(async (state) => ({ ...state, recent: [] })),
    idle: () => queue,
  };
}
