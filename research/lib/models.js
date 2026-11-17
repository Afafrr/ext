import { pipeline, mean_pooling, AutoTokenizer, AutoModelForSequenceClassification } from '@huggingface/transformers';

export async function loadEmbedder(config, localFilesOnly) {
  const extractor = await pipeline('feature-extraction', config.model, {
    dtype: config.dtype, device: 'cpu', local_files_only: localFilesOnly
  });
  return {
    async embed(text) {
      // Tokenize explicitly: the feature-extraction pipeline ignores max_length.
      const inputs = await extractor.tokenizer(text, { truncation: true, max_length: config.maxLength });
      const output = await extractor.model(inputs);
      const hidden = output.last_hidden_state ?? output.token_embeddings;
      const pooled = config.pooling === 'cls' ? hidden.slice(null, 0) : mean_pooling(hidden, inputs.attention_mask);
      const vector = pooled.normalize(2, -1).tolist()[0];
      if (!vector.length || !vector.every(Number.isFinite)) throw new Error('Invalid embedding');
      return vector;
    },
    dispose: () => extractor.dispose()
  };
}

export async function loadReranker(config, localFilesOnly) {
  const tokenizer = await AutoTokenizer.from_pretrained(config.model, { local_files_only: localFilesOnly });
  const model = await AutoModelForSequenceClassification.from_pretrained(config.model, {
    dtype: config.dtype, device: 'cpu', local_files_only: localFilesOnly
  });
  return {
    async score(query, document) {
      const inputs = await tokenizer(query, {
        text_pair: document, truncation: true, max_length: config.maxLength
      });
      const output = await model(inputs);
      // Supported cross-encoders return one relevance logit per query/document pair.
      if (output.logits.data.length !== 1) throw new Error('Expected a single reranker logit');
      return Number(output.logits.data[0]);
    },
    dispose: () => model.dispose()
  };
}
