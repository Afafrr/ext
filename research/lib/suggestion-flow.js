import assert from 'node:assert/strict';

export function measureSuggestionFlow(rows) {
  const eligible = rows.filter(row => row.expectedFolder !== null);
  const contains = (row, n) => row.top3.slice(0, n).some(candidate => candidate.folder === row.expectedFolder);
  for (const row of rows) {
    assert.equal(typeof row.certainEnough, 'boolean');
    assert(row.top3.length >= 2);
    assert.equal(row.topFolder, row.top3[0].folder);
    assert.equal(row.correct, row.expectedFolder === null ? null : contains(row, 1));
  }
  const single = eligible.filter(row => row.certainEnough);
  const double = eligible.filter(row => !row.certainEnough);
  const singleHits = single.filter(row => contains(row, 1)).length;
  const doubleHits = double.filter(row => contains(row, 2)).length;
  const noFolder = rows.filter(row => row.expectedFolder === null);
  return {
    total: rows.length, scored: eligible.length,
    top1Hits: eligible.filter(row => contains(row, 1)).length,
    top2Hits: eligible.filter(row => contains(row, 2)).length,
    top3Hits: eligible.filter(row => contains(row, 3)).length,
    singleCount: single.length, singleHits, singleErrors: single.length - singleHits,
    doubleCount: double.length, doubleHits,
    flowHits: singleHits + doubleHits, flowMisses: eligible.length - singleHits - doubleHits,
    lostVsTop2: single.filter(row => !contains(row, 1) && contains(row, 2)).length,
    noFolder: { total: noFolder.length, single: noFolder.filter(row => row.certainEnough).length,
      double: noFolder.filter(row => !row.certainEnough).length },
    cases: rows.map(row => ({ id: row.id, collectionId: row.collectionId, title: row.title,
      expectedFolder: row.expectedFolder, certainEnough: row.certainEnough,
      displayedFolders: row.top3.slice(0, row.certainEnough ? 1 : 2).map(candidate => candidate.folder),
      expectedRank: row.expectedFolder === null ? null : (row.top3.findIndex(candidate => candidate.folder === row.expectedFolder) + 1 || null),
      hit: row.expectedFolder === null ? null : contains(row, row.certainEnough ? 1 : 2) }))
  };
}
