import assert from 'node:assert/strict';
import test from 'node:test';
import { createBookmarkDetector, type BookmarkNode } from '../lib/bookmark-detector.ts';
import {
  MAX_RECENT_BOOKMARKS,
  emptyState,
  type DetectionState,
} from '../lib/detection-state.ts';

function harness(initialState = emptyState()) {
  let state = structuredClone(initialState);
  let badgeCount = 0;
  let writes = 0;
  let failNextSave = false;
  const nodes = new Map<string, BookmarkNode>([
    ['0', { id: '0', title: '' }],
    ['1', { id: '1', title: 'Bookmarks bar', parentId: '0' }],
    ['2', { id: '2', title: 'Programowanie', parentId: '1' }],
  ]);

  function add(id: string, parentId = '2') {
    const node = { id, title: `Page ${id}`, url: `https://example.com/${id}`, parentId };
    nodes.set(id, node);
    return node;
  }

  function createDetector() {
    return createBookmarkDetector({
      async load() {
        // Async boundary plus a copy exposes lost-update bugs from parallel reads.
        await Promise.resolve();
        return structuredClone(state);
      },
      async save(next: DetectionState) {
        if (failNextSave) {
          failNextSave = false;
          throw new Error('Storage unavailable');
        }
        state = structuredClone(next);
        writes++;
      },
      async getNode(id) { return nodes.get(id); },
      async setBadgeCount(count) { badgeCount = count; },
      now: () => 1_800_000_000_000,
    });
  }

  return {
    nodes,
    add,
    createDetector,
    get state() { return state; },
    get badgeCount() { return badgeCount; },
    get writes() { return writes; },
    failNextSave() { failNextSave = true; },
  };
}

test('records a new bookmark with its multilingual folder hierarchy', async () => {
  const h = harness();
  const detector = h.createDetector();
  const node = h.add('page');
  await detector.record(node.id, node);

  assert.deepEqual(h.state.recent[0], {
    id: 'page',
    title: 'Page page',
    url: 'https://example.com/page',
    folderPath: ['Bookmarks bar', 'Programowanie'],
    folderIds: ['0', '1', '2'],
    detectedAt: 1_800_000_000_000,
  });
  assert.equal(h.badgeCount, 1);
});

test('does not scan existing bookmarks or treat new folders as saved pages', async () => {
  const h = harness();
  h.add('existing');
  const detector = h.createDetector();
  await detector.syncBadge();
  await detector.record('2', h.nodes.get('2')!);

  assert.deepEqual(h.state.recent, []);
  assert.equal(h.writes, 0);
});

test('simultaneous saves are preserved in newest-first order', async () => {
  const h = harness();
  const detector = h.createDetector();
  const nodes = Array.from({ length: 10 }, (_, i) => h.add(`page-${i}`));

  await Promise.all(nodes.map((node) => detector.record(node.id, node)));

  assert.deepEqual(h.state.recent.map((entry) => entry.id), nodes.map((n) => n.id).reverse());
  assert.equal(h.badgeCount, 10);
});

test('ignores a repeated creation event for the same bookmark', async () => {
  const h = harness();
  const detector = h.createDetector();
  const node = h.add('page');
  await Promise.all([detector.record(node.id, node), detector.record(node.id, node)]);

  assert.equal(h.state.recent.length, 1);
  assert.equal(h.writes, 1);
});

test('skips import events in order and resumes for subsequent saves', async () => {
  const h = harness();
  const detector = h.createDetector();
  const imported = h.add('imported');
  const saved = h.add('saved');

  await Promise.all([
    detector.setImporting(true),
    detector.record(imported.id, imported),
    detector.setImporting(false),
    detector.record(saved.id, saved),
  ]);

  assert.deepEqual(h.state.recent.map((entry) => entry.id), ['saved']);
  assert.equal(h.state.importInProgress, false);
});

test('import suppression survives detector recreation, like a worker restart', async () => {
  const h = harness();
  await h.createDetector().setImporting(true);
  const detector = h.createDetector();
  const node = h.add('imported-after-restart');
  await detector.record(node.id, node);

  assert.deepEqual(h.state.recent, []);
  assert.equal(h.state.importInProgress, true);
});

