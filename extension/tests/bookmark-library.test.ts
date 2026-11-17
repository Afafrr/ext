import assert from 'node:assert/strict';
import test from 'node:test';
import { createBookmarkLibrary, describeLibrary, type LibraryNode } from '../lib/bookmark-library.ts';

function tree(): LibraryNode[] {
  return [{ id: '0', title: '', children: [{ id: '1', parentId: '0', title: 'Bar', children: [
    { id: 'work', parentId: '1', title: 'Work', children: [
      { id: 'docs', parentId: 'work', title: 'Docs', index: 0, children: [
        { id: 'page', parentId: 'docs', title: '<b>Guide</b>', url: 'https://example.com', index: 0 }
      ] }
    ] },
    { id: 'empty', parentId: '1', title: 'Docs', children: [] },
    { id: 'managed', parentId: '1', title: 'Company', unmodifiable: 'managed', children: [
      { id: 'managed-child', parentId: 'managed', title: 'Policy', children: [] }
    ] }
  ] }] }];
}

test('reads all folders, empty folders and bookmarks with stable IDs and full paths', () => {
  const source = tree(), original = structuredClone(source);
  const library = describeLibrary(source);
  assert.equal(library.folders.length, 6);
  assert.equal(library.bookmarks.length, 1);
  assert(!library.folders.some(folder => folder.id === '0'));
  assert.deepEqual(library.folders.find(folder => folder.id === 'docs')?.path, ['Bar', 'Work', 'Docs']);
  assert.deepEqual(library.folders.find(folder => folder.id === 'empty')?.path, ['Bar', 'Docs']);
  assert.equal(library.folders.find(folder => folder.id === 'managed-child')?.writable, false);
  assert.deepEqual(library.bookmarks[0], {
    id: 'page', parentId: 'docs', title: '<b>Guide</b>', url: 'https://example.com', index: 0,
    folderPath: ['Bar', 'Work', 'Docs']
  });
  assert.deepEqual(source, original);
  assert.deepEqual(describeLibrary([]), { folders: [], bookmarks: [] });
});

test('coalesces reads and refreshes renamed, moved, created and deleted nodes after invalidation', async () => {
  let source = tree(), calls = 0;
  const library = createBookmarkLibrary(async () => { calls++; return structuredClone(source); });
  const [first, concurrent] = await Promise.all([library.get(), library.get()]);
  assert.deepEqual(first, concurrent);
  assert.equal(calls, 1);
  await library.get();
  assert.equal(calls, 1);
  source = [{ id: '0', title: '', children: [{ id: 'empty', parentId: '0', title: 'Renamed', children: [
    { id: 'page', parentId: 'empty', title: 'Updated', url: 'https://example.org' },
    { id: 'new', parentId: 'empty', title: 'New', url: 'https://new.example' }
  ] }] }];
  library.invalidate();
  const updated = await library.get();
  assert.equal(calls, 2);
  assert.equal(updated.folders.length, 1);
  assert.equal(updated.bookmarks.length, 2);
  assert.equal(updated.bookmarks[0]?.parentId, 'empty');
  assert.deepEqual(updated.bookmarks[0]?.folderPath, ['Renamed']);
  assert.equal(updated.bookmarks[0]?.url, 'https://example.org');
});

test('discards a stale in-flight snapshot when the library changes during getTree', async () => {
  let resolve!: (nodes: LibraryNode[]) => void;
  let calls = 0;
  const library = createBookmarkLibrary(() => {
    calls++;
    return calls === 1 ? new Promise<LibraryNode[]>(done => { resolve = done; }) : Promise.resolve([]);
  });
  const pending = library.get();
  library.invalidate();
  resolve(tree());
  assert.deepEqual(await pending, { folders: [], bookmarks: [] });
  assert.equal(calls, 2);
});

test('retries after a failed Chrome API read', async () => {
  let fail = true;
  const library = createBookmarkLibrary(async () => {
    if (fail) throw new Error('Unavailable');
    return tree();
  });
  await assert.rejects(library.get(), /Unavailable/);
  fail = false;
  assert.equal((await library.get()).bookmarks.length, 1);
});

test('an invalidation immediately after a cached read starts a fresh API request', async () => {
  let calls = 0;
  const library = createBookmarkLibrary(async () => ++calls === 1 ? tree() : []);
  await library.get();
  const previous = library.get();
  library.invalidate();
  const current = library.get();
  assert.equal((await previous).bookmarks.length, 1);
  assert.deepEqual(await current, { folders: [], bookmarks: [] });
  assert.equal(calls, 2);
});
