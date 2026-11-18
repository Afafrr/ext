import type { BookmarkLibrary } from './bookmark-library.ts';
import type { VectorEntry } from './model-index.ts';

const BOOKMARKS_BAR_PENALTY = .2;

export interface FolderSuggestion {
  id: string;
  path: string[];
  score: number;
}

export function rankFolders(query: number[], library: BookmarkLibrary, entries: VectorEntry[], bookmarkId: string): FolderSuggestion[] {
  const similarities = new Map<string, number>();
  for (const entry of entries) {
    if (entry.vector.length !== query.length) continue;
    let score = 0;
    for (let index = 0; index < query.length; index++) score += query[index]! * entry.vector[index]!;
    similarities.set(`${entry.kind}:${entry.id}`, score);
  }
  const closest = new Map<string, number>();
  for (const bookmark of library.bookmarks) {
    if (bookmark.id === bookmarkId || !bookmark.parentId) continue;
    const score = similarities.get(`bookmark:${bookmark.id}`);
    if (score !== undefined) closest.set(bookmark.parentId, Math.max(closest.get(bookmark.parentId) ?? -Infinity, score));
  }
  const suggestions: FolderSuggestion[] = [];
  for (const folder of library.folders) {
    const folderScore = similarities.get(`folder:${folder.id}`);
    if (!folder.writable || folderScore === undefined) continue;
    const bookmarkScore = closest.get(folder.id);
    const score = bookmarkScore === undefined ? folderScore : .3 * folderScore + .7 * bookmarkScore;
    // Chrome before 134 does not expose folderType; its bookmarks bar has ID 1 under root 0.
    const isBookmarksBar = folder.folderType === 'bookmarks-bar'
      || (folder.folderType === undefined && folder.id === '1' && folder.parentId === '0');
    suggestions.push({ id: folder.id, path: folder.path,
      // Subtracting also keeps negative similarities from improving after the penalty.
      score: isBookmarksBar ? score - BOOKMARKS_BAR_PENALTY * Math.abs(score) : score });
  }
  return suggestions.sort((left, right) => right.score - left.score).slice(0, 3);
}
