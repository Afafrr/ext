import assert from 'node:assert/strict';
import { registerHooks } from 'node:module';
import test from 'node:test';
import type { BookmarkLibrary, LibraryNode } from '../lib/bookmark-library.ts';
import { MODEL_COMMAND, MODEL_EVENT, MODEL_SETTINGS_KEY, MODEL_STATE_KEY,
  emptyModelState, type BookmarkSuggestion, type ModelSettings, type ModelState } from '../lib/model-state.ts';

// Run the real controller with simulated Chrome events and in-memory storage.
// Model inference and IndexedDB are unrelated to the ordering of bookmark moves.
const browserModule = `data:text/javascript,${encodeURIComponent(
  'export const browser = new Proxy({}, { get: (_, key) => globalThis.controllerTestBrowser[key] });',
)}`;
const indexModule = `data:text/javascript,${encodeURIComponent(`
  export { prepareIndex } from ${JSON.stringify(new URL('../lib/model-index.ts', import.meta.url).href)};
  export const readIndexMetadata = async () => undefined;
  export const readFolderDescriptions = async () => [];
  export const saveFolderDescription = async () => {};
  export const removeFolderDescriptions = async () => {};
`)}`;
const hooks = registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier === 'wxt/browser') return { url: browserModule, shortCircuit: true };
    if (context.parentURL?.endsWith('/lib/model-controller.ts') && specifier.startsWith('./')) {
      if (specifier === './model-index') return { url: indexModule, shortCircuit: true };
      return nextResolve(new URL(`${specifier}.ts`, context.parentURL).href, context);
    }
    return nextResolve(specifier, context);
  },
});
const { createModelController } = await import('../lib/model-controller.ts');
hooks.deregister();

function harness() {
  const nodes = new Map<string, LibraryNode>([
    ...['source', 'first', 'second'].map(id => [id, { id, parentId: 'root', title: id }] as const),
    ['bookmark', { id: 'bookmark', parentId: 'source', title: 'New page', url: 'https://example.test/page' }],
  ]);
  const local: Record<string, unknown> = { [MODEL_SETTINGS_KEY]: { enabled: true, preset: 'minilm-q8', autoMove: true } };
  const session: Record<string, unknown> = {};
  const storage = (data: Record<string, unknown>) => ({
    async get(key: string) { return structuredClone({ [key]: data[key] }); },
    async set(values: Record<string, unknown>) { Object.assign(data, structuredClone(values)); },
  });
  type Response = { ok: boolean; settings: ModelSettings; state: ModelState };
  let listener!: (message: Record<string, unknown>, sender: { id: string }, respond: (response: Response) => undefined) => unknown;
  const moves: { id: string; parentId: string }[] = [];
  const events: Promise<unknown>[] = [];
  let failMove = false;
  let sequence = 0;
  let controller: ReturnType<typeof createModelController>;
  const api = {
    storage: { local: storage(local), session: storage(session) },
    runtime: {
      id: 'extension',
      onMessage: { addListener(next: typeof listener) { listener = next; } },
      async getContexts() { return [{}]; },
      async sendMessage(message: { action: string }) {
        return message.action === 'status'
          ? { instance: 'offscreen', sequence: 0, state: emptyModelState() }
          : { accepted: true };
      },
    },
    offscreen: { async closeDocument() {} },
    bookmarks: {
      async get(id: string) {
        const node = nodes.get(id);
        if (!node) throw new Error('Node no longer exists');
        return [structuredClone(node)];
      },
      async move(id: string, destination: { parentId: string }) {
        const node = nodes.get(id);
        if (failMove || !node || !nodes.has(destination.parentId)) throw new Error('Cannot move');
        const oldParentId = node.parentId!;
        node.parentId = destination.parentId;
        moves.push({ id, parentId: destination.parentId });
        events.push(controller.onMoved(id, { oldParentId, parentId: destination.parentId }));
        return structuredClone(node);
      },
    },
  };
  Reflect.set(globalThis, 'controllerTestBrowser', api);
  const library = async (): Promise<BookmarkLibrary> => ({
    folders: ['source', 'first', 'second'].map(id => ({ id, title: id, path: [id], writable: true })),
    bookmarks: [...nodes.values()].filter(node => node.url !== undefined).map(node => ({
      id: node.id, parentId: node.parentId, title: node.title, url: node.url!, folderPath: [],
    })),
  });
  controller = createModelController(library);
  const request = (message: Record<string, unknown>) => new Promise<Response>(resolve => {
    listener(message, { id: 'extension' }, response => { resolve(structuredClone(response)); });
  });
  async function drain() {
    while (events.length) await Promise.all(events.splice(0));
  }
  return {
    nodes, moves, api,
    async ready() { await request({ type: MODEL_COMMAND, action: 'get' }); },
    async state() { return (await request({ type: MODEL_COMMAND, action: 'get' })).state; },
    async result(bookmarkId = 'bookmark') {
      const suggestion: BookmarkSuggestion = { bookmarkId, title: 'New page', autoMove: { parentId: 'source', url: nodes.get(bookmarkId)!.url! },
        folders: ['first', 'second'].map((id, index) => ({ id, path: [id], score: 1 - index / 10 })) };
      await request({ type: MODEL_EVENT, instance: 'offscreen', sequence: ++sequence,
        state: { ...emptyModelState(), status: 'ready', suggestion } });
      await drain();
    },
    async externalMove(parentId: string, id = 'bookmark') {
      await api.bookmarks.move(id, { parentId });
      await drain();
    },
    async manualMove(parentId: string) {
      const response = await request({ type: MODEL_COMMAND, action: 'moveBookmark', id: 'bookmark', parentId });
      assert.equal(response.ok, true);
      await drain();
    },
    async optOut() {
      await request({ type: MODEL_COMMAND, action: 'settings', settings: { enabled: true, preset: 'minilm-q8', autoMove: false } });
    },
    restart() { controller = createModelController(library); },
    failMoves() { failMove = true; },
  };
}

