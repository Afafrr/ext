import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import { resolve, join } from 'node:path';
import os from 'node:os';

// Artifact Tool is supplied by the Codex runtime, not installed in the project.
async function artifactTool() {
  const modules = process.env.ARTIFACT_NODE_MODULES ?? join(os.homedir(), '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules');
  try {
    return await import(pathToFileURL(createRequire(join(modules, '__loader.cjs')).resolve('@oai/artifact-tool')).href);
  } catch (error) {
    throw new Error('Excel reports require the Codex Artifact Tool runtime. Set ARTIFACT_NODE_MODULES to its node_modules directory.', { cause: error });
  }
}

export function buildReportData(run) {
  if (run.status !== 'complete') throw new Error('Reports require a complete run.');
  const summary = [], datasets = [];
  for (const dataset of run.config.datasets ?? [run.config.dataset]) {
    const results = run.results.filter(result => result.dataset === dataset);
    if (!results.length) throw new Error(`No results for ${dataset}`);
    const key = row => `${row.collectionId}:${row.id}`;
    const first = results[0].rows;
    const maps = results.map(result => new Map(result.rows.map(row => [key(row), row])));
    for (const map of maps) {
      if (map.size !== first.length || first.some(row => !map.has(key(row)))) {
        throw new Error('Case mismatch between configurations');
      }
      if (first.some(row => map.get(key(row)).expectedFolder !== row.expectedFolder)) {
        throw new Error('Expected-folder mismatch between configurations');
      }
    }
    const cases = [];
    const certain = row => Object.hasOwn(row, 'certainEnough') ? row.certainEnough
      : row.top3[0].score >= run.config.thresholds.newFolder
        && row.top3[0].score - row.top3[1].score >= run.config.thresholds.askUserMargin;
    for (const result of results) {
      const eligible = result.rows.filter(row => row.expectedFolder !== null);
      const correct = eligible.filter(row => row.top3[0].folder === row.expectedFolder).length;
      summary.push([
        dataset === 'combined' ? 'combined (real + synthetic)' : dataset === 'real-derived' ? 'real-derived (synthetic)' : dataset === 'hard' ? 'hard (synthetic)' : dataset, result.label ?? result.id,
        eligible.length ? correct / eligible.length : null,
        eligible.length && eligible.every(row => certain(row) !== null)
          ? eligible.filter(certain).length / eligible.length : 'n.a.',
        correct, eligible.length - correct,
        result.rows.reduce((sum, row) => sum + row.queryMs, 0) / result.rows.length
      ]);
    }
    // Keep configurations for the same case together; filters can isolate either.
    for (const row of first) {
      for (let i = 0; i < results.length; i++) {
        const current = maps[i].get(key(row));
        const best = current.top3[0];
        cases.push([
          current.id, current.title, current.expectedFolder ?? '(no suitable folder)',
          results[i].label ?? results[i].id, best.folder, best.score,
          certain(current) === null ? 'n.a.' : certain(current) ? 'Yes' : 'No',
          current.expectedFolder === null ? 'Not scored' : best.folder === current.expectedFolder ? 'Correct' : 'Wrong',
          current.queryMs
        ]);
      }
    }
    datasets.push({ name: dataset, cases });
  }
  return { summary, datasets };
}

