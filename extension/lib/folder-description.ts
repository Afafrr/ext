import type { BookmarkLibrary } from './bookmark-library.ts';
import { prepareIndex, type FolderDescription, type IndexJob, type VectorEntry } from './model-index.ts';
import type { ModelPreset } from './model-state.ts';

export function folderDescriptionInput(folder: IndexJob['folders'][number], preset: ModelPreset): string {
  return JSON.stringify({ path: folder.path, bookmarks: folder.bookmarks, preset });
}

/** Build transient comparison data from the current library without the evaluated bookmark. */
export async function prepareComparisonIndex(library: BookmarkLibrary, preset: ModelPreset,
  descriptions: FolderDescription[], bookmarkId: string, getBookmarkVectors: (job: IndexJob) => Promise<VectorEntry[]>) {
  const referenceLibrary = { ...library, bookmarks: library.bookmarks.filter(entry => entry.id !== bookmarkId) };
  const job = await prepareIndex(referenceLibrary, preset, descriptions);
  const bookmarkVectors = await getBookmarkVectors(job);
  const byId = new Map(descriptions.map(folder => [folder.id, folder]));
  const staleFolders = job.folders.filter(folder => {
    const saved = byId.get(folder.id);
    if (saved && saved.source !== 'generated') return false;
    if (!folder.bookmarks.length) return Boolean(saved);
    return saved?.input !== folderDescriptionInput(folder, preset);
  });
  if (!staleFolders.length) return { index: job, bookmarkVectors };
  const refreshed = generateFolderDescriptions({ ...job, folders: staleFolders }, bookmarkVectors);
  if (!refreshed.some(folder => folder.description !== (byId.get(folder.id)?.description ?? ''))) {
    return { index: job, bookmarkVectors };
  }
  for (const folder of refreshed) byId.set(folder.id, folder);
  const index = await prepareIndex(referenceLibrary, preset, [...byId.values()]);
  return { index, bookmarkVectors };
}

/** Select titles nearest the folder centroid using the selected embedding model. */
export function generateFolderDescriptions(job: IndexJob, vectors: VectorEntry[]): FolderDescription[] {
  const byId = new Map(vectors.filter(entry => entry.kind === 'bookmark').map(entry => [entry.id, entry.vector]));
  const descriptions: FolderDescription[] = [];
  for (const folder of job.folders) {
    const bookmarks = folder.bookmarks.map(bookmark => ({ ...bookmark, vector: byId.get(bookmark.id) }))
      .filter((bookmark): bookmark is typeof bookmark & { vector: Float32Array } => Boolean(bookmark.vector));
    if (!bookmarks.length) {
      if (folder.bookmarks.length === 0) {
        descriptions.push({ id: folder.id, description: '', source: 'generated', input: folderDescriptionInput(folder, job.preset) });
      }
      continue;
    }
    const centroid = new Float64Array(bookmarks[0]!.vector.length);
    for (const bookmark of bookmarks) {
      for (let i = 0; i < centroid.length; i++) centroid[i] = centroid[i]! + (bookmark.vector[i] ?? 0);
    }
    const ranked = bookmarks.map(bookmark => {
      let score = 0;
      for (let i = 0; i < centroid.length; i++) score += bookmark.vector[i]! * centroid[i]!;
      return { title: bookmark.title, score };
    }).sort((a, b) => b.score - a.score);
    const titles = [...new Set(ranked.map(bookmark => bookmark.title.slice(0, 45)))].slice(0, 3);
    const description = `${folder.path.join(' / ').slice(-80)} — ${titles.join(' · ')}`.slice(0, 240);
    const input = folderDescriptionInput(folder, job.preset);
    descriptions.push({ id: folder.id, description, source: 'generated', input });
  }
  return descriptions;
}
