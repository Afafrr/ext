import { useEffect, useState } from 'react';
import { browser } from 'wxt/browser';
import {
  DEFAULT_MODEL_SETTINGS, MODEL_COMMAND, MODEL_PRESETS, MODEL_SETTINGS_KEY, MODEL_STATE_KEY,
  emptyModelState, parseModelSettings, type ModelPreset, type ModelSettings, type ModelState,
} from '../../lib/model-state';

export default function ModelPanel() {
  const [settings, setSettings] = useState<ModelSettings>(DEFAULT_MODEL_SETTINGS);
  const [state, setState] = useState<ModelState>(emptyModelState);
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    let version = 0;
    const change: Parameters<typeof browser.storage.onChanged.addListener>[0] = (changes, area) => {
      if (area === 'local' && changes[MODEL_SETTINGS_KEY]) {
        version++;
        setSettings(parseModelSettings(changes[MODEL_SETTINGS_KEY].newValue));
      }
      if (area === 'session' && changes[MODEL_STATE_KEY]) {
        version++;
        setState((changes[MODEL_STATE_KEY].newValue as ModelState) ?? emptyModelState());
      }
    };
    browser.storage.onChanged.addListener(change);
    async function load() {
      for (let attempt = 0; attempt < 3; attempt++) {
        const before = version;
        const result = await browser.runtime.sendMessage({ type: MODEL_COMMAND, action: 'get' });
        if (!result?.ok) throw new Error('Nie udało się odczytać ustawień modelu.');
        if (!active) return;
        if (version !== before) continue;
        setSettings(result.settings);
        setState(result.state);
        return;
      }
    }
    void load().catch(() => { if (active) setError('Otwórz ponownie okienko, aby odczytać ustawienia.'); })
      .finally(() => { if (active) setBusy(false); });
    return () => { active = false; browser.storage.onChanged.removeListener(change); };
  }, []);

  async function save(next: ModelSettings) {
    const previous = settings;
    setSettings(next);
    setBusy(true);
    setError('');
    try {
      const response = await browser.runtime.sendMessage({ type: MODEL_COMMAND, action: 'settings', settings: next });
      if (!response?.ok) throw new Error('Nie udało się zmienić modelu.');
      setSettings(response.settings);
    } catch {
      setSettings(previous);
      setError('Nie udało się zmienić ustawień. Spróbuj ponownie.');
    } finally { setBusy(false); }
  }
  const labels: Record<ModelState['status'], string> = {
    unloaded: 'Model zwolniony z pamięci', loading: 'Ładowanie modelu…',
    running: 'Przetwarzanie zakładki…', ready: 'Model gotowy', error: 'Błąd modelu',
  };
  return <section className="model-panel" aria-label="Model AI">
    <label className="model-field">Model AI
      <select value={settings.preset} disabled={busy}
        onChange={event => void save({ ...settings, preset: event.target.value as ModelPreset })}>
        {Object.entries(MODEL_PRESETS).map(([value, preset]) => <option key={value} value={value}>{preset.label}</option>)}
      </select>
    </label>
    <label className="model-toggle">
      <input type="checkbox" checked={settings.enabled} disabled={busy}
        onChange={event => void save({ ...settings, enabled: event.target.checked })} />
      Uruchamiaj model po dodaniu zakładki
    </label>
    <p className="model-note">Pierwsze użycie pobiera wybrany model. Po 15 sekundach bezczynności model zwalnia pamięć.</p>
    <p role="status" className="model-note">{labels[state.status]}</p>
    {(error || state.error) && <p className="error" role="alert">{error || state.error}</p>}
  </section>;
}
