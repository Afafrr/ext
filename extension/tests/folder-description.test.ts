import assert from 'node:assert/strict';
import test from 'node:test';
import { generateFolderDescriptions, prepareComparisonIndex } from '../lib/folder-description.ts';
import { prepareIndex, reuseIndexEntries } from '../lib/model-index.ts';
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

test('comparison removes self influence from a previously empty folder and invalidates its cached vector', async () => {
  const library: BookmarkLibrary = {
    folders: [{ id: 'folder', title: 'Inbox', path: ['Inbox'], writable: true }],
    bookmarks: [{ id: 'new', title: 'React hooks', url: 'https://a', parentId: 'folder', folderPath: ['Inbox'] }],
  };
  const initial = await prepareIndex(library, 'minilm-q8');
  const bookmarkVectors = initial.entries.filter(entry => entry.kind === 'bookmark')
    .map(entry => ({ ...entry, vector: new Float32Array([1, 0]) }));
  const descriptions = generateFolderDescriptions(initial, bookmarkVectors);
  assert.equal(descriptions[0]!.description, 'Inbox — React hooks');
  const indexed = await prepareIndex(library, 'minilm-q8', descriptions);
  const vectors = indexed.entries.map(entry => ({ ...entry, vector: new Float32Array([1, 0]) }));
  const before = structuredClone({ library, descriptions, vectors });

  const { index: comparison } = await prepareComparisonIndex(library, 'minilm-q8', descriptions, 'new', async () => vectors);
  assert.deepEqual(comparison.entries, [{ kind: 'folder', id: 'folder', text: 'Inbox' }]);
  assert.deepEqual(comparison.folders[0]!.bookmarks, []);
  assert.equal(comparison.bookmarkCount, 0);
  const metadata = { ...indexed, updatedAt: '', completed: vectors.length, total: vectors.length };
  const plan = reuseIndexEntries(comparison, metadata, vectors);
  assert.deepEqual(plan.reused, []);
  assert.deepEqual(plan.pending, comparison.entries);
  assert.deepEqual({ library, descriptions, vectors }, before);
});

test('comparison regenerates a populated folder description using only the other bookmarks', async () => {
  const library: BookmarkLibrary = {
    folders: [{ id: 'folder', title: 'Inbox', path: ['Inbox'], writable: true }],
    bookmarks: [
      { id: 'old', title: 'Cooking', url: 'https://a', parentId: 'folder', folderPath: ['Inbox'] },
      { id: 'new', title: 'React hooks', url: 'https://b', parentId: 'folder', folderPath: ['Inbox'] },
    ],
  };
  const initial = await prepareIndex(library, 'minilm-q8');
  const vectors = initial.entries.map(entry => ({ ...entry, vector: new Float32Array([1, 0]) }));
  const descriptions = generateFolderDescriptions(initial, vectors);
  const { index: comparison } = await prepareComparisonIndex(library, 'minilm-q8', descriptions, 'new', async () => vectors);
  assert.equal(comparison.entries[0]!.text, 'Inbox\nInbox — Cooking');
  assert.deepEqual(comparison.entries.filter(entry => entry.kind === 'bookmark').map(entry => entry.id), ['old']);
  assert.equal(comparison.folders[0]!.bookmarks.some(entry => entry.id === 'new'), false);

  for (const description of ['My manual description', '']) {
    const { index: manual } = await prepareComparisonIndex(library, 'minilm-q8', [{ id: 'folder', description }], 'new', async () => vectors);
    assert.equal(manual.entries[0]!.text, ['Inbox', description].filter(Boolean).join('\n'));
  }
});

test('comparison is independent of the evaluated bookmark placement even with persisted generated descriptions', async () => {
  const library: BookmarkLibrary = {
    folders: ['left', 'right'].map(id => ({ id, title: 'Inbox', path: ['Inbox'], writable: true })),
    bookmarks: [{ id: 'new', title: 'React hooks', url: 'https://a', parentId: 'left', folderPath: ['Inbox'] }],
  };
  const comparisons = [];
  for (const parentId of ['left', 'right']) {
    library.bookmarks[0]!.parentId = parentId;
    const initial = await prepareIndex(library, 'minilm-q8');
    const vectors = initial.entries.map(entry => ({ ...entry, vector: new Float32Array([1, 0]) }));
    const descriptions = generateFolderDescriptions(initial, vectors);
    const { index } = await prepareComparisonIndex(library, 'minilm-q8', descriptions, 'new', async () => vectors);
    comparisons.push(index);
  }
  assert.deepEqual(comparisons[0], comparisons[1]);
});

test('comparison refreshes stale descriptions from the latest bookmarks before the persistent index is updated', async () => {
  const library: BookmarkLibrary = {
    folders: ['source', 'target'].map(id => ({ id, title: id, path: [id], writable: true })),
    bookmarks: [
      { id: 'new', title: 'New page', url: 'https://new', parentId: 'source', folderPath: ['source'] },
      { id: 'old', title: 'Edited title', url: 'https://old', parentId: 'target', folderPath: ['target'] },
    ],
  };
  const savedDescriptions = [{ id: 'target', source: 'generated' as const, description: 'target — Old title' }];
  const { index, bookmarkVectors } = await prepareComparisonIndex(library, 'minilm-q8', savedDescriptions, 'new', async job => {
    const bookmarks = job.entries.filter(entry => entry.kind === 'bookmark');
    assert.deepEqual(bookmarks.map(row => row.id), ['old']);
    return bookmarks.map(entry => ({ ...entry, vector: new Float32Array([1, 0]) }));
  });
  assert.equal(index.entries.find(entry => entry.id === 'target')?.description, 'target — Edited title');
  assert.equal(index.entries.find(entry => entry.id === 'source')?.description, undefined);
  assert.equal(bookmarkVectors[0]?.text, 'Edited title');
  assert.equal(savedDescriptions[0]!.description, 'target — Old title');
});
