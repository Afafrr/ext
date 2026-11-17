import assert from 'node:assert/strict';
import test from 'node:test';
import { prepareIndex, reuseIndexEntries } from '../lib/model-index.ts';
import type { BookmarkLibrary } from '../lib/bookmark-library.ts';

function library(): BookmarkLibrary {
  return {
    folders: [{ id: 'folder', title: 'Docs', parentId: 'bar', path: ['Work', 'Docs'], writable: true }],
    bookmarks: [
      { id: 'first', parentId: 'folder', title: 'A guide', url: 'https://example.com/a', folderPath: ['Work', 'Docs'] },
      { id: 'second', parentId: 'folder', title: '', url: 'https://example.com/b', folderPath: ['Work', 'Docs'] }
    ]
  };
}

test('initial index uses full folder paths and bookmark titles with URL fallback', async () => {
  const source = library();
  const before = structuredClone(source);
  const job = await prepareIndex(source, 'minilm-q8');
  assert.equal(job.folderCount, 1);
  assert.equal(job.bookmarkCount, 2);
  assert.deepEqual(job.entries, [
    { kind: 'folder', id: 'folder', text: 'Work / Docs' },
    { kind: 'bookmark', id: 'first', text: 'A guide' },
    { kind: 'bookmark', id: 'second', text: 'https://example.com/b' }
  ]);
  assert.deepEqual(source, before);
});

test('index fingerprint distinguishes model, title, folder path and bookmark identity', async () => {
  const first = await prepareIndex(library(), 'minilm-q8');
  assert.equal((await prepareIndex(library(), 'minilm-q8')).fingerprint, first.fingerprint);
  assert.notEqual((await prepareIndex(library(), 'bge-q8')).fingerprint, first.fingerprint);
  for (const change of [
    (data: BookmarkLibrary) => { data.bookmarks[0]!.title = 'Changed'; },
    (data: BookmarkLibrary) => { data.folders[0]!.path = ['Personal', 'Docs']; },
    (data: BookmarkLibrary) => { data.bookmarks[0]!.id = 'another'; }
  ]) {
    const changed = library();
    change(changed);
    assert.notEqual((await prepareIndex(changed, 'minilm-q8')).fingerprint, first.fingerprint);
  }
});

test('index preparation bounds input size and supports an empty library', async () => {
  const source = library();
  source.bookmarks[0]!.title = 'a'.repeat(5000);
  const job = await prepareIndex(source, 'minilm-q8');
  assert.equal(job.entries[1]!.text.length, 4000);
  const empty = await prepareIndex({ folders: [], bookmarks: [] }, 'minilm-q8');
  assert.deepEqual(empty.entries, []);
  assert.equal(empty.bookmarkCount + empty.folderCount, 0);
});


test('index synchronization reuses unchanged entries, embeds edits and drops deleted IDs', async () => {
  const job = await prepareIndex(library(), 'minilm-q8');
  const entries = job.entries.map(entry => ({ ...entry, vector: new Float32Array([1, 0]) }));
  const metadata = { preset: job.preset, configuration: job.configuration, fingerprint: job.fingerprint,
    updatedAt: '', completed: entries.length, total: entries.length, folderCount: 1, bookmarkCount: 2 };
  const changed = library();
  changed.bookmarks[0]!.title = 'Edited title';
  changed.bookmarks.pop();
  const next = await prepareIndex(changed, 'minilm-q8');
  const plan = reuseIndexEntries(next, metadata, entries);
  assert.deepEqual(plan.reused.map(entry => entry.id), ['folder']);
  assert.deepEqual(plan.pending.map(entry => entry.id), ['first']);
  assert.equal(plan.reused[0]!.vector, entries[0]!.vector);
  assert.equal(reuseIndexEntries(next, undefined, entries).reused.length, 0);
  assert.equal(reuseIndexEntries(next, { ...metadata, configuration: 'old configuration' }, entries).reused.length, 0);
  assert.equal(reuseIndexEntries(next, { ...metadata, configuration: undefined }, entries).reused.length, 0);
});
