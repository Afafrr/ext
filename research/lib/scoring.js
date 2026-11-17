export const textFor = (item, fields) => fields.flatMap(field => item[field] ?? []).filter(Boolean).join('. ');
export const dot = (a, b) => a.reduce((sum, value, index) => sum + value * b[index], 0);

export function centroid(vectors) {
  if (!vectors.length) throw new Error('A folder needs at least one example');
  const mean = vectors[0].map((_, i) => vectors.reduce((sum, v) => sum + v[i], 0) / vectors.length);
  const length = Math.hypot(...mean);
  if (!length) throw new Error('Cannot normalize a zero centroid');
  return mean.map(value => value / length);
}

// Exact words matter for product/technology names; no fuzzy keyword expansion.
const STOPWORDS = new Set('a an the and or for of to in on with is how from at by i w z na do o po dla oraz jak się'.split(' '));
export function words(text) {
  return new Set((text.normalize('NFKC').toLowerCase().match(/[\p{L}\p{N}]+(?:[+#.]+[\p{L}\p{N}]*)*/gu) ?? [])
    .filter(word => word.length > 1 && !STOPWORDS.has(word)));
}
export function keywordScore(query, document) {
  const terms = words(query), target = words(document);
  return terms.size ? [...terms].filter(term => target.has(term)).length / terms.size : 0;
}
export const sortFolders = rows => rows.sort((a, b) => b.score - a.score || a.folder.localeCompare(b.folder, 'en'));

export function rankFolders(vector, folders, strategy, query = '') {
  return sortFolders(folders.map(folder => {
    const similarities = folder.examples.map(example => dot(vector, example)).sort((a, b) => b - a);
    const closest = similarities[0];
    let score;
    switch (strategy) {
      case 'closest': score = closest; break;
      case 'folder-closest': score = .3 * dot(vector, folder.vectors.path) + .7 * closest; break;
      case 'manual-closest': score = .3 * dot(vector, folder.vectors.manual) + .7 * closest; break;
      case 'generated-closest': score = .3 * dot(vector, folder.vectors.generated) + .7 * closest; break;
      case 'domain-closest': score = .3 * dot(vector, folder.vectors.domain) + .7 * closest; break;
      case 'top3-average': {
        const best = similarities.slice(0, 3);
        score = best.reduce((sum, value) => sum + value, 0) / best.length;
        break;
      }
      case 'centroid': score = dot(vector, folder.centroid); break;
      case 'hybrid': score = .8 * closest + .2 * keywordScore(query, folder.keywordText); break;
      default: throw new Error('Unknown scoring strategy: ' + strategy);
    }
    return { folder: folder.path, score };
  }));
}

export async function retrieveAndRerank(vector, query, folders, rerank, candidateCount) {
  const retrieved = rankFolders(vector, folders, 'manual-closest').slice(0, candidateCount);
  const ranked = [];
  for (const candidate of retrieved) {
    const folder = folders.find(folder => folder.path === candidate.folder);
    const score = await rerank(query, folder.rerankText);
    if (!Number.isFinite(score)) throw new Error('Invalid reranker score');
    ranked.push({ folder: candidate.folder, score, retrievalScore: candidate.score });
  }
  return sortFolders(ranked);
}

export function prediction(ranked, item, thresholds, strategy) {
  const top = ranked[0], margin = top.score - ranked[1].score;
  return {
    topFolder: top.folder,
    correct: item.expectedFolder === null ? null : top.folder === item.expectedFolder,
    // Cross-encoder scores have a different scale; embedding cutoffs do not apply.
    certainEnough: strategy === 'rerank' ? null : top.score >= thresholds.newFolder && margin >= thresholds.askUserMargin,
    margin, top3: ranked.slice(0, 3), ranked
  };
}

export function summarize(rows) {
  const eligible = rows.filter(row => row.correct !== null);
  return {
    correct: eligible.filter(row => row.correct).length,
    wrong: eligible.filter(row => !row.correct).length,
    accuracy: eligible.length ? eligible.filter(row => row.correct).length / eligible.length : null,
    certainEnough: eligible.length && eligible.every(row => row.certainEnough !== null)
      ? eligible.filter(row => row.certainEnough).length / eligible.length : null,
    meanQueryMs: rows.reduce((sum, row) => sum + row.queryMs, 0) / rows.length
  };
}
