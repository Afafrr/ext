import assert from 'node:assert/strict';
import test from 'node:test';
import { DEFAULT_MODEL_SETTINGS, parseModelSettings } from '../lib/model-state.ts';

test('model settings reject unknown presets and removes legacy settings', () => {
  for (const value of [null, undefined, 'enabled', { preset: '__proto__', enabled: 'true' }]) {
    assert.deepEqual(parseModelSettings(value), DEFAULT_MODEL_SETTINGS);
  }
  assert.deepEqual(parseModelSettings({ enabled: true, preset: 'bge-q8' }), {
    enabled: true, preset: 'bge-q8',
  });
  assert.deepEqual(parseModelSettings({ preset: 'bge-fp32', enabled: true, idleSeconds: 60 }), { enabled: true, preset: 'minilm-q8' });
});