export async function createReport(file) {
  const run = JSON.parse(await readFile(file, 'utf8'));
  const data = buildReportData(run);
  const { Workbook, SpreadsheetFile } = await artifactTool();
  const wb = Workbook.create();
  const summary = wb.worksheets.add('Summary');
  const dir = `outputs/${run.runId}`;
  await mkdir(dir, { recursive: true });
  const write = (sheet, row, column, values) => {
    sheet.getRangeByIndexes(row, column, values.length, values[0].length).values = values;
  };
  function table(sheet, headers, rows, name, widths) {
    write(sheet, 4, 0, [headers, ...rows]);
    const range = sheet.getRangeByIndexes(4, 0, rows.length + 1, headers.length);
    const table = sheet.tables.add(range.address, true, name);
    table.showFilterButton = true;
    range.format.font = { name: 'Arial', size: 10, color: '#233044' };
    range.format.verticalAlignment = 'center';
    range.format.wrapText = true;
    range.format.rowHeight = 34;
    widths.forEach((width, column) => {
      sheet.getRangeByIndexes(4, column, rows.length + 1, 1).format.columnWidth = width;
    });
    const header = sheet.getRangeByIndexes(4, 0, 1, headers.length);
    header.format.fill = '#243B53';
    header.format.font = { name: 'Arial', size: 10, bold: true, color: '#FFFFFF' };
    header.format.rowHeight = 40;
    sheet.showGridLines = false;
    sheet.freezePanes.freezeRows(5);
  }
  function title(sheet, text, subtitle, columns) {
    sheet.getRangeByIndexes(1, 0, 1, columns).merge();
    write(sheet, 1, 0, [[text]]);
    sheet.getCell(1, 0).format.font = { name: 'Arial', size: 14, bold: true };
    sheet.getRangeByIndexes(2, 0, 1, columns).merge();
    write(sheet, 2, 0, [[subtitle]]);
    sheet.getCell(2, 0).format.font = { name: 'Arial', size: 10, color: '#526477' };
  }
  const context = run.config.model
    ? `${run.config.model.model.split('/').at(-1)} ${run.config.model.dtype.toUpperCase()}; ${run.config.fields.join(' + ')}. ` : '';
  title(summary, 'Bookmark classification benchmark', context + 'Accuracy = first folder matches expected.', 7);
  table(summary,
    ['Dataset', 'Strategy', 'First-choice accuracy', 'Certain enough (%)', 'Correct', 'Wrong', 'Avg time (ms)'],
    data.summary, 'RunSummary', [15, 45, 21, 21, 12, 12, 18]);
  summary.getRangeByIndexes(5, 2, data.summary.length, 2).setNumberFormat('0.0%');
  summary.getRangeByIndexes(5, 3, data.summary.length, 1).format.horizontalAlignment = 'right';
  summary.getRangeByIndexes(5, 4, data.summary.length, 2).setNumberFormat('0');
  summary.getRangeByIndexes(5, 6, data.summary.length, 1).setNumberFormat('0.0');
  summary.tabColor = '#243B53';
  const notes = [
    'Accuracy, Correct, Wrong and Certain enough count only cases with an expected folder. No-folder cases are Not scored.',
    `Certain enough: first score ≥ ${run.config.thresholds.newFolder} and lead over second ≥ ${run.config.thresholds.askUserMargin}. A threshold check, not a probability.`,
    'Reranker certainty is n.a.: its relevance logits use a different scale. Certainty thresholds are uncalibrated.',
    'Average time includes embedding + folder ranking + any reranking, excluding model loading and indexing.'
  ];
  if (run.config.reranker && run.results.some(result => result.id === 'rerank')) {
    notes.push(`Reranker: ${run.config.reranker.model} (${run.config.reranker.dtype.toUpperCase()}).`);
  }
  notes.forEach((note, index) => {
    const row = 6 + data.summary.length + index;
    const range = summary.getRangeByIndexes(row, 0, 1, 7);
    range.merge();
    write(summary, row, 0, [[note]]);
    range.format.font = { name: 'Arial', size: 10, color: '#526477' };
    range.format.wrapText = true;
    range.format.rowHeight = 28;
  });
  const previews = [{ sheetName: 'Summary', range: `A1:G${6 + data.summary.length + notes.length}`, filename: 'summary.png' }];
  for (const dataset of data.datasets) {
    const sheetName = dataset.name === 'combined' ? 'Combined cases' : dataset.name === 'hard' ? 'Hard synthetic cases' : dataset.name === 'real-derived' ? 'Real-derived synthetic cases'
      : dataset.name === 'synthetic' ? 'Synthetic cases' : 'Real cases';
    const sheet = wb.worksheets.add(sheetName);
    const label = dataset.name === 'combined' ? 'COMBINED real + synthetic bookmarks' : dataset.name === 'hard' ? 'HARD SYNTHETIC browser bookmarks' : dataset.name === 'real-derived' ? 'SYNTHETIC pages based on real folders'
      : dataset.name === 'synthetic' ? 'SYNTHETIC bookmarks' : 'Original real bookmarks';
    title(sheet, `${label} — first-choice results`,
      'Filter Strategy or Case ID to compare. No suitable folder = Not scored. Certainty is separate from correctness.', 9);
    table(sheet,
      ['Case ID', 'Title', 'Expected folder', 'Strategy', 'First folder', 'Score', 'Certain enough?', 'Result', 'Time (ms)'],
      dataset.cases, `${dataset.name.replaceAll('-', '')}Cases`, [22, 45, 25, 45, 25, 11, 17, 14, 13]);
    sheet.freezePanes.freezeColumns(3);
    sheet.getRangeByIndexes(5, 0, dataset.cases.length, 9).format.rowHeight = 58;
    sheet.getRangeByIndexes(5, 5, dataset.cases.length, 1).setNumberFormat('0.000');
    sheet.getRangeByIndexes(5, 8, dataset.cases.length, 1).setNumberFormat('0.0');
    const statuses = sheet.getRangeByIndexes(5, 7, dataset.cases.length, 1);
    statuses.conditionalFormats.add('containsText', { text: 'Correct', format: { fill: '#E3F2E8', font: { color: '#22633D' } } });
    statuses.conditionalFormats.add('containsText', { text: 'Wrong', format: { fill: '#FBE5E5', font: { color: '#A32626' } } });
    previews.push({ sheetName, range: 'A1:I10', filename: `${dataset.name}-cases.png` });
  }
  wb.recalculate();
  const inspection = await wb.inspect({ kind: 'region', sheetId: 'Summary', range: 'A5:G9', maxChars: 2200 });
  await writeFile(`${dir}/report-inspection.ndjson`, inspection.ndjson);
  const errors = await wb.inspect({ kind: 'match', searchTerm: '#REF!|#DIV/0!|#VALUE!|#NAME\\?|#NUM!|#SPILL!', options: { useRegex: true, maxResults: 20 }, maxChars: 1500 });
  await writeFile(`${dir}/report-errors.ndjson`, errors.ndjson);
  for (const preview of previews) {
    const image = await wb.render({ sheetName: preview.sheetName, range: preview.range, scale: 1, format: 'png' });
    await writeFile(`${dir}/${preview.filename}`, new Uint8Array(await image.arrayBuffer()));
  }
  const output = await SpreadsheetFile.exportXlsx(wb);
  await output.save(`${dir}/comparison.xlsx`);
  console.log(`Report: ${dir}/comparison.xlsx`);
  return `${dir}/comparison.xlsx`;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  if (!process.argv[2]) throw new Error('Usage: npm run report -- results/<run>/run.json');
  await createReport(process.argv[2]);
}
