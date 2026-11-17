import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { loadDataset, validateDataset } from '../lib/data.js';
import { validateConfig } from '../lib/config.js';
import { withCombinedSummary } from '../lib/combined-summary.js';

test('combined preserves source evaluation and collection-local inputs without duplicating the shared index', async () => {
  const data = await loadDataset('combined');
  const stats = validateDataset(data);
  assert.equal(stats.cases, 321);
  assert.equal(stats.cases - stats.noFolder, 312);
  assert.equal(stats.indexed, 83);
  assert.equal(stats.collections, 4);
  assert.equal(stats.duplicateCopies, 6);
  const descriptions = JSON.parse(await readFile('datasets/combined/descriptions.json', 'utf8'));
  for (const source of ['real', 'real-derived', 'hard']) {
    const original = await loadDataset(source);
    const selected = data.evaluation.filter(row => row.sourceDataset === source);
    assert.deepEqual(selected.map(({ sourceDataset, ...row }) => row), original.evaluation);
    for (const item of original.index) assert.deepEqual(data.index.find(row => row.id === item.id), item);
    for (const collection of original.collections) {
      assert.deepEqual(data.collections.find(row => row.id === collection.id), collection);
      for (const folder of collection.folders) assert.ok(descriptions.folders[`${collection.id}/${folder.path}`].manual);
    }
  }
  const config = validateConfig(JSON.parse(await readFile('benchmark.minilm.combined.config.json', 'utf8')));
  assert.equal(config.dataset, 'combined');
  assert.ok(!config.strategies.includes('generated-closest') && !config.strategies.includes('domain-closest'));
});

test('combined excludes unscored cases, distinguishes pooled and equal-weight accuracy, and requires all sources', () => {
  const rows = [
    { dataset: 'real', total: 2, scored: 2, correct: 2, accuracy: 1 },
    { dataset: 'real-derived', total: 4, scored: 4, correct: 1, accuracy: .25 },
    { dataset: 'hard', total: 6, scored: 4, correct: 0, accuracy: 0 }
  ].map(row => ({ ...row, variant: 'model', strategy: 'closest', fixed: 1, regressed: 0,
    differences: [{ id: 'case', fixed: true }] }));
  rows.push({ ...rows[0], strategy: 'generated-closest' });
  const result = withCombinedSummary(rows);
  const combined = result.filter(row => row.dataset === 'combined');
  assert.equal(combined.length, 1);
  assert.equal(combined[0].total, 12);
  assert.equal(combined[0].scored, 10);
  assert.equal(combined[0].correct, 3);
  assert.equal(combined[0].accuracy, .3);
  assert.equal(combined[0].macroAccuracy, 1.25 / 3);
  assert.equal(combined[0].fixed, 3);
  assert.deepEqual(combined[0].differences.map(row => row.sourceDataset), ['real', 'real-derived', 'hard']);
  assert.equal(Object.hasOwn(combined[0], 'meanMs'), false);
  assert.deepEqual(withCombinedSummary(result), result);
});
