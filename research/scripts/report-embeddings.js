import { readFile, writeFile, access } from 'node:fs/promises';
import path from 'node:path';
import { collectEmbeddingCases, embeddingOverview, embeddingProblems, embeddingModelSummary } from '../lib/embedding-report.js';
import { withCombinedSummary, combinedOverview } from '../lib/combined-summary.js';
import { summarizeRerankerRuns } from '../lib/reranker-report.js';

const directory = process.argv[2];
if (!directory) throw new Error('Usage: npm run report:embeddings -- outputs/embedding-comparison-<timestamp>');
const readJSON = async file => JSON.parse(await readFile(file, 'utf8'));
const data = await readJSON(path.join(directory, 'summary.json'));
data.summary = withCombinedSummary(data.summary);
const entries = await readJSON(path.join(directory, 'runs.json'));
let rerankerEntries;
try { rerankerEntries = await readJSON(path.join(directory, 'reranker-runs.json')); }
catch (error) { if (error.code !== 'ENOENT') throw error; }
if (rerankerEntries) data.rerankerSummary = await summarizeRerankerRuns(rerankerEntries, entries);
const runs = await Promise.all(entries.filter(entry => entry.repeat === 1 && ['minilm-128', 'bge-128'].includes(entry.variant))
  .map(async entry => ({ ...entry, run: await readJSON(entry.runPath) })));
const cases = collectEmbeddingCases(runs);
// Keep the technical appendix from the first report format when migrating it.
const metricsPath = path.join(directory, 'metrics.md');
try { await access(metricsPath); }
catch (error) {
  if (error.code !== 'ENOENT') throw error;
  const old = await readFile(path.join(directory, 'comparison.md'), 'utf8');
  const start = old.indexOf('# Embedding cost / accuracy comparison');
  if (start < 0) throw new Error('Technical appendix not found; comparison.md was left unchanged.');
  await writeFile(metricsPath, old.slice(start));
}
await writeFile(path.join(directory, 'comparison.md'), embeddingOverview(data, cases));
await writeFile(path.join(directory, 'summary.md'), embeddingModelSummary(data));
await writeFile(path.join(directory, 'summary.json'), JSON.stringify(data, null, 2) + '\n');
const metrics = await readFile(metricsPath, 'utf8');
await writeFile(metricsPath, metrics.split('## Combined — wszystkie trzy zbiory')[0].trimEnd() + '\n\n' + combinedOverview(data.summary));
await writeFile(path.join(directory, 'problematic-cases.md'), embeddingProblems(cases));
console.log(`Saved ${directory}/{summary.md,comparison.md,problematic-cases.md,metrics.md,summary.json} (${cases.filter(item => item.errors > 0).length} problematic cases). No model inference was run.`);
