import { mkdir, readFile, writeFile, stat } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import assert from 'node:assert/strict';
import { collectEmbeddingCases, embeddingOverview, embeddingProblems, embeddingModelSummary } from '../lib/embedding-report.js';
import { withCombinedSummary, combinedOverview } from '../lib/combined-summary.js';

// Run sequential fresh processes: concurrent inference would distort latency/RSS.
const repeats = Number(process.env.BENCH_REPEATS ?? 3);
assert(Number.isInteger(repeats) && repeats >= 1, 'BENCH_REPEATS must be a positive integer');
const directory = `outputs/embedding-comparison-${new Date().toISOString().replace(/[:.]/g, '-')}`;
await mkdir(directory, { recursive: true });
const variants = [
  { id: 'minilm-128', model: 'Xenova/paraphrase-multilingual-MiniLM-L12-v2', pooling: 'mean', maxLength: 128 },
  { id: 'bge-128', model: 'Xenova/bge-m3', pooling: 'cls', maxLength: 128 },
  { id: 'bge-8192', model: 'Xenova/bge-m3', pooling: 'cls', maxLength: 8192 }
];
const datasets = ['real', 'real-derived', 'hard'];
const runs = [];
for (let repeat = 0; repeat < repeats; repeat++) {
  // Rotate order so each variant runs first once with the default three repeats.
  const order = [...variants.slice(repeat % variants.length), ...variants.slice(0, repeat % variants.length)];
  for (const dataset of datasets) for (const variant of order) {
    const template = dataset === 'hard' ? 'benchmark.minilm.hard.config.json'
      : dataset === 'real-derived' ? 'benchmark.minilm.real-derived.config.json' : 'benchmark.minilm.config.json';
    const config = JSON.parse(await readFile(template, 'utf8'));
    config.model = { model: variant.model, dtype: 'q8', pooling: variant.pooling, maxLength: variant.maxLength };
    config.strategies = config.strategies.filter(id => id !== 'rerank');
    delete config.reranker;
    config.localFilesOnly = true;
    config.report = false;
    const prefix = `${directory}/${dataset}-${variant.id}-${repeat + 1}`;
    await writeFile(`${prefix}.config.json`, JSON.stringify(config, null, 2) + '\n');
    console.log(`[${runs.length + 1}/${repeats * datasets.length * variants.length}] ${dataset} / ${variant.id} / repeat ${repeat + 1}`);
    const child = spawnSync(process.execPath, ['scripts/bench.js', `${prefix}.config.json`], { encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 });
    await writeFile(`${prefix}.log`, (child.stdout ?? '') + (child.stderr ?? ''));
    if (child.error || child.status !== 0) throw new Error(`Benchmark failed; see ${prefix}.log`, { cause: child.error });
    const runPath = child.stdout.match(/Saved (results\/[^\n]+\/run\.json)/)?.[1];
    assert(runPath, 'Benchmark did not print a result path');
    const run = JSON.parse(await readFile(runPath, 'utf8'));
    assert.equal(run.status, 'complete');
    runs.push({ dataset, variant: variant.id, repeat: repeat + 1, runPath, run });
    await writeFile(`${directory}/runs.json`, JSON.stringify(runs.map(({ run, ...entry }) => entry), null, 2) + '\n');
  }
}

