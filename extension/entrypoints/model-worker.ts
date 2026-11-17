/// <reference lib="webworker" />
import { defineUnlistedScript } from 'wxt/utils/define-unlisted-script';
import { rankFolders } from '../lib/folder-ranking';
import { env, pipeline, type FeatureExtractionPipeline } from '@huggingface/transformers';
import { readIndexMetadata, readIndexEntries, reuseIndexEntries, saveIndex } from '../lib/model-index';
import { MODEL_CACHE, MODEL_PRESETS, type ModelJob, type WorkerEvent } from '../lib/model-state';

export default defineUnlistedScript(() => {
  const scope = self as unknown as DedicatedWorkerGlobalScope;
  let extractor: FeatureExtractionPipeline | undefined;
  const emit = (event: WorkerEvent) => scope.postMessage(event);
  env.allowLocalModels = false;
  env.useBrowserCache = false;
  env.useCustomCache = true;
  env.customCache = {
    async match(request: RequestInfo) {
      return (await caches.open(MODEL_CACHE)).match(request);
    },
    async put(request: RequestInfo, response: Response) {
      await (await caches.open(MODEL_CACHE)).put(request, response);
    },
  };
  const wasm = env.backends.onnx.wasm!;
  wasm.wasmPaths = new URL('/vendor/', scope.location.href).href;
  wasm.numThreads = 1;
  wasm.proxy = false;

  function canUsePageDescription(): Promise<boolean> {
    return new Promise(resolve => {
      const receive = ({ data }: MessageEvent) => {
        if (data.kind !== 'page-description-permission') return;
        scope.removeEventListener('message', receive);
        resolve(data.allowed === true);
      };
      scope.addEventListener('message', receive);
      emit({ kind: 'page-description-permission' });
    });
  }

  scope.onmessage = async ({ data: job }: MessageEvent<ModelJob | { kind: 'page-description-permission' }>) => {
    if (job.kind === 'page-description-permission') return;
    try {
      const preset = MODEL_PRESETS[job.preset];
      if (!extractor) {
        // Without a progress callback, Transformers.js reads through arrayBuffer().
        // This handles cached/CDN responses that omit Content-Length.
        extractor = await pipeline<'feature-extraction'>('feature-extraction', preset.id, {
          revision: preset.revision, dtype: preset.dtype, device: 'wasm',
        });
        // Bound per-save work even for BGE-M3's 8192-token context.
        extractor.tokenizer.model_max_length = 128;
      }
      emit({ kind: 'loaded' });
      if (job.kind === 'index') {
        const previous = await readIndexMetadata(job.preset);
        if (previous?.fingerprint === job.fingerprint) {
          emit({ kind: 'complete', index: previous });
          return;
        }
        const { reused: vectors, pending } = reuseIndexEntries(job, previous, await readIndexEntries(job.preset));
        let lastProgress = 0;
        for (let offset = 0; offset < pending.length; offset += 8) {
          const batch = pending.slice(offset, offset + 8);
          const tensor = await extractor(batch.map(entry => entry.text), { pooling: preset.pooling, normalize: true });
          try {
            const embeddings = tensor.tolist() as number[][];
            batch.forEach((entry, index) => vectors.push({ ...entry, vector: new Float32Array(embeddings[index]!) }));
          } finally { tensor.dispose(); }
          if (Date.now() - lastProgress >= 250 || vectors.length === job.entries.length) {
            emit({ kind: 'progress', index: { completed: vectors.length, total: job.entries.length,
              folderCount: job.folderCount, bookmarkCount: job.bookmarkCount } });
            lastProgress = Date.now();
          }
        }
        const index = { configuration: job.configuration, preset: job.preset, fingerprint: job.fingerprint, updatedAt: new Date().toISOString(),
          completed: vectors.length, total: vectors.length,
          folderCount: job.folderCount, bookmarkCount: job.bookmarkCount };
        const byId = new Map(vectors.map(entry => [`${entry.kind}:${entry.id}`, entry]));
        await saveIndex(index, job.entries.map(entry => byId.get(`${entry.kind}:${entry.id}`)!));
        emit({ kind: 'complete', index });
      } else {
        const description = job.description && await canUsePageDescription() ? job.description : undefined;
        const text = [job.text, description].filter(Boolean).join('\n').slice(0, 4000);
        const tensor = await extractor(text, { pooling: preset.pooling, normalize: true });
        try {
          const query = (tensor.tolist() as number[][])[0]!;
          const folders = rankFolders(query, job.library, await readIndexEntries(job.preset), job.bookmarkId);
          emit({ kind: 'complete', suggestion: { bookmarkId: job.bookmarkId, title: job.title, folders } });
        } finally { tensor.dispose(); }
      }
    } catch {
      // Do not expose bookmark text or URLs through errors/logs.
      emit({ kind: 'error', error: 'Model could not process the bookmark. Check the connection, available memory, and extension console. Try a smaller model or release and retry.' });
    }
  };
});