test('moves to the first AI folder and corrects a Chrome-style return to the source exactly once', async () => {
  const h = harness();
  await h.ready();
  await h.result();
  assert.equal(h.nodes.get('bookmark')!.parentId, 'first');
  await h.externalMove('source');
  assert.equal(h.nodes.get('bookmark')!.parentId, 'first');
  assert.deepEqual(h.moves.map(move => move.parentId), ['first', 'source', 'first']);
  await h.externalMove('source');
  await h.result();
  assert.equal(h.nodes.get('bookmark')!.parentId, 'source');
});

test('still applies the first AI folder if Chrome changes the parent while inference is running', async () => {
  const h = harness();
  await h.ready();
  await h.externalMove('second');
  await h.result();
  assert.equal(h.nodes.get('bookmark')!.parentId, 'first');
});

test('manual Move here cancels the pending correction before moving back to the source', async () => {
  const h = harness();
  await h.ready();
  await h.result();
  await h.manualMove('source');
  await h.result();
  assert.equal(h.nodes.get('bookmark')!.parentId, 'source');
  assert.deepEqual((await h.state()).pendingAutoMoves, []);
});

test('moving to another folder or switching off automation cancels the correction', async () => {
  for (const optOut of [false, true]) {
    const h = harness();
    await h.ready();
    await h.result();
    if (optOut) await h.optOut();
    else await h.externalMove('second');
    await h.externalMove('source');
    assert.equal(h.nodes.get('bookmark')!.parentId, 'source');
  }
});

test('pending corrections survive a service worker restart and remain separate for concurrent saves', async () => {
  const h = harness();
  h.nodes.set('another', { id: 'another', parentId: 'source', title: 'Another page', url: 'https://example.test/another' });
  await h.ready();
  await h.result();
  await h.result('another');
  h.restart();
  await h.ready();
  await Promise.all([h.externalMove('source'), h.externalMove('source', 'another')]);
  assert.equal(h.nodes.get('bookmark')!.parentId, 'first');
  assert.equal(h.nodes.get('another')!.parentId, 'first');
});

test('a failed correction is reported and consumed without repeated moves', async () => {
  const h = harness();
  await h.ready();
  await h.result();
  h.nodes.delete('first');
  await h.externalMove('source');
  assert.equal(h.nodes.get('bookmark')!.parentId, 'source');
  assert.match((await h.state()).autoMoveError!, /Could not restore/);
  assert.deepEqual((await h.state()).pendingAutoMoves, []);
});

test('a failed initial automatic move is reported without leaving a pending correction', async () => {
  const h = harness();
  await h.ready();
  h.failMoves();
  await h.result();
  assert.equal(h.nodes.get('bookmark')!.parentId, 'source');
  assert.match((await h.state()).autoMoveError!, /Could not move/);
  assert.deepEqual((await h.state()).pendingAutoMoves, []);
});