test('ignores a bookmark deleted before its asynchronous lookup', async () => {
  const h = harness();
  const detector = h.createDetector();
  const node = h.add('deleted');
  const pending = detector.record(node.id, node);
  h.nodes.delete(node.id);
  await pending;

  assert.equal(h.state.recent.length, 0);
  assert.equal(h.badgeCount, 0);
});

test('retains only a bounded recent list', async () => {
  const h = harness();
  const detector = h.createDetector();
  for (let i = 0; i < MAX_RECENT_BOOKMARKS + 5; i++) {
    const node = h.add(`page-${i}`);
    await detector.record(node.id, node);
  }

  assert.equal(h.state.recent.length, MAX_RECENT_BOOKMARKS);
  assert.equal(h.state.recent.at(-1)?.id, 'page-5');
  assert.equal(h.badgeCount, MAX_RECENT_BOOKMARKS);
});

test('tracks user edits and moves while preserving detection time and bookmark data', async () => {
  const h = harness();
  const detector = h.createDetector();
  const node = h.add('page');
  await detector.record(node.id, node);
  h.nodes.set('3', { id: '3', title: 'Reading', parentId: '1' });
  h.nodes.set(node.id, { ...node, title: 'Renamed', parentId: '3' });
  const bookmarkSnapshot = structuredClone([...h.nodes]);

  await detector.refresh(node.id);

  assert.equal(h.state.recent[0]?.title, 'Renamed');
  assert.deepEqual(h.state.recent[0]?.folderPath, ['Bookmarks bar', 'Reading']);
  assert.equal(h.state.recent[0]?.detectedAt, 1_800_000_000_000);
  assert.deepEqual([...h.nodes], bookmarkSnapshot);
});

test('updates descendants when a folder is renamed or moved', async () => {
  const h = harness();
  const detector = h.createDetector();
  const node = h.add('page');
  await detector.record(node.id, node);
  h.nodes.set('3', { id: '3', title: 'Work', parentId: '1' });
  h.nodes.set('2', { id: '2', title: 'Coding', parentId: '3' });

  await detector.refresh('2');

  assert.deepEqual(h.state.recent[0]?.folderPath, ['Bookmarks bar', 'Work', 'Coding']);
});

test('removes detections of deleted folders and their descendants', async () => {
  const h = harness();
  const detector = h.createDetector();
  const first = h.add('inside-folder');
  const second = h.add('outside-folder', '1');
  await detector.record(first.id, first);
  await detector.record(second.id, second);

  await detector.remove('2');

  assert.deepEqual(h.state.recent.map((entry) => entry.id), ['outside-folder']);
  assert.equal(h.badgeCount, 1);
});

test('clear removes only activity and does not reset an active import', async () => {
  const h = harness();
  const detector = h.createDetector();
  const node = h.add('page');
  await detector.record(node.id, node);
  await detector.setImporting(true);
  const bookmarkSnapshot = structuredClone([...h.nodes]);

  await detector.clear();

  assert.deepEqual(h.state, { recent: [], importInProgress: true });
  assert.equal(h.badgeCount, 0);
  assert.deepEqual([...h.nodes], bookmarkSnapshot);
});

test('a storage failure is reported but does not block future saves', async () => {
  const h = harness();
  const detector = h.createDetector();
  const first = h.add('first');
  const second = h.add('second');
  h.failNextSave();

  await assert.rejects(detector.record(first.id, first), /Storage unavailable/);
  await detector.record(second.id, second);

  assert.deepEqual(h.state.recent.map((entry) => entry.id), ['second']);
});

test('folder traversal supports deep nesting and cannot loop on malformed ancestry', async () => {
  const h = harness();
  const detector = h.createDetector();
  let parentId = '2';
  for (let i = 0; i < 100; i++) {
    const id = `folder-${i}`;
    h.nodes.set(id, { id, title: `Folder ${i}`, parentId });
    parentId = id;
  }
  const node = h.add('deep-page', parentId);
  await detector.record(node.id, node);
  assert.equal(h.state.recent[0]?.folderPath.length, 102);

  h.nodes.set('2', { id: '2', title: 'Cycle', parentId });
  await detector.refresh('2');
  assert.equal(h.state.recent[0]?.folderPath.length, 101);
});
