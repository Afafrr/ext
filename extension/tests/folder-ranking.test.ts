import assert from 'node:assert/strict';
import test from 'node:test';
import { rankFolders } from '../lib/folder-ranking.ts';
import type { BookmarkLibrary } from '../lib/bookmark-library.ts';
import type { VectorEntry } from '../lib/model-index.ts';

test('folder ranking uses 30/70 scoring, excludes the new bookmark and managed folders', () => {
  const library: BookmarkLibrary = {
    folders: ['docs', 'other', 'managed', 'empty'].map(id => ({ id, title: id, path: [id], writable: id !== 'managed' })),
    bookmarks: [
      { id: 'new', parentId: 'other', title: 'New', url: '', folderPath: ['other'] },
      { id: 'reference', parentId: 'docs', title: 'Reference', url: '', folderPath: ['docs'] },
    ],
  };
  const entries: VectorEntry[] = [
    ...library.folders.map(folder => ({ kind: 'folder' as const, id: folder.id, text: folder.title, vector: new Float32Array([0, 1]) })),
    { kind: 'bookmark', id: 'new', text: 'New', vector: new Float32Array([1, 0]) },
    { kind: 'bookmark', id: 'reference', text: 'Reference', vector: new Float32Array([1, 0]) },
  ];
  const result = rankFolders([1, 0], library, entries, 'new');
  assert.equal(result.length, 3);
  assert.equal(result[0]!.id, 'docs');
  assert.equal(result[0]!.score, .7);
  assert.equal(result.find(row => row.id === 'other')!.score, 0);
  assert.equal(result.some(row => row.id === 'managed'), false);
  assert.equal(rankFolders([1, 0, 0], library, entries, 'new').length, 0);
});
