/// <reference lib="webworker" />
import { defineUnlistedScript } from 'wxt/utils/define-unlisted-script';
import { generateFolderDescriptions, prepareComparisonIndex } from '../lib/folder-description';
import { rankFolders } from '../lib/folder-ranking';
import { env, pipeline, type FeatureExtractionPipeline } from '@huggingface/transformers';
import { readIndexMetadata, readIndexEntries, reuseIndexEntries, saveIndex, saveGeneratedDescriptions, readFolderDescriptions, type IndexEntry, type VectorEntry } from '../lib/model-index';
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
        let current = job;
        let descriptionsChanged = false;
        let cachedEntries = await readIndexEntries(current.preset);
        let cachedMetadata = previous;
        while (true) {
          const { reused: vectors, pending } = reuseIndexEntries(current, cachedMetadata, cachedEntries);
          let lastProgress = 0;
          for (let offset = 0; offset < pending.length; offset += 8) {
            const batch = pending.slice(offset, offset + 8);
            const tensor = await extractor(batch.map(entry => entry.text), { pooling: preset.pooling, normalize: true });
            try {
              const embeddings = tensor.tolist() as number[][];
              batch.forEach((entry, index) => vectors.push({ ...entry, vector: new Float32Array(embeddings[index]!) }));
            } finally { tensor.dispose(); }
            if (Date.now() - lastProgress >= 250 || vectors.length === current.entries.length) {
              emit({ kind: 'progress', index: { completed: vectors.length, total: current.entries.length,
                folderCount: current.folderCount, bookmarkCount: current.bookmarkCount } });
              lastProgress = Date.now();
            }
          }
          const changed = await saveGeneratedDescriptions(generateFolderDescriptions(current, vectors));
          descriptionsChanged ||= changed;
          if (changed) {
            const descriptions = new Map((await readFolderDescriptions()).map(folder => [folder.id, folder.description]));
            const paths = new Map(current.folders.map(folder => [folder.id, folder.path]));
            const entries = current.entries.map(entry => {
              if (entry.kind !== 'folder') return entry;
              const description = descriptions.get(entry.id);
              const text = [(paths.get(entry.id) ?? []).join(' / '), description].filter(Boolean).join('\n').slice(0, 4000);
              return { kind: 'folder' as const, id: entry.id, text, ...(description ? { description } : {}) };
            });
            const input = JSON.stringify({ configuration: current.configuration, entries, folders: current.folders });
            const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input));
            const fingerprint = Array.from(new Uint8Array(digest), value => value.toString(16).padStart(2, '0')).join('');
            cachedEntries = vectors;
            cachedMetadata = { preset: current.preset, configuration: current.configuration, fingerprint: current.fingerprint,
              updatedAt: '', completed: vectors.length, total: vectors.length,
              folderCount: current.folderCount, bookmarkCount: current.bookmarkCount };
            current = { ...current, entries, fingerprint };
            continue;
          }
          const index = { preset: current.preset, fingerprint: current.fingerprint, configuration: current.configuration,
            updatedAt: new Date().toISOString(), completed: vectors.length, total: vectors.length,
            folderCount: current.folderCount, bookmarkCount: current.bookmarkCount };
          const byId = new Map(vectors.map(entry => [`${entry.kind}:${entry.id}`, entry]));
          await saveIndex(index, current.entries.map(entry => byId.get(`${entry.kind}:${entry.id}`)!));
          emit({ kind: 'complete', index, descriptionsChanged });
          break;
        }
      } else {
        const [entries, metadata, descriptions] = await Promise.all([
          readIndexEntries(job.preset), readIndexMetadata(job.preset), readFolderDescriptions(),
        ]);
        const model = extractor;
        async function loadVectors(configuration: string, requested: IndexEntry[]): Promise<VectorEntry[]> {
          const { reused: vectors, pending } = reuseIndexEntries({ configuration, entries: requested }, metadata, entries);
          for (let offset = 0; offset < pending.length; offset += 8) {
            const batch = pending.slice(offset, offset + 8);
            const tensor = await model(batch.map(entry => entry.text), { pooling: preset.pooling, normalize: true });
            try {
              const embeddings = tensor.tolist() as number[][];
              batch.forEach((entry, index) => vectors.push({ ...entry, vector: new Float32Array(embeddings[index]!) }));
            } finally { tensor.dispose(); }
          }
          return vectors;
        }
        const { index: comparison, bookmarkVectors } = await prepareComparisonIndex(job.library, job.preset,
          descriptions, job.bookmarkId, index => loadVectors(index.configuration, index.entries.filter(entry => entry.kind === 'bookmark')));
        const folderVectors = await loadVectors(comparison.configuration, comparison.entries.filter(entry => entry.kind === 'folder'));
        const description = job.description && await canUsePageDescription() ? job.description : undefined;
        const text = [job.text, description].filter(Boolean).join('\n').slice(0, 4000);
        const tensor = await extractor(text, { pooling: preset.pooling, normalize: true });
        try {
          const query = (tensor.tolist() as number[][])[0]!;
          const folders = rankFolders(query, job.library, [...bookmarkVectors, ...folderVectors], job.bookmarkId);
          emit({ kind: 'complete', suggestion: { bookmarkId: job.bookmarkId, title: job.title, folders, autoMove: job.autoMove } });
        } finally { tensor.dispose(); }
      }
    } catch {
      // Do not expose bookmark text or URLs through errors/logs.
      emit({ kind: 'error', error: 'Model could not process the bookmark. Check the connection, available memory, and extension console. Try a smaller model or release and retry.' });
    }
  };
});
