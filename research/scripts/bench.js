import { env } from '@huggingface/transformers';
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import os from 'node:os';
import { loadDataset, validateDataset, readJSON, hash } from '../lib/data.js';
import { validateConfig, STRATEGIES } from '../lib/config.js';
import { textFor, centroid, rankFolders, retrieveAndRerank, prediction, summarize } from '../lib/scoring.js';
import { loadEmbedder, loadReranker } from '../lib/models.js';

const config = validateConfig(await readJSON(process.argv[2] ?? 'benchmark.config.json'));
const dataset = await loadDataset(config.dataset);
const validation = validateDataset(dataset);
const descriptions = await readJSON(config.descriptions);
const variants = ['manual', 'generated', 'domain'];
// Real folders use their path as the key; multi-user collections use collectionId/path.
const contextFor = (collection, folder) => descriptions.folders[`${collection.id}/${folder.path}`]
  ?? descriptions.folders[folder.path];
const needed = new Set(config.strategies.flatMap(id => id === 'rerank' ? ['manual']
  : id === 'manual-closest' ? ['manual'] : id === 'generated-closest' ? ['generated']
    : id === 'domain-closest' ? ['domain'] : []));
for (const collection of dataset.collections) for (const folder of collection.folders) {
  for (const variant of needed) {
    if (!contextFor(collection, folder)?.[variant]?.trim()) {
      throw new Error(`Missing ${variant} description: ${collection.id}/${folder.path}`);
    }
  }
}
console.log(validation);
env.cacheDir = config.cacheDir;
const runId = `${new Date().toISOString().replace(/[:.]/g, '-')}-${randomUUID().slice(0, 8)}`;
const dir = `results/${runId}`;
await mkdir(dir, { recursive: true });
const sourceFiles = ['scripts/bench.js', 'lib/data.js', 'lib/config.js', 'lib/scoring.js', 'lib/models.js'];
const sourceSnapshot = Object.fromEntries(await Promise.all(sourceFiles.map(async file => [file, await readFile(file, 'utf8')])));
const run = {
  schemaVersion: 2, runId, createdAt: new Date().toISOString(), status: 'running',
  config, validation, datasets: [dataset], descriptions, sourceSnapshot, sourceHash: hash(sourceSnapshot),
  timing: 'CPU after warmup. Each query embedding is shared across strategies. Query time includes embedding, scoring and reranking; excludes setup and reporting. One sample per case.',
  results: []
};
const save = () => writeFile(`${dir}/run.json`, JSON.stringify(run, null, 2) + '\n');
await writeFile(`${dir}/config.json`, JSON.stringify(config, null, 2) + '\n');
await save();
let embedder, reranker;
const runtimeStarted = performance.now();
const cpuStarted = process.cpuUsage();
try {
  console.log(`Loading ${config.model.model} embeddings…`);
  embedder = await loadEmbedder(config.model, config.localFilesOnly);
  await embedder.embed('Warm up. Rozgrzewka.');
  if (config.strategies.includes('rerank')) {
    console.log('Loading reranker (first run downloads its weights)…');
    reranker = await loadReranker(config.reranker, config.localFilesOnly);
    await reranker.score('Warm up', 'An example folder');
  }
  const setupMs = performance.now() - runtimeStarted;
  const indexStarted = performance.now();
  const indices = new Map();
  for (const collection of dataset.collections) {
    const folders = [];
    for (const folder of collection.folders) {
      const examples = dataset.index.filter(row => row.collectionId === collection.id && row.folder === folder.path);
      const titles = examples.map(row => row.title);
      const vectors = { path: await embedder.embed(folder.path) };
      const context = contextFor(collection, folder);
      for (const variant of variants) {
        if (needed.has(variant)) vectors[variant] = await embedder.embed(`${folder.path}. ${context[variant]}`);
      }
      const exampleVectors = [];
      for (const title of titles) exampleVectors.push(await embedder.embed(title));
      folders.push({ path: folder.path, vectors, examples: exampleVectors, centroid: centroid(exampleVectors),
        keywordText: [folder.path, ...titles].join('. '),
        rerankText: [folder.path, context?.manual, ...titles].filter(Boolean).join('. ') });
    }
    indices.set(collection.id, folders);
  }
  const indexingMs = performance.now() - indexStarted;
  run.results = config.strategies.map(strategy => ({
    id: strategy, label: STRATEGIES[strategy], dataset: dataset.name, rows: []
  }));
  for (const [index, item] of dataset.evaluation.entries()) {
    const queryText = textFor(item, config.fields);
    const started = performance.now();
    const vector = await embedder.embed(queryText);
    const embeddingMs = performance.now() - started;
    const folders = indices.get(item.collectionId);
    for (const result of run.results) {
      const scoreStarted = performance.now();
      const ranked = result.id === 'rerank'
        ? await retrieveAndRerank(vector, queryText, folders, reranker.score, config.reranker.candidates)
        : rankFolders(vector, folders, result.id, queryText);
      const scoringMs = performance.now() - scoreStarted;
      result.rows.push({ ...item, queryText, ...prediction(ranked, item, config.thresholds, result.id),
        embeddingMs, scoringMs, queryMs: embeddingMs + scoringMs });
    }
    console.log(`Case ${index + 1}/${dataset.evaluation.length}`);
  }
  for (const result of run.results) result.metrics = summarize(result.rows);
  const cpu = process.cpuUsage(cpuStarted);
  run.runtime = {
    node: process.version, platform: process.platform, arch: process.arch,
    cpu: os.cpus()[0]?.model, logicalCpus: os.cpus().length,
    setupMs, indexingMs, totalMs: performance.now() - runtimeStarted,
    cpuMs: (cpu.user + cpu.system) / 1000,
    peakRssMiB: process.resourceUsage().maxRSS / 1024,
    note: 'Fresh process peak RSS includes Node, models, index and results; not model-only memory. Setup includes warmup; CPU and total exclude reporting and disposal.'
  };
  run.status = 'complete';
  run.completedAt = new Date().toISOString();
  await save();
  console.table(run.results.map(result => ({ strategy: result.id, ...result.metrics })));
} catch (error) {
  run.status = 'failed'; run.error = error.stack; await save(); throw error;
} finally {
  await reranker?.dispose();
  await embedder?.dispose();
}
console.log(`Saved ${dir}/run.json`);
if (config.report) {
  const { createReport } = await import('./report.js');
  await createReport(`${dir}/run.json`);
}
