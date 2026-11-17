import type { BookmarkLibrary } from './bookmark-library.ts';
import { prepareIndex, type FolderDescription, type IndexJob, type VectorEntry } from './model-index.ts';
import type { ModelPreset } from './model-state.ts';

/** Build transient comparison data without the evaluated bookmark's influence. */
export async function prepareComparisonIndex(library: BookmarkLibrary, preset: ModelPreset,
  descriptions: FolderDescription[], vectors: VectorEntry[], bookmarkId: string): Promise<IndexJob> {
  const bookmark = library.bookmarks.find(entry => entry.id === bookmarkId);
  const referenceLibrary = { ...library, bookmarks: library.bookmarks.filter(entry => entry.id !== bookmarkId) };
  const affectedFolder = await prepareIndex({
    folders: library.folders.filter(folder => folder.id === bookmark?.parentId),
    bookmarks: referenceLibrary.bookmarks.filter(entry => entry.parentId === bookmark?.parentId),
  }, preset);
  const byId = new Map(descriptions.map(folder => [folder.id, folder]));
  for (const folder of generateFolderDescriptions(affectedFolder, vectors)) {
    const existing = byId.get(folder.id);
    if (!existing || existing.source === 'generated') byId.set(folder.id, folder);
  }
  return prepareIndex(referenceLibrary, preset, [...byId.values()]);
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
        descriptions.push({ id: folder.id, description: '', source: 'generated', input: JSON.stringify({ path: folder.path, bookmarks: folder.bookmarks, preset: job.preset }) });
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
    const input = JSON.stringify({ path: folder.path, bookmarks: folder.bookmarks, preset: job.preset });
    descriptions.push({ id: folder.id, description, source: 'generated', input });
  }
  return descriptions;
}
