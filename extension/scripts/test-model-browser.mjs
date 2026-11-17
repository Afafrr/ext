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
const context = await chromium.launchPersistentContext(join(temp, 'profile'), {
  channel: 'chromium', headless: true,
  executablePath,
  args: [`--disable-extensions-except=${extension}`, `--load-extension=${extension}`],
});
try {
  const sw = context.serviceWorkers()[0] || await context.waitForEvent('serviceworker');
  const id = new URL(sw.url()).hostname;
  const page = await context.newPage();
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
  await until(async () => !await page.getByRole('combobox', { name: 'Model AI', exact: true }).isDisabled());
  assert.equal((await request('get')).settings.enabled, false);
  assert.deepEqual(await page.getByRole('combobox', { name: 'Model AI', exact: true }).locator('option').evaluateAll(nodes => nodes.map(n => n.value)), ['minilm-q8', 'bge-q8']);
  await page.getByRole('combobox', { name: 'Model AI', exact: true }).selectOption('bge-q8');
  await until(async () => (await request('get')).settings.preset === 'bge-q8');
  assert.equal(await offscreenCount(), 0);
  await page.getByRole('combobox', { name: 'Model AI', exact: true }).selectOption('minilm-q8');
  await until(async () => (await request('get')).settings.preset === 'minilm-q8');
  await create('Captured while model is disabled');
  await until(() => sw.evaluate(async () => (await chrome.storage.session.get('bookmarkDetection')).bookmarkDetection?.recent.length === 1));
  assert.equal(await offscreenCount(), 0);
  await page.getByLabel('Uruchamiaj model po dodaniu zakładki').check();
  await until(async () => (await request('get')).settings.enabled);
  const bookmark = await create('Learn JavaScript functions');
  await until(async () => {
    const { state } = await request('get');
    if (state.error) throw new Error(state.error);
    return state.status === 'ready';
  }, 600000);
  assert.equal(await offscreenCount(), 1);
  const cdp = await context.browser().newBrowserCDPSession();
  const workerTarget = (await cdp.send('Target.getTargets')).targetInfos.find(target => target.type === 'service_worker');
  if (workerTarget) {
    await cdp.send('Target.closeTarget', { targetId: workerTarget.targetId });
    const resumed = await request('get');
    assert.equal(resumed.settings.enabled, true);
    assert.equal(resumed.settings.preset, 'minilm-q8');
    assert.equal(resumed.state.status, 'ready');
    assert.equal((await readLibrary()).bookmarks.some(row => row.id === bookmark.id), true);
  }
  await page.screenshot({ path: join(temp, 'popup.png') });
  await until(async () => await offscreenCount() === 0, 30000);
  assert.equal((await request('get')).state.status, 'unloaded');
  await context.setOffline(true);
  await create('Load again using local cache');
  await until(async () => {
    const { state } = await request('get');
    if (state.error) throw new Error(state.error);
    return state.status === 'ready';
  }, 60000);
  await page.getByRole('combobox', { name: 'Model AI', exact: true }).selectOption('bge-q8');
  await until(async () => (await request('get')).settings.preset === 'bge-q8');
  assert.equal(await offscreenCount(), 0);
  await page.getByLabel('Uruchamiaj model po dodaniu zakładki').uncheck();
  await until(async () => !(await request('get')).settings.enabled);
  assert.equal(await offscreenCount(), 0);
  const current = await page.evaluate(id => chrome.bookmarks.get(id), bookmark.id);
  assert.equal(current[0].parentId, bookmark.parentId);
  assert.equal(await page.getByRole('button', { name: 'Export JSON' }).count(), 0);
  // A corrupt cached config produces a deterministic load error without a download.
  await page.evaluate(async () => {
    const cache = await caches.open('bookmark-model-test-v1');
    const key = 'https://huggingface.co/Xenova/paraphrase-multilingual-MiniLM-L12-v2/resolve/2c4055b12046f11709e9df2c122e59ffbdc2f900/config.json';
    await cache.put(key, new Response('invalid-json'));
  });
  await request('settings', { enabled: true, preset: 'minilm-q8' });
  await create('Offline failure recovery');
  await until(async () => (await request('get')).state.status === 'error');
  await until(async () => await offscreenCount() === 0);
  await request('settings', { enabled: false, preset: 'minilm-q8' });
  assert.equal((await request('get')).state.status, 'unloaded');
  assert.deepEqual(errors, []);
  assert.deepEqual(headerWarnings, []);
  console.log('PASS: full library, live rename/move/delete updates, detection, two model choices, real MiniLM, service-worker recovery, idle release, offline reload, error recovery and model switch teardown.');
} finally {
  console.log(`Artifacts: ${temp}`);
  await context.close();
}
