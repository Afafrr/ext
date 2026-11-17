import test from 'node:test';
import assert from 'node:assert/strict';
import { measureSuggestionFlow } from '../lib/suggestion-flow.js';

const row = (id, expectedFolder, certainEnough) => ({ id, collectionId: 'user', title: id,
  expectedFolder, certainEnough, topFolder: 'a',
  correct: expectedFolder === null ? null : expectedFolder === 'a',
  top3: ['a', 'b', 'c'].map(folder => ({ folder })) });

test('adaptive flow distinguishes wrong confidence, two-choice rescue, total misses and no-target cases', () => {
  const result = measureSuggestionFlow([
    row('single-correct', 'a', true), row('hidden-second', 'b', true),
    row('double-correct', 'b', false), row('outside', 'd', false), row('no-target', null, true)
  ]);
  assert.equal(result.scored, 4);
  assert.equal(result.total, 5);
  assert.equal(result.top1Hits, 1);
  assert.equal(result.top2Hits, 3);
  assert.equal(result.top3Hits, 3);
  assert.equal(result.singleCount, 2);
  assert.equal(result.singleHits, 1);
  assert.equal(result.singleErrors, 1);
  assert.equal(result.doubleCount, 2);
  assert.equal(result.doubleHits, 1);
  assert.equal(result.flowHits, 2);
  assert.equal(result.flowMisses, 2);
  assert.equal(result.lostVsTop2, 1);
  assert.deepEqual(result.noFolder, { total: 1, single: 1, double: 0 });
  assert.deepEqual(result.cases[1].displayedFolders, ['a']);
  assert.equal(result.cases[1].expectedRank, 2);
  assert.equal(result.cases[1].hit, false);
  assert.deepEqual(result.cases[2].displayedFolders, ['a', 'b']);
  assert.equal(result.cases[2].hit, true);
  assert.equal(result.cases[3].expectedRank, null);
  assert.equal(result.cases[4].hit, null);
});

test('no-target cases never increase success and reranker confidence cannot be silently treated as uncertain', () => {
  const result = measureSuggestionFlow([row('none', null, false)]);
  assert.equal(result.scored, 0);
  assert.equal(result.flowHits, 0);
  assert.equal(result.doubleCount, 0);
  assert.throws(() => measureSuggestionFlow([row('reranker', 'a', null)]));
});
