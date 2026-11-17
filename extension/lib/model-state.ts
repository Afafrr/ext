import type { BookmarkLibrary } from './bookmark-library.ts';
import type { FolderSuggestion } from './folder-ranking.ts';
import type { IndexJob, IndexMetadata, IndexProgress } from './model-index.ts';

export const MODEL_SETTINGS_KEY = 'modelTestSettings';
export const MODEL_STATE_KEY = 'modelTestState';
export const MODEL_CACHE = 'bookmark-model-test-v1';
export const MODEL_COMMAND = 'bookmark-model-test:command';
export const MODEL_EVENT = 'bookmark-model-test:event';
export const MODEL_TARGET = 'bookmark-model-test:offscreen';

export const MODEL_PRESETS = {
  'minilm-q8': {
    id: 'Xenova/paraphrase-multilingual-MiniLM-L12-v2',
    revision: '2c4055b12046f11709e9df2c122e59ffbdc2f900',
    dtype: 'q8', pooling: 'mean', label: 'MiniLM · q8 · 118 MB weights',
  },
  'bge-q8': {
    id: 'Xenova/bge-m3', revision: 'main', dtype: 'q8', pooling: 'cls',
    label: 'BGE-M3 · q8 · 570 MB weights',
  },
} as const;
export type ModelPreset = keyof typeof MODEL_PRESETS;
export interface ModelSettings {
  enabled: boolean;
  preset: ModelPreset;
  autoMove: boolean;
}
export const DEFAULT_MODEL_SETTINGS: ModelSettings = {
  enabled: false, preset: 'minilm-q8', autoMove: true,
};
export function parseModelSettings(value: unknown): ModelSettings {
  const input = (value && typeof value === 'object' ? value : {}) as Partial<ModelSettings>;
  return {
    enabled: input.enabled === true,
    autoMove: input.autoMove !== false,
    preset: input.preset && Object.hasOwn(MODEL_PRESETS, input.preset) ? input.preset : 'minilm-q8',
  };
}
export interface BookmarkSuggestion {
  bookmarkId: string;
  title: string;
  folders: FolderSuggestion[];
  autoMove?: { parentId: string; url: string };
}
export interface ModelState {
  status: 'unloaded' | 'loading' | 'indexing' | 'running' | 'ready' | 'error';
  preset?: ModelPreset;
  pending: number;
  error?: string;
  index?: IndexProgress;
  suggestion?: BookmarkSuggestion;
  handledSuggestionId?: string;
  autoMoveError?: string;
  saveWindowError?: string;
  pendingAutoMoves?: { bookmarkId: string; url: string; sourceId: string; folderId: string }[];
}
export const emptyModelState = (): ModelState => ({ status: 'unloaded', pending: 0 });
export const MODEL_IDLE_MS = 15_000;
export type ModelJob = IndexJob | { kind: 'embed'; text: string; description?: string; preset: ModelPreset; bookmarkId: string; title: string; library: BookmarkLibrary; autoMove?: BookmarkSuggestion['autoMove'] };
export type WorkerEvent =
  | { kind: 'page-description-permission' }
  | { kind: 'loaded' }
  | { kind: 'progress'; index: IndexProgress }
  | { kind: 'complete'; index?: IndexMetadata; suggestion?: BookmarkSuggestion; descriptionsChanged?: boolean }
  | { kind: 'error'; error: string };
