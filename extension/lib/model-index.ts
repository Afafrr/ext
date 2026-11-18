import type { BookmarkLibrary, LibraryNode } from './bookmark-library.ts';
import { MODEL_PRESETS, type ModelPreset } from './model-state.ts';

export interface IndexEntry {
  kind: 'folder' | 'bookmark';
  id: string;
  text: string;
  description?: string;
}
export interface FolderDescription {
  id: string;
  description: string;
  source?: 'generated';
  input?: string;
}
export interface IndexProgress {
  completed: number;
  total: number;
  folderCount: number;
  bookmarkCount: number;
}
export interface IndexMetadata extends IndexProgress {
  configuration?: string;
  preset: ModelPreset;
  fingerprint: string;
  updatedAt: string;
}
export interface IndexJob {
  kind: 'index';
  configuration: string;
  preset: ModelPreset;
  entries: IndexEntry[];
  folders: { id: string; path: string[]; bookmarks: { id: string; title: string }[] }[];
  fingerprint: string;
  folderCount: number;
  bookmarkCount: number;
}

export async function prepareIndex(library: BookmarkLibrary, preset: ModelPreset, descriptions: FolderDescription[] = []): Promise<IndexJob> {
  const byId = new Map(descriptions.map(folder => [folder.id, folder.description]));
  const entries: IndexEntry[] = [
    ...library.folders.map(folder => {
      const description = byId.get(folder.id);
      const text = [folder.path.join(' / '), description].filter(Boolean).join('\n').slice(0, 4000);
      return { kind: 'folder' as const, id: folder.id, text, ...(description ? { description } : {}) };
    }),
    ...library.bookmarks.map(bookmark => ({ kind: 'bookmark' as const, id: bookmark.id, text: (bookmark.title || bookmark.url).slice(0, 4000) })),
  ];
  const bookmarksByFolder = new Map<string, { id: string; title: string }[]>();
  for (const bookmark of library.bookmarks) {
    if (!bookmark.parentId) continue;
    const title = (bookmark.title.trim() || bookmark.url).slice(0, 4000);
    if (!title) continue;
    const bookmarks = bookmarksByFolder.get(bookmark.parentId) ?? [];
    bookmarks.push({ id: bookmark.id, title });
    bookmarksByFolder.set(bookmark.parentId, bookmarks);
  }
  const folders = library.folders.map(folder => ({ id: folder.id, path: folder.path,
    bookmarks: bookmarksByFolder.get(folder.id) ?? [] }));
  const model = MODEL_PRESETS[preset];
  const configuration = JSON.stringify({ version: 1, model: model.id, revision: model.revision,
    dtype: model.dtype, pooling: model.pooling, maxTokens: 128 });
  const input = JSON.stringify({ configuration, entries, folders });
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input));
  const fingerprint = Array.from(new Uint8Array(digest), value => value.toString(16).padStart(2, '0')).join('');
  return { kind: 'index', preset, entries, folders, fingerprint, configuration,
    folderCount: library.folders.length, bookmarkCount: library.bookmarks.length };
}

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('bookmark-embeddings', 3);
    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains('indexes')) database.createObjectStore('indexes');
      database.createObjectStore('folderDescriptions', { keyPath: 'id' });
      if (database.objectStoreNames.contains('pages')) database.deleteObjectStore('pages');
      // Rebuild indexes that previously embedded and retained page descriptions.
      const store = request.transaction!.objectStore('indexes');
      const cursor = store.openCursor();
      cursor.onsuccess = () => {
        const entry = cursor.result;
        if (!entry) return;
        const key = String(entry.key);
        if (key.endsWith(':vectors') && entry.value.some((row: IndexEntry) => row.kind === 'bookmark' && row.description !== undefined)) {
          store.delete(key);
          store.delete(key.replace(':vectors', ':metadata'));
        }
        entry.continue();
      };
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function readIndexMetadata(preset: ModelPreset): Promise<IndexMetadata | undefined> {
  const database = await openDatabase();
  try {
    return await new Promise<IndexMetadata | undefined>((resolve, reject) => {
      const request = database.transaction('indexes').objectStore('indexes').get(`${preset}:metadata`);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  } finally { database.close(); }
}

export async function saveIndex(metadata: IndexMetadata, entries: (IndexEntry & { vector: Float32Array })[]) {
  const database = await openDatabase();
  try {
    // Commit vectors and readiness together. Cancellation keeps the last complete index.
    await new Promise<void>((resolve, reject) => {
      const transaction = database.transaction('indexes', 'readwrite');
      transaction.oncomplete = () => resolve();
      transaction.onabort = () => reject(transaction.error ?? new Error('Index write aborted'));
      const store = transaction.objectStore('indexes');
      store.put(entries, `${metadata.preset}:vectors`);
      store.put(metadata, `${metadata.preset}:metadata`);
    });
  } finally { database.close(); }
}

export type VectorEntry = IndexEntry & { vector: Float32Array };

export async function readIndexEntries(preset: ModelPreset): Promise<VectorEntry[]> {
  const database = await openDatabase();
  try {
    return await new Promise((resolve, reject) => {
      const request = database.transaction('indexes').objectStore('indexes').get(`${preset}:vectors`);
      request.onsuccess = () => resolve(request.result ?? []);
      request.onerror = () => reject(request.error);
    });
  } finally { database.close(); }
}

export function reuseIndexEntries(job: Pick<IndexJob, 'entries' | 'configuration'>, previous: IndexMetadata | undefined, entries: VectorEntry[]) {
  const saved = new Map(entries.map(entry => [`${entry.kind}:${entry.id}`, entry]));
  const reused: VectorEntry[] = [];
  const pending: IndexEntry[] = [];
  for (const entry of job.entries) {
    const existing = saved.get(`${entry.kind}:${entry.id}`);
    if (previous?.configuration === job.configuration && existing?.text === entry.text) {
      reused.push({ ...entry, vector: existing.vector });
    } else {
      pending.push(entry);
    }
  }
  return { reused, pending };
}

export async function readFolderDescriptions(): Promise<FolderDescription[]> {
  const database = await openDatabase();
  try {
    return await new Promise((resolve, reject) => {
      const request = database.transaction('folderDescriptions').objectStore('folderDescriptions').getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  } finally { database.close(); }
}

export async function saveFolderDescription(folder: FolderDescription) {
  const database = await openDatabase();
  try {
    await new Promise<void>((resolve, reject) => {
      const transaction = database.transaction('folderDescriptions', 'readwrite');
      const store = transaction.objectStore('folderDescriptions');
      store.put(folder);
      transaction.oncomplete = () => resolve();
      transaction.onabort = () => reject(transaction.error ?? new Error('Folder description write aborted'));
    });
  } finally { database.close(); }
}

export async function removeFolderDescriptions(node: LibraryNode) {
  const database = await openDatabase();
  try {
    await new Promise<void>((resolve, reject) => {
      const transaction = database.transaction('folderDescriptions', 'readwrite');
      const store = transaction.objectStore('folderDescriptions');
      function remove(current: LibraryNode) {
        store.delete(current.id);
        for (const child of current.children ?? []) remove(child);
      }
      remove(node);
      transaction.oncomplete = () => resolve();
      transaction.onabort = () => reject(transaction.error ?? new Error('Folder description removal aborted'));
    });
  } finally { database.close(); }
}

/** Preserve manual edits made before or during model inference. */
export async function saveGeneratedDescriptions(folders: FolderDescription[]): Promise<boolean> {
  if (!folders.length) return false;
  const database = await openDatabase();
  try {
    return await new Promise((resolve, reject) => {
      let changed = false;
      const transaction = database.transaction('folderDescriptions', 'readwrite');
      const store = transaction.objectStore('folderDescriptions');
      for (const folder of folders) {
        const request = store.get(folder.id);
        request.onsuccess = () => {
          const existing = request.result as FolderDescription | undefined;
          if (existing && existing.source !== 'generated') return;
          if (!folder.description && !existing) return;
          if (existing && existing.input === folder.input && existing.description === folder.description) return;
          if (folder.description) store.put(folder);
          else store.delete(folder.id);
          changed = true;
        };
      }
      transaction.oncomplete = () => resolve(changed);
      transaction.onabort = () => reject(transaction.error ?? new Error('Folder description write aborted'));
    });
  } finally { database.close(); }
}