const mean = values => values.reduce((sum, value) => sum + value, 0) / values.length;
const median = values => { const sorted = [...values].sort((a, b) => a - b); const mid = Math.floor(sorted.length / 2); return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2; };
const percentile = (values, p) => [...values].sort((a, b) => a - b)[Math.ceil(values.length * p) - 1];
let summary = [];
for (const dataset of datasets) {
  const baseline = runs.find(entry => entry.dataset === dataset && entry.variant === variants[0].id).run;
  for (const variant of variants) {
    const selected = runs.filter(entry => entry.dataset === dataset && entry.variant === variant.id);
    const first = selected[0].run;
    for (const entry of selected) {
      assert.equal(entry.run.validation.fingerprint, baseline.validation.fingerprint);
      assert.equal(entry.run.sourceHash, baseline.sourceHash);
      assert.deepEqual(entry.run.descriptions, baseline.descriptions);
      assert.deepEqual(entry.run.config.fields, baseline.config.fields);
    }
    for (const strategy of first.results) {
      const measurements = selected.map(entry => entry.run.results.find(result => result.id === strategy.id));
      const predictionKeys = result => result.rows.map(row => [row.id, row.collectionId, row.queryText, row.expectedFolder, row.topFolder]);
      for (const measurement of measurements) assert.deepEqual(predictionKeys(measurement), predictionKeys(strategy), 'Predictions changed across repeats');
      const base = baseline.results.find(result => result.id === strategy.id);
      const baseRows = new Map(base.rows.map(row => [`${row.collectionId}/${row.id}`, row]));
      let fixed = 0, regressed = 0;
      const differences = [];
      for (const row of strategy.rows) {
        const previous = baseRows.get(`${row.collectionId}/${row.id}`);
        assert(previous);
        assert.equal(row.queryText, previous.queryText);
        assert.equal(row.expectedFolder, previous.expectedFolder);
        if (row.correct === null) continue;
        if (row.correct && !previous.correct) fixed++;
        if (!row.correct && previous.correct) regressed++;
        if (row.correct !== previous.correct) differences.push({ id: row.id, title: row.title, expected: row.expectedFolder, minilm: previous.topFolder, candidate: row.topFolder, fixed: row.correct });
      }
      const averages = measurements.map(result => result.metrics.meanQueryMs);
      summary.push({ dataset, variant: variant.id, strategy: strategy.id,
        correct: strategy.metrics.correct, scored: strategy.metrics.correct + strategy.metrics.wrong,
        total: strategy.rows.length, accuracy: strategy.metrics.accuracy,
        meanMs: median(averages), minMeanMs: Math.min(...averages), maxMeanMs: Math.max(...averages),
        p50Ms: median(measurements.map(result => percentile(result.rows.map(row => row.queryMs), .5))),
        p95Ms: median(measurements.map(result => percentile(result.rows.map(row => row.queryMs), .95))),
        peakRssMiB: median(selected.map(entry => entry.run.runtime.peakRssMiB)),
        setupMs: median(selected.map(entry => entry.run.runtime.setupMs)),
        indexingMs: median(selected.map(entry => entry.run.runtime.indexingMs)),
        cpuMs: mean(selected.map(entry => entry.run.runtime.cpuMs)),
        fixed, regressed, differences });
    }
  }
}
summary = withCombinedSummary(summary);
const weights = await Promise.all(variants.map(async variant => ({ ...variant,
  weightsMB: (await stat(`.cache/models/${variant.model}/onnx/model_quantized.onnx`)).size / 1e6
})));
await writeFile(`${directory}/summary.json`, JSON.stringify({ repeats, weights, hardware: runs[0].run.runtime, summary }, null, 2) + '\n');
const lines = [
  '# Embedding cost / accuracy comparison', '',
  `No reranker. ${repeats} sequential fresh processes per dataset and variant; order rotates each repeat. Cached local Q8 models, CPU inference.`, '',
  'Query = title + description; same index, descriptions, scoring and evaluation cases across variants. BGE-128 and MiniLM-128 share a token cap, but their tokenizers differ. BGE-8192 measures the existing long-context configuration.', '',
  'Latency excludes loading and indexing, includes query embedding and scoring after warmup. Reported mean/p50/p95 are medians across repeats; mean range shows timing variability. Repeats do not increase the number of independent evaluation cases. Peak RSS covers the entire fresh Node process, including runtime, index and results; it is not model-only RAM.', '',
  'The 21 real cases are reported separately from the 120 synthetic real-derived and 180 synthetic hard cases. Nine hard cases have no target folder: excluded from accuracy and paired differences, included in latency. Review-flagged and duplicate evaluation cases remain in these descriptive scores.', '',
  'No currency cost is assumed. Added seconds per 1,000 queries extrapolate sequential measured latency; they are not CPU billing or production throughput. Hosting prices, concurrency and workload volume are needed for a monetary estimate.', '',
  `Machine: ${runs[0].run.runtime.cpu}; ${runs[0].run.runtime.platform}/${runs[0].run.runtime.arch}; ${runs[0].run.runtime.node}.`, '',
  '| Variant | Quantized ONNX weights (MB, decimal) |', '|---|---:|',
  ...weights.map(item => `| ${item.id} | ${item.weightsMB.toFixed(1)} |`), ''
];
for (const dataset of datasets) {
  lines.push(`## ${dataset}`, '', '| Variant | Strategy | Correct | Accuracy | Mean ms (range) | p95 ms | Peak RSS MiB | Fixed / regressed vs MiniLM |', '|---|---|---:|---:|---:|---:|---:|---:|');
  for (const row of summary.filter(row => row.dataset === dataset)) lines.push(`| ${row.variant} | ${row.strategy} | ${row.correct}/${row.scored} | ${(row.accuracy * 100).toFixed(1)}% | ${row.meanMs.toFixed(2)} (${row.minMeanMs.toFixed(2)}–${row.maxMeanMs.toFixed(2)}) | ${row.p95Ms.toFixed(2)} | ${row.peakRssMiB.toFixed(0)} | ${row.fixed} / ${row.regressed} |`);
  lines.push('', 'Same-strategy cost comparison (manual descriptions + closest example):', '', '| Variant | Accuracy gain (pp) | Latency multiplier | Added seconds / 1,000 queries | Setup ms | Indexing ms |', '|---|---:|---:|---:|---:|---:|');
  const selected = summary.filter(row => row.dataset === dataset && row.strategy === 'manual-closest');
  const base = selected[0];
  for (const row of selected) lines.push(`| ${row.variant} | ${((row.accuracy - base.accuracy) * 100).toFixed(1)} | ${(row.meanMs / base.meanMs).toFixed(1)}× | ${(row.meanMs - base.meanMs).toFixed(2)} | ${row.setupMs.toFixed(0)} | ${row.indexingMs.toFixed(0)} |`);
  lines.push('');
}
lines.push('Individual benchmark paths are recorded in runs.json. Summary JSON includes paired case-level fixes/regressions. Treat these small authored datasets as evidence for this workload, not a universal model ranking.', '');
const cases = collectEmbeddingCases(runs);
await writeFile(`${directory}/metrics.md`, lines.join('\n') + '\n' + combinedOverview(summary));
await writeFile(`${directory}/comparison.md`, embeddingOverview({ summary, weights, repeats }, cases));
await writeFile(`${directory}/summary.md`, embeddingModelSummary({ summary, weights, repeats }));
await writeFile(`${directory}/problematic-cases.md`, embeddingProblems(cases));
console.log(`Saved ${directory}/comparison.md`);
