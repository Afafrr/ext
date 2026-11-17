import assert from 'node:assert/strict';
import { writeFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { readJSON } from '../lib/data.js';

const directory = process.argv[2];
assert(directory, 'Usage: npm run bench:compare:reranker -- outputs/embedding-comparison-<timestamp>');
const repeats = Number(process.env.BENCH_REPEATS ?? 3);
assert(Number.isInteger(repeats) && repeats > 0);
const manifest = `${directory}/reranker-runs.json`;
let entries;
try { entries = await readJSON(manifest); }
catch (error) { if (error.code !== 'ENOENT') throw error; entries = []; }
for (const dataset of ['real', 'real-derived', 'hard', 'combined']) {
  const template = dataset === 'real' ? 'benchmark.minilm.config.json' : `benchmark.minilm.${dataset}.config.json`;
  const variants = dataset === 'combined' ? ['minilm-128', 'bge-128', 'minilm-reranker-128'] : ['minilm-reranker-128'];
  for (let repeat = 1; repeat <= repeats; repeat++) for (const variant of variants) {
    if (entries.some(entry => entry.dataset === dataset && entry.variant === variant && entry.repeat === repeat)) continue;
    const config = await readJSON(template);
    if (variant === 'bge-128') config.model = { model: 'Xenova/bge-m3', dtype: 'q8', pooling: 'cls', maxLength: 128 };
    if (variant !== 'minilm-reranker-128') {
      config.strategies = config.strategies.filter(id => id !== 'rerank');
      delete config.reranker;
    }
    config.localFilesOnly = true;
    config.report = false;
    const prefix = `${directory}/reranker-${dataset}-${variant}-${repeat}`;
    await writeFile(`${prefix}.config.json`, JSON.stringify(config, null, 2) + '\n');
    console.log(`${dataset} / ${variant} / repeat ${repeat}/${repeats}`);
    const child = spawnSync(process.execPath, ['scripts/bench.js', `${prefix}.config.json`], { encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 });
    await writeFile(`${prefix}.log`, (child.stdout ?? '') + (child.stderr ?? ''));
    assert(!child.error && child.status === 0, `Benchmark failed: ${prefix}.log`);
    const runPath = child.stdout.match(/Saved (results\/[^\n]+\/run\.json)/)?.[1];
    assert(runPath);
    entries.push({ dataset, variant, repeat, runPath });
    await writeFile(manifest, JSON.stringify(entries, null, 2) + '\n');
  }
}
const report = spawnSync(process.execPath, ['scripts/report-embeddings.js', directory], { stdio: 'inherit' });
assert.equal(report.status, 0);
