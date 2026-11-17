import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import { readJSON } from '../lib/data.js';
import { measureSuggestionFlow } from '../lib/suggestion-flow.js';

const directory = process.argv[2];
assert(directory, 'Usage: node scripts/measure-suggestion-flow.js outputs/embedding-comparison-<timestamp>');
const entries = await readJSON(`${directory}/runs.json`);
const datasets = ['real', 'real-derived', 'hard'];
const variants = ['minilm-128', 'bge-128'];
const measurements = [], provenance = [];
for (const variant of variants) {
  const combined = [];
  for (const dataset of datasets) {
    const selected = entries.filter(entry => entry.dataset === dataset && entry.variant === variant);
    const runs = await Promise.all(selected.map(async entry => ({ ...entry, run: await readJSON(entry.runPath) })));
    const first = runs.find(entry => entry.repeat === 1);
    assert(first, `Missing first run: ${dataset}/${variant}`);
    const rows = first.run.results.find(result => result.id === 'manual-closest').rows;
    const keys = rows => rows.map(row => [row.collectionId, row.id, row.queryText, row.expectedFolder, row.top3, row.certainEnough]);
    for (const { run } of runs) {
      assert.equal(run.status, 'complete');
      assert.deepEqual(run.config.thresholds, { newFolder: .55, askUserMargin: .05 });
      const result = run.results.find(result => result.id === 'manual-closest');
      assert.deepEqual(keys(result.rows), keys(rows), 'Ranking or confidence changed across repeats');
      for (const row of result.rows) {
        assert.equal(row.certainEnough, row.top3[0].score >= .55 && row.top3[0].score - row.top3[1].score >= .05);
      }
    }
    measurements.push({ dataset, variant, ...measureSuggestionFlow(rows) });
    provenance.push({ dataset, variant, runPath: first.runPath, repeatsVerified: runs.length });
    combined.push(...rows.map(row => ({ ...row, sourceDataset: dataset })));
  }
  measurements.push({ dataset: 'combined', variant, ...measureSuggestionFlow(combined) });
}
const percent = (count, total) => total ? `${(count / total * 100).toFixed(1)}% (${count}/${total})` : 'n/a (0 cases)';
const label = variant => variant === 'minilm-128' ? 'MiniLM' : 'BGE';
const select = (dataset, variant) => measurements.find(row => row.dataset === dataset && row.variant === variant);
const lines = ['## Adaptive one-or-two-folder suggestions', '',
  'Measured from saved `manual-closest` predictions for MiniLM-L12 Q8 and BGE-M3 Q8, both at 128 tokens. No new inference or threshold tuning. A case is "confident" when the first score is at least **0.55** and its margin over the second score is at least **0.05**. Show **one folder** for confident cases and **two folders** for all other cases. These are existing heuristic thresholds, not calibrated probabilities.', '',
  'Success means the expected folder appears among the displayed suggestions; it does not mean the user picked it. The nine no-target-folder cases in hard/combined are excluded from these rates. Expected-folder alternatives remain strict mismatches. Each source case is counted once; rankings and confidence were verified across all three saved repeats. Combined pools the same source cases, retaining duplicates.', '',
  '### Fixed suggestion counts', '',
  'Bold marks the higher hit rate between models within each dataset and metric (including ties).', '',
  '| Dataset | Model | Always 1 folder | Always 2 folders | Always 3 folders |',
  '|---|---|---:|---:|---:|'];
for (const dataset of [...datasets, 'combined']) for (const variant of variants) {
  const row = select(dataset, variant), other = select(dataset, variants.find(id => id !== variant));
  const cell = field => { const text = percent(row[field], row.scored); return row[field] >= other[field] ? `**${text}**` : text; };
  lines.push(`| \`${dataset}\` | ${label(variant)} | ${cell('top1Hits')} | ${cell('top2Hits')} | ${cell('top3Hits')} |`);
}
lines.push('', '### Adaptive flow: coverage and accuracy', '',
  'The one-folder share uses all scored cases as denominator. Branch hit rates use only the cases in that branch. Overall success combines correct single suggestions and two-suggestion hits.', '',
  '| Dataset | Model | Shown 1: share | Shown 1: correct | Shown 2: expected included | Overall success |',
  '|---|---|---:|---:|---:|---:|');
for (const dataset of [...datasets, 'combined']) for (const variant of variants) {
  const r = select(dataset, variant), other = select(dataset, variants.find(id => id !== variant));
  const success = percent(r.flowHits, r.scored);
  lines.push(`| \`${dataset}\` | ${label(variant)} | ${percent(r.singleCount, r.scored)} | ${percent(r.singleHits, r.singleCount)} | ${percent(r.doubleHits, r.doubleCount)} | ${r.flowHits >= other.flowHits ? `**${success}**` : success} |`);
}
const a = select('combined', 'minilm-128'), b = select('combined', 'bge-128');
lines.push(`With the current thresholds, MiniLM shows one folder for ${percent(a.singleCount, a.scored)} of scored cases; ${a.singleErrors} of those suggestions are wrong. BGE shows one for ${percent(b.singleCount, b.scored)}; ${b.singleErrors} are wrong. Overall adaptive hit rates are **${percent(a.flowHits, a.scored)} for MiniLM** and **${percent(b.flowHits, b.scored)} for BGE**.`, '',
  `Compared with always showing two folders, the confidence rule hides the correct second choice in **${a.lostVsTop2} MiniLM cases** and **${b.lostVsTop2} BGE cases**. This is the measured cost of showing a single suggestion.`, '',
  'Interpretation: the one-or-two UI is viable to prototype, but current MiniLM confidence leaves meaningful single-suggestion errors. BGE gives a more reliable single-suggestion branch on this sample. Keep an explicit folder picker, calibrate thresholds separately per model on held-out real data, and measure the tradeoff between single-suggestion precision and coverage. Do not infer these hit rates from the earlier top-3 results or treat the small real set as a production guarantee.', '',
  `Reproduce: \`node scripts/measure-suggestion-flow.js ${directory}\`. Full counts, per-case displayed folders and source run paths are in [suggestion-flow.json](${directory}/suggestion-flow.json).`, '');
const markdown = lines.join('\n');
await writeFile(`${directory}/suggestion-flow.json`, JSON.stringify({ strategy: 'manual-closest', thresholds: { score: .55, margin: .05 }, provenance, measurements }, null, 2) + '\n');
await writeFile(`${directory}/suggestion-flow.md`, markdown.replaceAll(`(${directory}/suggestion-flow.json)`, '(suggestion-flow.json)'));
const reportPath = 'PROJECT_REPORT.md';
const report = await readFile(reportPath, 'utf8');
const start = '<!-- suggestion-flow:start -->', end = '<!-- suggestion-flow:end -->';
const block = `${start}\n${markdown}\n${end}\n\n`;
if (report.includes(start)) {
  const a = report.indexOf(start), b = report.indexOf(end, a);
  assert(b >= a);
  await writeFile(reportPath, report.slice(0, a) + block.trimEnd() + report.slice(b + end.length));
} else {
  assert(report.includes('## Conclusions'));
  await writeFile(reportPath, report.replace('## Conclusions', block + '## Conclusions'));
}
console.log(measurements.map(({ cases, ...row }) => row));
