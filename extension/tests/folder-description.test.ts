import assert from 'node:assert/strict';
import test from 'node:test';
import { generateFolderDescriptions } from '../lib/folder-description.ts';
import { prepareIndex } from '../lib/model-index.ts';
import type { BookmarkLibrary } from '../lib/bookmark-library.ts';

test('uses selected model vectors to choose representative titles and includes the full folder path', async () => {
  const library: BookmarkLibrary = {
    folders: [{ id: 'folder', title: 'React', path: ['Work', 'React'], writable: true }],
    bookmarks: [
      { id: 'one', title: 'Hooks', url: 'https://a', parentId: 'folder', folderPath: [] },
      { id: 'two', title: 'Components', url: 'https://b', parentId: 'folder', folderPath: [] },
      { id: 'three', title: 'Unrelated recipe', url: 'https://c', parentId: 'folder', folderPath: [] },
      { id: 'four', title: 'State', url: 'https://d', parentId: 'folder', folderPath: [] },
    ],
  };
  const job = await prepareIndex(library, 'minilm-q8');
  const vectors = job.entries.filter(entry => entry.kind === 'bookmark').map(entry => ({
    ...entry, vector: new Float32Array(entry.id === 'three' ? [-1, 0] : [1, 0]),
  }));
  const descriptions = generateFolderDescriptions(job, vectors);
  assert.equal(descriptions[0]!.description, 'Work / React — Hooks · Components · State');
  assert.equal(descriptions[0]!.source, 'generated');
  assert.equal(descriptions[0]!.description.length <= 240, true);
  assert.notEqual((await prepareIndex({ ...library, bookmarks: library.bookmarks.slice(1) }, 'minilm-q8')).fingerprint, job.fingerprint);
  const moved = structuredClone(library);
  moved.bookmarks[0]!.parentId = 'another-folder';
  assert.notEqual((await prepareIndex(moved, 'minilm-q8')).fingerprint, job.fingerprint);
  const missingTitle = structuredClone(library);
  missingTitle.bookmarks[0]!.title = '';
  assert.equal((await prepareIndex(missingTitle, 'minilm-q8')).folders[0]!.bookmarks[0]!.title, 'https://a');
});
