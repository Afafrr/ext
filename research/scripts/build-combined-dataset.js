import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { loadDataset, readJSON, validateDataset } from '../lib/data.js';

const sources = ['real', 'real-derived', 'hard'];
const collections = new Map(), index = new Map(), folders = {};
const evaluation = [], provenance = {};
for (const source of sources) {
  const data = await loadDataset(source);
  validateDataset(data);
  const descriptions = await readJSON(`datasets/${source === 'real-derived' ? 'real' : source}/descriptions.json`);
  provenance[source] = descriptions.provenance;
  for (const collection of data.collections) {
    if (collections.has(collection.id)) assert.deepEqual(collections.get(collection.id), collection);
    collections.set(collection.id, collection);
    for (const folder of collection.folders) {
      const key = `${collection.id}/${folder.path}`;
      const description = descriptions.folders[key] ?? descriptions.folders[folder.path];
      assert(description?.manual?.trim(), `Missing manual description: ${key}`);
      if (folders[key]) assert.deepEqual(folders[key], description);
      folders[key] = description;
    }
  }
  for (const item of data.index) {
    if (index.has(item.id)) assert.deepEqual(index.get(item.id), item);
    index.set(item.id, item);
  }
  evaluation.push(...data.evaluation.map(item => ({ ...item, sourceDataset: source })));
}
const data = { name: 'combined', collections: [...collections.values()], index: [...index.values()], evaluation };
validateDataset(data);
await mkdir('datasets/combined', { recursive: true });
for (const [name, value] of Object.entries({ collections: data.collections, index: data.index, evaluation,
  descriptions: { provenance, folders } })) {
  await writeFile(`datasets/combined/${name}.json`, JSON.stringify(value, null, 2) + '\n');
}
console.log(validateDataset(await loadDataset('combined')));
