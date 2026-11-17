import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { cp, mkdir, mkdtemp, readdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

// Runs actual ONNX inference. Use MODEL_TEST_CACHE_DIR to reuse local MiniLM
// files (the directory containing config.json and onnx/model_quantized.onnx).
// Otherwise the isolated profile downloads ~135 MB on its first tested save.
const temp = await mkdtemp(join(tmpdir(), 'bookmark-model-test-'));
const cacheDir = process.env.MODEL_TEST_CACHE_DIR || process.argv[2];
const executablePath = process.env.CHROMIUM_EXECUTABLE_PATH || process.argv[3];
const extension = join(temp, 'extension');
await cp(resolve('.output/chrome-mv3'), extension, { recursive: true });
if (cacheDir) {
  const source = resolve(cacheDir);
  const target = join(extension, 'models/Xenova/paraphrase-multilingual-MiniLM-L12-v2');
  await mkdir(join(target, 'onnx'), { recursive: true });
  for (const file of await readdir(source)) {
    if (file.endsWith('.json')) await cp(join(source, file), join(target, file));
  }
  await cp(join(source, 'onnx/model_quantized.onnx'), join(target, 'onnx/model_quantized.onnx'));
}
const launch = () => chromium.launchPersistentContext(join(temp, 'profile'), {
  channel: 'chromium', headless: true,
  executablePath,
  args: [`--disable-extensions-except=${extension}`, `--load-extension=${extension}`],
});
let context = await launch();
try {
  const sw = context.serviceWorkers()[0] || await context.waitForEvent('serviceworker');
  const id = new URL(sw.url()).hostname;
  let page = await context.newPage();
  const errors = [];
  const headerWarnings = [];
  context.on('console', message => {
    if (message.text().includes('Unable to determine content-length')) headerWarnings.push(message.text());
  });
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(`chrome-extension://${id}/popup.html`);
  if (cacheDir) {
    // Seed the same HTTPS cache keys as a real download. Cache Storage cannot
    // store chrome-extension:// request keys; workers never fetch fixtures directly.
    const files = (await readdir(resolve(cacheDir))).filter(file => file.endsWith('.json'));
    files.push('onnx/model_quantized.onnx');
    await page.evaluate(async files => {
      const cache = await caches.open('bookmark-model-test-v1');
      for (const file of files) {
        const response = await fetch(chrome.runtime.getURL(`models/Xenova/paraphrase-multilingual-MiniLM-L12-v2/${file}`));
        if (!response.ok) throw new Error('Could not read local model fixture');
        const key = `https://huggingface.co/Xenova/paraphrase-multilingual-MiniLM-L12-v2/resolve/2c4055b12046f11709e9df2c122e59ffbdc2f900/${file}`;
        // Regression fixture for servers/cache entries without Content-Length.
        const headers = new Headers(response.headers);
        headers.delete('content-length');
        await cache.put(key, new Response(response.body, { headers }));
        if ((await cache.match(key)).headers.has('content-length')) {
          throw new Error('Missing header regression fixture was not created');
        }
      }
    }, files);
  }
  const request = (action, settings) => page.evaluate(async ({ action, settings }) => {
    const response = await chrome.runtime.sendMessage({ type: 'bookmark-model-test:command', action, settings });
    if (!response?.ok) throw new Error(response?.error || 'Command failed');
    return response;
  }, { action, settings });
  const offscreenCount = () => page.evaluate(async () => (await chrome.runtime.getContexts({ contextTypes: ['OFFSCREEN_DOCUMENT'] })).length);
  const create = title => page.evaluate(title => chrome.bookmarks.create({ title, url: `https://example.test/${crypto.randomUUID()}` }), title);
  async function until(check, timeout = 60000) {
    const end = Date.now() + timeout;
    while (Date.now() < end) {
      const result = await check(); if (result) return result;
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    throw new Error('Timed out waiting for model test');
  }
  const readLibrary = () => page.evaluate(async () => {
    const result = await chrome.runtime.sendMessage({ type: 'bookmark-organizer:get-library' });
    if (!result?.ok) throw new Error('Library unavailable');
    return result.library;
  });
  const initial = await readLibrary();
  assert(initial.folders.length > 0);
  const fixture = await page.evaluate(async () => {
    const root = (await chrome.bookmarks.getTree())[0].children.find(node => node.url === undefined);
    const folder = await chrome.bookmarks.create({ parentId: root.id, title: 'Library test' });
    const nested = await chrome.bookmarks.create({ parentId: folder.id, title: 'Nested' });
    const empty = await chrome.bookmarks.create({ parentId: root.id, title: 'Empty library folder' });
    const bookmark = await chrome.bookmarks.create({ parentId: nested.id, title: 'Existing library page', url: 'https://library.example/test' });
    return { root, folder, nested, empty, bookmark };
  });
  await until(async () => (await readLibrary()).bookmarks.some(row => row.id === fixture.bookmark.id));
  const snapshot = await readLibrary();
  assert(snapshot.folders.some(row => row.id === fixture.empty.id));
  assert.deepEqual(snapshot.bookmarks.find(row => row.id === fixture.bookmark.id).folderPath,
    [fixture.root.title, 'Library test', 'Nested']);
  await page.locator('.library-panel > details > summary').click();
  await page.evaluate(id => chrome.bookmarks.update(id, { title: 'Library renamed' }), fixture.folder.id);
  await until(async () => (await readLibrary()).bookmarks.find(row => row.id === fixture.bookmark.id)?.folderPath.includes('Library renamed'));
  await until(async () => (await page.locator('.library-panel').innerText()).includes('Library renamed / Nested'));
  await page.evaluate(({ id, parentId }) => chrome.bookmarks.move(id, { parentId }), { id: fixture.bookmark.id, parentId: fixture.empty.id });
  await until(async () => (await readLibrary()).bookmarks.find(row => row.id === fixture.bookmark.id)?.parentId === fixture.empty.id);
  await page.evaluate(id => chrome.bookmarks.removeTree(id), fixture.folder.id);
  await until(async () => !(await readLibrary()).folders.some(row => row.id === fixture.nested.id));
  await page.evaluate(id => chrome.bookmarks.remove(id), fixture.bookmark.id);
  await until(async () => !(await readLibrary()).bookmarks.some(row => row.id === fixture.bookmark.id));
  const beforeClear = await readLibrary();
  await page.evaluate(() => chrome.runtime.sendMessage({ type: 'bookmark-organizer:clear-activity' }));
  assert.deepEqual(await readLibrary(), beforeClear);
  await page.locator('.library-panel > details > summary').click();
  await until(async () => !await page.getByRole('combobox', { name: 'AI model', exact: true }).isDisabled());
  assert.equal((await request('get')).settings.enabled, false);
  assert.deepEqual(await page.getByRole('combobox', { name: 'AI model', exact: true }).locator('option').evaluateAll(nodes => nodes.map(n => n.value)), ['minilm-q8', 'bge-q8']);
  await page.getByRole('combobox', { name: 'AI model', exact: true }).selectOption('bge-q8');
  await until(async () => (await request('get')).settings.preset === 'bge-q8');
  assert.equal(await offscreenCount(), 0);
  await page.getByRole('combobox', { name: 'AI model', exact: true }).selectOption('minilm-q8');
  await until(async () => (await request('get')).settings.preset === 'minilm-q8');
  await create('Captured while model is disabled');
  await until(() => sw.evaluate(async () => (await chrome.storage.session.get('bookmarkDetection')).bookmarkDetection?.recent.length === 1));
  assert.equal(await offscreenCount(), 0);
  const readIndex = (preset = 'minilm-q8') => page.evaluate(preset => new Promise((resolve, reject) => {
    const open = indexedDB.open('bookmark-embeddings', 1);
    open.onerror = () => reject(open.error);
    open.onsuccess = () => {
      const db = open.result;
      const tx = db.transaction('indexes');
      const store = tx.objectStore('indexes');
      const metadata = store.get(`${preset}:metadata`);
      const vectors = store.get(`${preset}:vectors`);
      tx.oncomplete = () => {
        db.close();
        resolve({ metadata: metadata.result, entries: (vectors.result ?? []).map(entry => ({ ...entry, vector: Array.from(entry.vector) })) });
      };
      tx.onabort = () => { db.close(); reject(tx.error); };
    };
  }), preset);
  const waitIndex = () => until(async () => {
    const { state } = await request('get');
    if (state.error) throw new Error(state.error);
    return ['ready', 'unloaded'].includes(state.status) && state.pending === 0 && state.index?.completed === state.index?.total ? state.index : undefined;
  }, 600000);
  await page.evaluate(async parentId => {
    for (let i = 0; i < 18; i++) {
      await chrome.bookmarks.create({ parentId, title: `JavaScript guide ${i}`, url: `https://example.test/guide-${i}` });
    }
    globalThis.indexProgress = [];
    chrome.storage.onChanged.addListener((changes, area) => {
      const value = changes.modelTestState?.newValue;
      if (area === 'session' && value?.index) globalThis.indexProgress.push(value.index.completed);
    });
  }, fixture.empty.id);
  const source = await readLibrary();
  await page.getByLabel('Enable local AI', { exact: true }).check();
  await waitIndex();
  const firstIndex = await readIndex();
  assert.equal(firstIndex.metadata.bookmarkCount, source.bookmarks.length);
  assert.equal(firstIndex.metadata.folderCount, source.folders.length);
  assert.equal(firstIndex.entries.length, source.folders.length + source.bookmarks.length);
  assert(firstIndex.entries.some(entry => entry.kind === 'folder' && entry.id === fixture.empty.id));
  assert(firstIndex.entries.some(entry => entry.kind === 'bookmark' && entry.text === 'JavaScript guide 0'));
  for (const entry of firstIndex.entries) {
    assert.equal(entry.vector.length, 384);
    assert(entry.vector.every(Number.isFinite));
    assert(Math.abs(Math.hypot(...entry.vector) - 1) < .001);
  }
  const progress = await page.evaluate(() => globalThis.indexProgress);
  assert(progress.some(value => value > 0 && value < firstIndex.entries.length));
  assert((await page.getByLabel('Library index', { exact: true }).innerText()).includes('Index saved'));
  assert.equal((await readIndex('bge-q8')).metadata, undefined);
  await page.screenshot({ path: join(temp, 'index-ready.png') });
  await until(async () => await offscreenCount() === 0, 30000);
  assert.equal((await request('get')).state.index.completed, firstIndex.entries.length);

  // Unchanged input reuses the persistent index, including its original timestamp.
  await context.setOffline(true);
  await request('settings', { enabled: false, preset: 'minilm-q8' });
  await request('settings', { enabled: true, preset: 'minilm-q8' });
  await waitIndex();
  assert.equal((await readIndex()).metadata.updatedAt, firstIndex.metadata.updatedAt);

  // Cancelling a changed snapshot leaves the previous vectors and readiness intact.
  await request('settings', { enabled: false, preset: 'minilm-q8' });
  const changed = source.bookmarks.find(bookmark => bookmark.title === 'JavaScript guide 0');
  await page.evaluate(id => chrome.bookmarks.update(id, { title: 'Database administration reference' }), changed.id);
  await until(async () => (await readLibrary()).bookmarks.find(row => row.id === changed.id)?.title === 'Database administration reference');
  await request('settings', { enabled: true, preset: 'minilm-q8' });
  await request('settings', { enabled: false, preset: 'minilm-q8' });
  assert.equal(await offscreenCount(), 0);
  assert.deepEqual(await readIndex(), firstIndex);

  await request('settings', { enabled: true, preset: 'minilm-q8' });
  const cdp = await context.browser().newBrowserCDPSession();
  const workerTarget = (await cdp.send('Target.getTargets')).targetInfos.find(target => target.type === 'service_worker');
  if (workerTarget) await cdp.send('Target.closeTarget', { targetId: workerTarget.targetId });
  await waitIndex();
  let rebuilt = await readIndex();
  assert.notEqual(rebuilt.metadata.fingerprint, firstIndex.metadata.fingerprint);
  const before = firstIndex.entries.find(entry => entry.id === changed.id).vector;
  const after = rebuilt.entries.find(entry => entry.id === changed.id).vector;
  assert(after.some((value, index) => Math.abs(value - before[index]) > 1e-5));

  const bookmark = await create('A newly captured title');
  await until(async () => (await readIndex()).entries.some(entry => entry.id === bookmark.id));
  rebuilt = await readIndex();
  const unchanged = rebuilt.entries.find(entry => entry.text === 'JavaScript guide 1');
  await page.evaluate(id => chrome.bookmarks.update(id, { title: 'Updated captured title' }), bookmark.id);
  await until(async () => (await readIndex()).entries.some(entry => entry.id === bookmark.id && entry.text === 'Updated captured title'));
  assert.deepEqual((await readIndex()).entries.find(entry => entry.id === unchanged.id).vector, unchanged.vector);
  await page.evaluate(id => chrome.bookmarks.update(id, { title: 'Updated empty folder' }), fixture.empty.id);
  await until(async () => (await readIndex()).entries.some(entry => entry.id === fixture.empty.id && entry.text.endsWith('Updated empty folder')));
  const destination = await page.evaluate(parentId => chrome.bookmarks.create({ parentId, title: 'Destination' }), fixture.root.id);
  await page.evaluate(({ id, parentId }) => chrome.bookmarks.move(id, { parentId }), { id: fixture.empty.id, parentId: destination.id });
  await until(async () => (await readIndex()).entries.some(entry => entry.id === fixture.empty.id && entry.text.includes('Destination / Updated empty folder')));
  const removed = await create('Delete this indexed bookmark');
  await until(async () => (await readIndex()).entries.some(entry => entry.id === removed.id));
  await page.evaluate(id => chrome.bookmarks.remove(id), removed.id);
  await until(async () => !(await readIndex()).entries.some(entry => entry.id === removed.id));
  await page.evaluate(id => {
    const onChange = (changes, area) => {
      if (area !== 'session' || changes.modelTestState?.newValue?.status !== 'indexing') return;
      chrome.storage.onChanged.removeListener(onChange);
      globalThis.duringIndex = chrome.bookmarks.create({ title: 'Created during indexing', url: 'https://example.test/during-index' });
    };
    chrome.storage.onChanged.addListener(onChange);
    return chrome.bookmarks.update(id, { title: 'Trigger concurrent change' });
  }, bookmark.id);
  await until(async () => (await readIndex()).entries.some(entry => entry.text === 'Created during indexing'));
  rebuilt = await readIndex();
  assert.equal((await page.evaluate(id => chrome.bookmarks.get(id), bookmark.id))[0].parentId, bookmark.parentId);
  await page.getByLabel('Enable local AI', { exact: true }).uncheck();
  await until(async () => !(await request('get')).settings.enabled);
  await page.getByRole('combobox', { name: 'AI model', exact: true }).selectOption('bge-q8');
  await until(async () => (await request('get')).settings.preset === 'bge-q8');
  assert.equal((await request('get')).state.index, undefined);
  assert.equal(await offscreenCount(), 0);
  await page.getByRole('combobox', { name: 'AI model', exact: true }).selectOption('minilm-q8');
  await until(async () => (await request('get')).settings.preset === 'minilm-q8');
  assert.equal((await request('get')).state.index.completed, rebuilt.entries.length);

  // Failed loading must preserve the last complete index as well.
  const configText = await page.evaluate(async () => {
    const cache = await caches.open('bookmark-model-test-v1');
    const key = 'https://huggingface.co/Xenova/paraphrase-multilingual-MiniLM-L12-v2/resolve/2c4055b12046f11709e9df2c122e59ffbdc2f900/config.json';
    const config = await (await cache.match(key)).text();
    await cache.put(key, new Response('invalid-json'));
    return config;
  });
  await page.evaluate(id => chrome.bookmarks.update(id, { title: 'Changed while disabled' }), bookmark.id);
  await request('settings', { enabled: true, preset: 'minilm-q8' });
  await until(async () => (await request('get')).state.status === 'error');
  await until(async () => await offscreenCount() === 0);
  assert.deepEqual(await readIndex(), rebuilt);
  await request('settings', { enabled: false, preset: 'minilm-q8' });
  assert.equal((await request('get')).state.status, 'unloaded');

  // A complete browser restart must retain IndexedDB vectors and index metadata.
  await context.close();
  context = await launch();
  page = await context.newPage();
  await page.goto(`chrome-extension://${id}/popup.html`);
  await until(async () => !await page.getByRole('combobox', { name: 'AI model', exact: true }).isDisabled());
  assert.deepEqual(await readIndex(), rebuilt);
  assert.equal((await request('get')).state.index.completed, rebuilt.entries.length);
  // Existing installations can already have AI enabled before indexes exist.
  await page.evaluate(async config => {
    const cache = await caches.open('bookmark-model-test-v1');
    const key = 'https://huggingface.co/Xenova/paraphrase-multilingual-MiniLM-L12-v2/resolve/2c4055b12046f11709e9df2c122e59ffbdc2f900/config.json';
    await cache.put(key, new Response(config));
    await new Promise((resolve, reject) => {
      const open = indexedDB.open('bookmark-embeddings', 1);
      open.onsuccess = () => {
        const db = open.result;
        const tx = db.transaction('indexes', 'readwrite');
        tx.objectStore('indexes').delete('minilm-q8:metadata');
        tx.objectStore('indexes').delete('minilm-q8:vectors');
        tx.oncomplete = () => { db.close(); resolve(); };
        tx.onabort = () => { db.close(); reject(tx.error); };
      };
      open.onerror = () => reject(open.error);
    });
    await chrome.storage.local.set({ modelTestSettings: { enabled: true, preset: 'minilm-q8' } });
  }, configText);
  await context.close();
  context = await launch();
  page = await context.newPage();
  await page.goto(`chrome-extension://${id}/popup.html`);
  await waitIndex();
  const migrated = await readIndex();
  assert.equal(migrated.metadata.bookmarkCount, (await readLibrary()).bookmarks.length);
  assert.equal(migrated.metadata.completed, migrated.entries.length);
  assert.deepEqual(errors, []);
  assert.deepEqual(headerWarnings, []);
  console.log('PASS: library updates, first-enable indexing, normalized vectors, progress, persistent reuse, cancellation, service-worker/browser recovery, model separation, failed-write preservation and existing-enabled migration.');
} finally {
  console.log(`Artifacts: ${temp}`);
  await context.close();
}
