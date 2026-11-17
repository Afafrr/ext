import assert from 'node:assert/strict';
import { readJSON } from './data.js';

const median = values => {
  const sorted = [...values].sort((a, b) => a - b), middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
};
const identity = rows => rows.map(row => [row.collectionId, row.id, row.queryText, row.expectedFolder]);

export async function summarizeRerankerRuns(entries, baselineEntries) {
  const load = async entry => ({ ...entry, run: await readJSON(entry.runPath) });
  const runs = await Promise.all(entries.map(load));
  const baselines = await Promise.all(baselineEntries.filter(entry => entry.repeat === 1 && entry.variant === 'minilm-128').map(load));
  const summary = [];
  for (const entry of runs) {
    if (summary.some(row => row.dataset === entry.dataset && row.variant === entry.variant)) continue;
    const selected = runs.filter(row => row.dataset === entry.dataset && row.variant === entry.variant);
    const strategy = entry.variant === 'minilm-reranker-128' ? 'rerank' : 'manual-closest';
    const baseline = entry.dataset === 'combined'
      ? runs.find(row => row.dataset === entry.dataset && row.variant === 'minilm-128')
      : baselines.find(row => row.dataset === entry.dataset);
    assert(baseline, `Missing baseline: ${entry.dataset}`);
    const base = baseline.run.results.find(row => row.id === 'manual-closest');
    const first = entry.run.results.find(row => row.id === strategy);
    for (const { run } of selected) {
      assert.equal(run.status, 'complete');
      assert.equal(run.validation.fingerprint, baseline.run.validation.fingerprint);
      assert.deepEqual(run.config.fields, baseline.run.config.fields);
      for (const file of ['lib/scoring.js', 'lib/models.js', 'scripts/bench.js']) {
        assert.equal(run.sourceSnapshot[file], baseline.run.sourceSnapshot[file], `Changed benchmark logic: ${file}`);
      }
      assert.deepEqual(run.descriptions, baseline.run.descriptions);
      for (const field of ['cpu', 'platform', 'arch', 'node']) assert.equal(run.runtime[field], baseline.run.runtime[field]);
      const result = run.results.find(row => row.id === strategy);
      assert.deepEqual(identity(result.rows), identity(base.rows));
      assert.deepEqual(result.rows.map(row => row.topFolder), first.rows.map(row => row.topFolder));
      assert.deepEqual(run.config.model, entry.run.config.model);
      assert.deepEqual(run.config.reranker, entry.run.config.reranker);
      assert.equal(run.sourceHash, entry.run.sourceHash);
      if (strategy === 'rerank') {
        // Verify retrieval is unchanged from the no-reranker MiniLM baseline.
        assert.deepEqual(run.results.find(row => row.id === 'manual-closest').rows.map(row => row.topFolder), base.rows.map(row => row.topFolder));
      }
    }
    const fixed = first.rows.filter((row, i) => row.correct === true && base.rows[i].correct === false).length;
    const regressed = first.rows.filter((row, i) => row.correct === false && base.rows[i].correct === true).length;
    summary.push({ dataset: entry.dataset, variant: entry.variant, strategy,
      model: entry.run.config.model, reranker: entry.run.config.reranker ?? null,
      correct: first.metrics.correct, scored: first.metrics.correct + first.metrics.wrong,
      total: first.rows.length, accuracy: first.metrics.accuracy, repeats: selected.length,
      meanMs: median(selected.map(row => row.run.results.find(result => result.id === strategy).metrics.meanQueryMs)),
      strategyMeanMs: Object.fromEntries(entry.run.results.map(result => [result.id,
        median(selected.map(row => row.run.results.find(item => item.id === result.id).metrics.meanQueryMs))])),
      peakRssMiB: median(selected.map(row => row.run.runtime.peakRssMiB)), fixed, regressed,
      runPaths: selected.map(row => row.runPath) });
  }
  return summary;
}

export function rerankerOverview(data) {
  if (!data.rerankerSummary?.length) return '';
  const format = (n, digits = 1) => n.toFixed(digits).replace('.', ',');
  const percent = row => `${format(row.accuracy * 100)}% (${row.correct}/${row.scored})`;
  const datasets = ['real', 'real-derived', 'hard', 'combined'];
  const select = (dataset, variant) => data.rerankerSummary.find(row => row.dataset === dataset && row.variant === variant)
    ?? data.summary.find(row => row.dataset === dataset && row.variant === variant && row.strategy === 'manual-closest');
  const lines = ['## MiniLM + reranker — porównanie', '',
    '**MiniLM-L12 + BGE-reranker-v2-m3 Q8**: MiniLM wybiera 3 foldery strategią z ręcznym opisem, reranker ocenia je ponownie. Limit embeddingu: 128 tokenów; rerankera: 512 tokenów na parę zapytanie–folder. Warianty bez rerankera korzystają ze strategii `manual-closest`.', '',
    '| Dataset | MiniLM | BGE | MiniLM + reranker | Zmiana vs MiniLM | Poprawione / pogorszone |',
    '|---|---:|---:|---:|---:|---:|'];
  for (const dataset of datasets) {
    const a = select(dataset, 'minilm-128'), b = select(dataset, 'bge-128'), r = select(dataset, 'minilm-reranker-128');
    if (!r) continue;
    lines.push(`| ${dataset} | ${percent(a)} | ${percent(b)} | ${percent(r)} | ${format((r.accuracy - a.accuracy) * 100)} pp | ${r.fixed} / ${r.regressed} |`);
  }
  lines.push('', '### Czas zapytania z rerankerem', '',
    '| Dataset | MiniLM | BGE | MiniLM + reranker |', '|---|---:|---:|---:|');
  for (const dataset of datasets) {
    const rows = ['minilm-128', 'bge-128', 'minilm-reranker-128'].map(variant => select(dataset, variant));
    if (!rows[2]) continue;
    lines.push(`| ${dataset} | ${rows.map(row => `${format(row.meanMs, 2)} ms`).join(' | ')} |`);
  }
  lines.push('', '### RAM z rerankerem', '',
    '| Dataset | MiniLM | BGE | MiniLM + reranker | Dodatkowy RAM vs MiniLM |', '|---|---:|---:|---:|---:|');
  for (const dataset of datasets) {
    const rows = ['minilm-128', 'bge-128', 'minilm-reranker-128'].map(variant => select(dataset, variant));
    if (!rows[2]) continue;
    lines.push(`| ${dataset} | ${rows.map(row => `${format(row.peakRssMiB, 0)} MiB`).join(' | ')} | ${format(rows[2].peakRssMiB - rows[0].peakRssMiB, 0)} MiB |`);
  }
  lines.push('', 'RAM to mediana szczytów całych osobnych procesów, z oboma modelami załadowanymi jednocześnie w wariancie z rerankerem. Różnica RAM jest różnicą pomiarów całych procesów. Czas obejmuje embedding, retrieval i reranking po rozgrzewce; nie obejmuje ładowania ani indeksowania. Każdy dataset, również combined, był mierzony osobno.', '',
    `Liczba powtórzeń nowych pomiarów: ${data.rerankerSummary.map(row => `${row.dataset}/${row.variant}: ${row.repeats}`).join('; ')}. Bazowe pomiary real, real-derived i hard: ${data.repeats} powtórzenia z pierwotnego porównania. Ścieżki nowych uruchomień są w reranker-runs.json.`, '');
  return lines.join('\n');
}
