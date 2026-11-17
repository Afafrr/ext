export const STRATEGIES = {
  closest: 'Closest bookmark only',
  'folder-closest': 'Folder + closest bookmark',
  'manual-closest': 'Manual descriptions + closest',
  'generated-closest': 'Generated descriptions + closest',
  'top3-average': 'Top-3 bookmark average',
  centroid: 'Folder centroid',
  'domain-closest': 'Domain-enriched descriptions + closest',
  hybrid: 'Keyword + embedding',
  rerank: 'Retrieve, then rerank'
};

export function validateConfig(config) {
  const assert = (condition, message) => { if (!condition) throw new Error('Configuration: ' + message); };
  assert(['real', 'synthetic', 'real-derived', 'hard', 'combined'].includes(config.dataset), 'dataset must be real, synthetic, real-derived, hard or combined');
  assert(config.model?.model && config.model.dtype === 'q8'
    && ['mean', 'cls'].includes(config.model.pooling)
    && Number.isInteger(config.model.maxLength) && config.model.maxLength > 0, 'invalid embedding model');
  assert(Array.isArray(config.strategies) && config.strategies.length
    && config.strategies.every(id => Object.hasOwn(STRATEGIES, id))
    && new Set(config.strategies).size === config.strategies.length, 'invalid or duplicate strategies');
  assert(Array.isArray(config.fields) && config.fields.length
    && config.fields.every(field => ['title', 'description', 'headings', 'url'].includes(field)), 'invalid query fields');
  assert(typeof config.descriptions === 'string', 'descriptions file required');
  if (config.strategies.includes('rerank')) {
    assert(config.reranker?.model && config.reranker.dtype === 'q8'
      && Number.isInteger(config.reranker.candidates) && config.reranker.candidates >= 2
      && Number.isInteger(config.reranker.maxLength) && config.reranker.maxLength > 0, 'invalid reranker');
  }
  assert(Number.isFinite(config.thresholds?.newFolder) && config.thresholds.newFolder >= -1
    && config.thresholds.newFolder <= 1 && Number.isFinite(config.thresholds.askUserMargin)
    && config.thresholds.askUserMargin >= 0, 'invalid certainty thresholds');
  assert(typeof config.cacheDir === 'string' && typeof config.localFilesOnly === 'boolean'
    && typeof config.report === 'boolean', 'cacheDir, localFilesOnly and report required');
  return config;
}
