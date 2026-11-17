import { resolve } from 'node:path';
import { env } from '@huggingface/transformers';
import { loadDataset, readJSON } from '../lib/data.js';
import { loadEmbedder } from '../lib/models.js';
import { dot } from '../lib/scoring.js';
import { generateFolderDescriptions } from '../../extension/lib/folder-description.ts';

env.cacheDir = resolve('.cache/models');
const real = await loadDataset('real');
const derived = await loadDataset('real-derived');
const hard = await loadDataset('hard');
const realDescriptions = await readJSON('datasets/real/descriptions.json');
const hardDescriptions = await readJSON('datasets/hard/descriptions.json');
const models = [
  { preset: 'minilm-q8', model: 'Xenova/paraphrase-multilingual-MiniLM-L12-v2', dtype: 'q8', pooling: 'mean', maxLength: 128 },
  { preset: 'bge-q8', model: 'Xenova/bge-m3', dtype: 'q8', pooling: 'cls', maxLength: 128 },
];

for (const config of models) {
  console.log(`Loading ${config.model}`);
  const embedder = await loadEmbedder(config, true);
  try {
    const collections = new Map();
    for (const dataset of [real, hard]) {
      const descriptions = dataset === real ? realDescriptions : hardDescriptions;
      for (const collection of dataset.collections) {
        const folders = [];
        for (const folder of collection.folders) {
          const titles = dataset.index.filter(row => row.collectionId === collection.id && row.folder === folder.path).map(row => row.title);
          const vectors = [];
          for (const title of titles) vectors.push(await embedder.embed(title));
          const path = folder.path.split(/\s*>\s*|\s*\/\s*/).join(' / ');
          const bookmarks = titles.map((title, index) => ({ id: String(index), title }));
          const job = { preset: config.preset, folders: [{ id: folder.path, path: [path], bookmarks }] };
          const entries = bookmarks.map((bookmark, index) => ({ kind: 'bookmark', id: bookmark.id, text: bookmark.title, vector: new Float32Array(vectors[index]) }));
          const representative = generateFolderDescriptions(job, entries)[0].description;
          const first = `${path.slice(-80)} — ${[...new Set(titles.map(title => title.slice(0, 45)))].slice(0, 3).join(' · ')}`.slice(0, 240);
          const manual = descriptions.folders[`${collection.id}/${folder.path}`]?.manual ?? descriptions.folders[folder.path].manual;
          folders.push({ path: folder.path, vectors,
            pathOnly: await embedder.embed(path),
            first: await embedder.embed(`${path}\n${first}`),
            representative: await embedder.embed(`${path}\n${representative}`),
            manual: await embedder.embed(`${path}\n${manual}`),
          });
        }
        collections.set(collection.id, folders);
      }
    }
    const combined = { pathOnly: 0, first: 0, representative: 0, manual: 0 };
    let combinedCases = 0;
    for (const dataset of [real, derived, hard]) {
      const correct = { pathOnly: 0, first: 0, representative: 0, manual: 0 };
      const cases = dataset.evaluation.filter(item => item.expectedFolder !== null);
      for (const item of cases) {
        const queryText = [item.title || item.url, item.description].filter(Boolean).join('\n').slice(0, 4000);
        const query = await embedder.embed(queryText);
        const folders = collections.get(item.collectionId);
        for (const method of Object.keys(correct)) {
          const ranked = folders.map(folder => ({ path: folder.path,
            score: .3 * dot(query, folder[method]) + .7 * Math.max(...folder.vectors.map(vector => dot(query, vector))),
          })).sort((a, b) => b.score - a.score || a.path.localeCompare(b.path, 'en'));
          if (ranked[0].path === item.expectedFolder) correct[method]++;
        }
      }
      for (const method of Object.keys(correct)) combined[method] += correct[method];
      combinedCases += cases.length;
      console.log(JSON.stringify({ model: config.model, dataset: dataset.name, cases: cases.length, correct }));
    }
    console.log(JSON.stringify({ model: config.model, dataset: 'combined', cases: combinedCases, correct: combined }));
  } finally { await embedder.dispose(); }
}
