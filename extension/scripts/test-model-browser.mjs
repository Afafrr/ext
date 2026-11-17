import assert from 'node:assert/strict';
import { createServer } from 'node:http';
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
const server = createServer((request, response) => {
  const tags = {
    '/primary': '<meta name="description" content="  A practical guide to React hooks.  "><meta property="og:description" content="Ignored fallback">',
    '/og': '<meta name="description" content="   "><meta property="og:description" content="Open Graph description">',
    '/empty': '<meta name="description" content=" "><meta property="og:description" content=" ">',
  };
  response.setHeader('Content-Type', 'text/html; charset=utf-8');
  response.end(`<!doctype html><html><head><title>Metadata fixture</title>${tags[request.url] ?? ''}</head><body>Fixture</body></html>`);
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const metadataOrigin = `http://127.0.0.1:${server.address().port}`;
let context = await launch();
try {
  const sw = context.serviceWorkers()[0] || await context.waitForEvent('serviceworker');
  const id = new URL(sw.url()).hostname;
  // Upgrade the page-description schema and remove persisted page inputs.
  await sw.evaluate(() => new Promise((resolve, reject) => {
    const open = indexedDB.open('bookmark-embeddings', 2);
    open.onupgradeneeded = () => {
      open.result.createObjectStore('indexes');
      open.result.createObjectStore('pages', { keyPath: 'id' });
    };
    open.onerror = () => reject(open.error);
    open.onsuccess = () => {
      const db = open.result;
      const tx = db.transaction(['indexes', 'pages'], 'readwrite');
      tx.objectStore('pages').put({ id: 'legacy', url: 'https://example.test', description: 'Private page description' });
      tx.objectStore('indexes').put([{ kind: 'bookmark', id: 'legacy', text: 'Old title\nPrivate page description', description: 'Private page description', vector: new Float32Array([1, 0]) }], 'minilm-q8:vectors');
      tx.objectStore('indexes').put({ fingerprint: 'legacy' }, 'minilm-q8:metadata');
      tx.objectStore('indexes').put({ vector: new Float32Array([1, 0]) }, 'migration-fixture');
      tx.oncomplete = () => { db.close(); resolve(); };
      tx.onabort = () => { db.close(); reject(tx.error); };
    };
  }));
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
  const migration = await page.evaluate(() => new Promise((resolve, reject) => {
    const open = indexedDB.open('bookmark-embeddings', 3);
    open.onerror = () => reject(open.error);
    open.onsuccess = () => {
      const db = open.result;
      const request = db.transaction('indexes').objectStore('indexes').get('migration-fixture');
      request.onsuccess = () => { db.close(); resolve({ version: db.version, stores: Array.from(db.objectStoreNames), vector: Array.from(request.result.vector) }); };
      request.onerror = () => { db.close(); reject(request.error); };
    };
  }));
  assert.deepEqual(migration, { version: 3, stores: ['folderDescriptions', 'indexes'], vector: [1, 0] });
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
  const readDescriptions = () => page.evaluate(() => new Promise((resolve, reject) => {
    const open = indexedDB.open('bookmark-embeddings', 3);
    open.onerror = () => reject(open.error);
    open.onsuccess = () => {
      const db = open.result;
      const request = db.transaction('folderDescriptions').objectStore('folderDescriptions').getAll();
      request.onsuccess = () => { db.close(); resolve(request.result); };
      request.onerror = () => { db.close(); reject(request.error); };
    };
  }));
  const optionalAccess = { permissions: ['scripting'], origins: ['http://*/*', 'https://*/*'] };
  await until(async () => !await page.getByLabel('Use page descriptions', { exact: true }).isDisabled());
  assert.equal(await page.getByLabel('Use page descriptions', { exact: true }).isChecked(), false);
  assert.equal(await page.evaluate(access => chrome.permissions.contains(access), optionalAccess), false);
  // Chrome's native consent dialog is outside Playwright's page automation.
  // Simulate a prior host-access approval through Chrome settings in this test profile.
  async function approveMetadataHosts() {
    const settingsPage = await context.newPage();
    try {
      await settingsPage.goto('chrome://extensions/');
      await settingsPage.evaluate(async id => {
        await chrome.developerPrivate.addHostPermission(id, 'http://*/*');
        await chrome.developerPrivate.addHostPermission(id, 'https://*/*');
      }, id);
    } finally { await settingsPage.close(); }
  }
  const blockedTab = await context.newPage();
  await blockedTab.goto(`${metadataOrigin}/primary`);
  const blockedBookmark = await page.evaluate(url => chrome.bookmarks.create({ title: 'No consent yet', url }), `${metadataOrigin}/primary`);
  await until(async () => (await page.evaluate(() => chrome.storage.session.get('bookmarkDetection'))).bookmarkDetection.recent.some(row => row.id === blockedBookmark.id));
  await request('get');
  await blockedTab.close();
  assert.equal((await readDescriptions()).some(row => row.id === blockedBookmark.id), false);
  await approveMetadataHosts();
  await page.getByLabel('Use page descriptions', { exact: true }).click();
  await until(async () => await page.evaluate(access => chrome.permissions.contains(access), optionalAccess), 15000);
  // Persist an editable folder description while AI is disabled.
  await page.locator('.library-panel > details > summary').click();
  await page.locator('.library-panel summary').filter({ hasText: 'Empty library folder' }).last().click();
  const folderDescription = 'React and JavaScript documentation, hooks, components and software development.';
  const descriptionField = page.getByRole('textbox', { name: `Description for ${fixture.root.title} / ${fixture.empty.title}`, exact: true });
  await descriptionField.fill(folderDescription);
  await descriptionField.locator('..').locator('..').getByRole('button', { name: 'Save description', exact: true }).click();
  await until(async () => (await readDescriptions()).some(row => row.id === fixture.empty.id && row.description === folderDescription));
  await page.locator('.library-panel > details > summary').click();
  assert.equal(await offscreenCount(), 0);
  await page.evaluate(async parentId => {
    await chrome.bookmarks.create({ parentId, title: 'React useEffect hooks reference', url: 'https://example.test/react' });
    await chrome.bookmarks.create({ title: 'Unread', url: 'https://example.test/unread' });
  }, fixture.empty.id);
  const readIndex = (preset = 'minilm-q8') => page.evaluate(preset => new Promise((resolve, reject) => {
    const open = indexedDB.open('bookmark-embeddings', 3);
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
  const generatedFixture = await page.evaluate(async parentId => {
    const folder = await chrome.bookmarks.create({ parentId, title: 'Automatic description' });
    const first = await chrome.bookmarks.create({ parentId: folder.id, title: 'JavaScript documentation', url: 'https://example.test/auto-1' });
    await chrome.bookmarks.create({ parentId: folder.id, title: 'Modern JavaScript guide', url: 'https://example.test/auto-2' });
    return { folder, first };
  }, fixture.root.id);
  const source = await readLibrary();
  await page.locator('.library-panel > details > summary').click();
  await page.locator('.library-panel summary').filter({ hasText: 'Automatic description' }).last().click();
  const draft = page.getByRole('textbox', { name: `Description for ${fixture.root.title} / Automatic description`, exact: true });
  await draft.fill('Draft being edited');
  await page.getByLabel('Enable local AI', { exact: true }).check();
  await waitIndex();
  await page.waitForTimeout(250);
  assert.equal(await draft.inputValue(), 'Draft being edited');
  await page.locator('.library-panel > details > summary').click();
  const firstIndex = await readIndex();
  const generated = (await readDescriptions()).find(row => row.id === generatedFixture.folder.id);
  assert.equal(generated.source, 'generated');
  assert(generated.description.includes('Automatic description'));
  assert(generated.description.includes('JavaScript'));
  assert.equal(firstIndex.entries.find(entry => entry.id === generatedFixture.folder.id).description, generated.description);
  assert.equal((await readDescriptions()).find(row => row.id === fixture.empty.id).description, folderDescription);

  assert.equal(firstIndex.metadata.bookmarkCount, source.bookmarks.length);
  assert.equal(firstIndex.metadata.folderCount, source.folders.length);
  assert.equal(firstIndex.entries.length, source.folders.length + source.bookmarks.length);
  assert.equal(firstIndex.entries.find(entry => entry.id === fixture.empty.id).description, folderDescription);
  assert(firstIndex.entries.filter(entry => entry.kind === 'bookmark').every(entry => entry.description === undefined));
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
  // Automatically generated descriptions follow bookmark changes.
  await page.evaluate(id => chrome.bookmarks.update(id, { title: 'Updated JavaScript title' }), generatedFixture.first.id);
  await until(async () => (await readDescriptions()).some(row => row.id === generatedFixture.folder.id && row.description.includes('Updated JavaScript title')));
  await waitIndex();
  const refreshedDescription = (await readDescriptions()).find(row => row.id === generatedFixture.folder.id);
  assert.equal(refreshedDescription.source, 'generated');
  assert.equal((await readIndex()).entries.find(entry => entry.id === generatedFixture.folder.id).description, refreshedDescription.description);

  // A user edit remains authoritative when folder contents subsequently change.
  await page.evaluate(async id => {
    const response = await chrome.runtime.sendMessage({ type: 'bookmark-model-test:command', action: 'folderDescription', id, description: 'My manually edited description' });
    if (!response?.ok) throw new Error('Could not save description');
  }, generatedFixture.folder.id);
  await page.evaluate(id => chrome.bookmarks.update(id, { title: 'Changed JavaScript documentation' }), generatedFixture.first.id);
  await until(async () => (await readIndex()).entries.some(entry => entry.id === generatedFixture.first.id && entry.text === 'Changed JavaScript documentation'));
  await waitIndex();
  assert.equal((await readDescriptions()).find(row => row.id === generatedFixture.folder.id).description, 'My manually edited description');
  await page.evaluate(async id => {
    const response = await chrome.runtime.sendMessage({ type: 'bookmark-model-test:command', action: 'folderDescription', id, description: '' });
    if (!response?.ok) throw new Error('Could not clear description');
  }, generatedFixture.folder.id);
  await page.evaluate(id => chrome.bookmarks.update(id, { title: 'Changed again' }), generatedFixture.first.id);
  await until(async () => (await readIndex()).entries.some(entry => entry.id === generatedFixture.first.id && entry.text === 'Changed again'));
  await waitIndex();
  assert.equal((await readDescriptions()).find(row => row.id === generatedFixture.folder.id).description, '');
  rebuilt = await readIndex();


  await context.setOffline(false);
  const liveMetadataTab = await context.newPage();
  await liveMetadataTab.goto(`${metadataOrigin}/primary`);
  const liveBookmark = await page.evaluate(url => chrome.bookmarks.create({ title: 'Unread', url }), `${metadataOrigin}/primary`);
  const suggestion = await until(async () => {
    const state = (await request('get')).state;
    if (state.error) throw new Error(state.error);
    return state.suggestion?.bookmarkId === liveBookmark.id ? state.suggestion : undefined;
  });
  assert.equal(suggestion.folders[0].id, fixture.empty.id);
  assert(suggestion.folders.length > 0 && suggestion.folders.length <= 3);
  await until(async () => (await readIndex()).entries.some(entry => entry.id === liveBookmark.id));
  const queryEntry = (await readIndex()).entries.find(entry => entry.id === liveBookmark.id);
  assert.equal(queryEntry.text, 'Unread');
  assert.equal(queryEntry.description, undefined);
  const savedState = await page.evaluate(async () => JSON.stringify([await chrome.storage.local.get(null), await chrome.storage.session.get(null)]));
  assert.equal(savedState.includes('A practical guide to React hooks.'), false);
  assert.equal(JSON.stringify(await readIndex()).includes('A practical guide to React hooks.'), false);
  assert.equal((await page.getByLabel('Folder suggestions', { exact: true }).innerText()).includes('Suggested folders for Unread'), true);

  // Revocation changes the query back to title-only while preserving folder descriptions.
  await page.getByLabel('Use page descriptions', { exact: true }).click();
  await until(async () => !await page.evaluate(access => chrome.permissions.contains(access), optionalAccess));
  const fallbackBookmark = await page.evaluate(url => chrome.bookmarks.create({ title: 'Unread', url }), `${metadataOrigin}/primary`);
  const fallback = await until(async () => {
    const result = (await request('get')).state.suggestion;
    return result?.bookmarkId === fallbackBookmark.id ? result : undefined;
  });
  assert.equal(fallback.folders[0].id, fallbackBookmark.parentId);
  assert((await readDescriptions()).some(row => row.id === fixture.empty.id));
  await liveMetadataTab.close();
  await context.setOffline(true);
  // Removing a folder also removes its persistent description.
  const disposable = await page.evaluate(() => chrome.bookmarks.create({ title: 'Disposable folder' }));
  await page.evaluate(async id => {
    const result = await chrome.runtime.sendMessage({ type: 'bookmark-model-test:command', action: 'folderDescription', id, description: 'Temporary folder description' });
    if (!result?.ok) throw new Error('Description write failed');
  }, disposable.id);
  assert((await readDescriptions()).some(row => row.id === disposable.id));
  await page.evaluate(id => chrome.bookmarks.removeTree(id), disposable.id);
  await until(async () => !(await readDescriptions()).some(row => row.id === disposable.id));
  const bookmark = await create('A newly captured title');
  await until(async () => (await readIndex()).entries.some(entry => entry.id === bookmark.id));
  rebuilt = await readIndex();
  const unchanged = rebuilt.entries.find(entry => entry.text === 'JavaScript guide 1');
  await page.evaluate(id => chrome.bookmarks.update(id, { title: 'Updated captured title' }), bookmark.id);
  await until(async () => (await readIndex()).entries.some(entry => entry.id === bookmark.id && entry.text === 'Updated captured title'));
  assert.deepEqual((await readIndex()).entries.find(entry => entry.id === unchanged.id).vector, unchanged.vector);
  await page.evaluate(id => chrome.bookmarks.update(id, { title: 'Updated empty folder' }), fixture.empty.id);
  await until(async () => (await readIndex()).entries.some(entry => entry.id === fixture.empty.id && entry.text.split('\n')[0].endsWith('Updated empty folder')));
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
  assert((await readDescriptions()).some(row => row.id === fixture.empty.id && row.description === folderDescription));
  assert.equal((await request('get')).state.index.completed, rebuilt.entries.length);
  // Existing installations can already have AI enabled before indexes exist.
  await page.evaluate(async config => {
    const cache = await caches.open('bookmark-model-test-v1');
    const key = 'https://huggingface.co/Xenova/paraphrase-multilingual-MiniLM-L12-v2/resolve/2c4055b12046f11709e9df2c122e59ffbdc2f900/config.json';
    await cache.put(key, new Response(config));
    await new Promise((resolve, reject) => {
      const open = indexedDB.open('bookmark-embeddings', 3);
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
  console.log('PASS: automatic folder descriptions and refresh, manual edits and drafts, transient query descriptions, folder description editing/persistence, consent revocation, title-only vectors, legacy page cleanup, 30/70 suggestions, library updates, first-enable indexing, normalized vectors, progress, persistent reuse, cancellation, service-worker/browser recovery, model separation, failed-write preservation and existing-enabled migration.');
} finally {
  console.log(`Artifacts: ${temp}`);
  await context.close();
  await new Promise(resolve => server.close(resolve));
}
