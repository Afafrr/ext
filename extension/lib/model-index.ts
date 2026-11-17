import type { BookmarkLibrary } from './bookmark-library.ts';
import { MODEL_PRESETS, type ModelPreset } from './model-state.ts';

export interface IndexEntry {
  kind: 'folder' | 'bookmark';
  id: string;
  text: string;
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
  fingerprint: string;
  folderCount: number;
  bookmarkCount: number;
}

export async function prepareIndex(library: BookmarkLibrary, preset: ModelPreset): Promise<IndexJob> {
  const entries: IndexEntry[] = [
    ...library.folders.map(folder => ({ kind: 'folder' as const, id: folder.id, text: folder.path.join(' / ').slice(0, 4000) })),
    ...library.bookmarks.map(bookmark => ({ kind: 'bookmark' as const, id: bookmark.id, text: (bookmark.title || bookmark.url).slice(0, 4000) })),
  ];
  const model = MODEL_PRESETS[preset];
  const configuration = JSON.stringify({ version: 1, model: model.id, revision: model.revision,
    dtype: model.dtype, pooling: model.pooling, maxTokens: 128 });
  const input = JSON.stringify({ configuration, entries });
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input));
  const fingerprint = Array.from(new Uint8Array(digest), value => value.toString(16).padStart(2, '0')).join('');
  return { kind: 'index', preset, entries, fingerprint, configuration,
    folderCount: library.folders.length, bookmarkCount: library.bookmarks.length };
}

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('bookmark-embeddings', 1);
    request.onupgradeneeded = () => request.result.createObjectStore('indexes');
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

export function reuseIndexEntries(job: IndexJob, previous: IndexMetadata | undefined, entries: VectorEntry[]) {
  const saved = new Map(entries.map(entry => [`${entry.kind}:${entry.id}`, entry]));
  const reused: VectorEntry[] = [];
  const pending: IndexEntry[] = [];
  for (const entry of job.entries) {
    const existing = saved.get(`${entry.kind}:${entry.id}`);
    if (previous?.configuration === job.configuration && existing?.text === entry.text) {
      reused.push(existing);
    } else {
      pending.push(entry);
    }
  }
  return { reused, pending };
}
