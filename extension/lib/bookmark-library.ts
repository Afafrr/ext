export const GET_LIBRARY_MESSAGE = 'bookmark-organizer:get-library';

export interface LibraryNode {
  id: string;
  parentId?: string;
  title: string;
  url?: string;
  index?: number;
  unmodifiable?: string;
  children?: LibraryNode[];
}

export interface LibraryFolder {
  id: string;
  parentId?: string;
  title: string;
  path: string[];
  index?: number;
  writable: boolean;
}

export interface LibraryBookmark {
  id: string;
  parentId?: string;
  title: string;
  url: string;
  index?: number;
  folderPath: string[];
}

export interface BookmarkLibrary {
  folders: LibraryFolder[];
  bookmarks: LibraryBookmark[];
}

export function describeLibrary(tree: LibraryNode[]): BookmarkLibrary {
  const library: BookmarkLibrary = { folders: [], bookmarks: [] };
  function visit(node: LibraryNode, path: string[], writable: boolean) {
    if (node.url !== undefined) {
      library.bookmarks.push({ id: node.id, parentId: node.parentId, title: node.title,
        url: node.url, index: node.index, folderPath: path });
      return;
    }
    // Chrome's invisible tree root is structural. Keep the visible root folders.
    const visible = node.parentId !== undefined;
    const folderPath = visible ? [...path, node.title || 'Untitled folder'] : path;
    const canWrite = writable && !node.unmodifiable;
    if (visible) {
      library.folders.push({ id: node.id, parentId: node.parentId, title: node.title,
        path: folderPath, index: node.index, writable: canWrite });
    }
    for (const child of node.children ?? []) visit(child, folderPath, canWrite);
  }
  for (const node of tree) visit(node, [], true);
  return library;
}

export function createBookmarkLibrary(getTree: () => Promise<LibraryNode[]>) {
  let revision = 0;
  let cached: BookmarkLibrary | undefined;
  let pending: Promise<BookmarkLibrary> | undefined;

  async function read(): Promise<BookmarkLibrary> {
    // A bookmark event during getTree invalidates that read as well as the cache.
    while (!cached) {
      const startedAt = revision;
      const tree = await getTree();
      if (startedAt === revision) cached = describeLibrary(tree);
    }
    return cached;
  }

  return {
    invalidate() {
      revision++;
      cached = undefined;
    },
    get() {
      if (cached) return Promise.resolve(cached);
      pending ??= read().finally(() => { pending = undefined; });
      return pending;
    },
  };
}
