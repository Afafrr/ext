import { useEffect, useState } from 'react';
import { browser } from 'wxt/browser';
import { PAGE_DESCRIPTION_PERMISSIONS } from '../../lib/page-description';
import {
  DEFAULT_MODEL_SETTINGS, MODEL_COMMAND, MODEL_PRESETS, MODEL_SETTINGS_KEY, MODEL_STATE_KEY,
  emptyModelState, parseModelSettings, type ModelPreset, type ModelSettings, type ModelState,
} from '../../lib/model-state';

export default function ModelPanel() {
  const [settings, setSettings] = useState<ModelSettings>(DEFAULT_MODEL_SETTINGS);
  const [state, setState] = useState<ModelState>(emptyModelState);
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState('');
  const [pageDescriptions, setPageDescriptions] = useState(false);
  const [permissionsBusy, setPermissionsBusy] = useState(true);

  useEffect(() => {
    let active = true;
    let settingsChanged = false;
    let stateChanged = false;
    const change: Parameters<typeof browser.storage.onChanged.addListener>[0] = (changes, area) => {
      if (area === 'local' && changes[MODEL_SETTINGS_KEY]) {
        settingsChanged = true;
        setSettings(parseModelSettings(changes[MODEL_SETTINGS_KEY].newValue));
      }
      if (area === 'session' && changes[MODEL_STATE_KEY]) {
        stateChanged = true;
        setState((changes[MODEL_STATE_KEY].newValue as ModelState) ?? emptyModelState());
      }
    };
    browser.storage.onChanged.addListener(change);
    async function load() {
      const result = await browser.runtime.sendMessage({ type: MODEL_COMMAND, action: 'get' });
      if (!result?.ok) throw new Error('Could not read model settings.');
      if (!active) return;
      if (!settingsChanged) setSettings(result.settings);
      if (!stateChanged) setState(result.state);
    }
    load().catch(() => { if (active) setError('Reopen the popup to read settings.'); })
      .finally(() => { if (active) setBusy(false); });
    return () => { active = false; browser.storage.onChanged.removeListener(change); };
  }, []);

  useEffect(() => {
    let active = true;
    const refresh = () => {
      return browser.permissions.contains(PAGE_DESCRIPTION_PERMISSIONS)
        .then(enabled => { if (active) setPageDescriptions(enabled); })
        .catch(() => { if (active) setError('Could not read website access.'); })
        .finally(() => { if (active) setPermissionsBusy(false); });
    };
    browser.permissions.onAdded.addListener(refresh);
    browser.permissions.onRemoved.addListener(refresh);
    refresh();
    return () => {
      active = false;
      browser.permissions.onAdded.removeListener(refresh);
      browser.permissions.onRemoved.removeListener(refresh);
    };
  }, []);

  async function togglePageDescriptions(enabled: boolean) {
    setPermissionsBusy(true);
    setError('');
    try {
      if (enabled) await browser.permissions.request(PAGE_DESCRIPTION_PERMISSIONS);
      else await browser.permissions.remove(PAGE_DESCRIPTION_PERMISSIONS);
      setPageDescriptions(await browser.permissions.contains(PAGE_DESCRIPTION_PERMISSIONS));
    } catch {
      setError('Could not update website access. Please try again.');
    } finally { setPermissionsBusy(false); }
  }

  async function save(next: ModelSettings) {
    const previous = settings;
    setSettings(next);
    setBusy(true);
    setError('');
    try {
      const response = await browser.runtime.sendMessage({ type: MODEL_COMMAND, action: 'settings', settings: next });
      if (!response?.ok) throw new Error('Could not change the model.');
      setSettings(response.settings);
    } catch {
      setSettings(previous);
      setError('Could not update settings. Please try again.');
    } finally { setBusy(false); }
  }
  const labels: Record<ModelState['status'], string> = {
    unloaded: 'Model unloaded', loading: 'Loading model…',
    indexing: 'Indexing library…', running: 'Processing bookmark…', ready: 'Model ready', error: 'Model error',
  };
  return <section className="model-panel" aria-label="AI model">
    <label className="model-field">AI model
      <select value={settings.preset} disabled={busy}
        onChange={event => save({ ...settings, preset: event.target.value as ModelPreset })}>
        {Object.entries(MODEL_PRESETS).map(([value, preset]) => <option key={value} value={value}>{preset.label}</option>)}
      </select>
    </label>
    <label className="model-toggle">
      <input type="checkbox" checked={settings.enabled} disabled={busy}
        onChange={event => save({ ...settings, enabled: event.target.checked })} />
      Enable local AI
    </label>
    <p className="model-note">Enabling AI downloads the model and indexes bookmark titles and folder paths. The model unloads after 15 seconds of inactivity.</p>
    <label className="model-toggle">
      <input type="checkbox" checked={pageDescriptions} disabled={permissionsBusy}
        onChange={event => togglePageDescriptions(event.target.checked)} />
      Use page descriptions
    </label>
    <p className="model-note">Uses page descriptions temporarily to suggest folders for new bookmarks. Enabling asks Chrome for website access. Turning this off revokes that access.</p>
    <p role="status" className="model-note">{labels[state.status]}</p>
    {state.index && <div className="model-note" aria-label="Library index">
      {state.status === 'loading' || state.status === 'indexing'
        ? <><p>Indexed {state.index.completed} of {state.index.total}</p>
          <progress aria-label="Indexing progress" value={state.index.completed} max={state.index.total || 1} /></>
        : state.index.completed === state.index.total
          ? <p>Index saved · {state.index.bookmarkCount} titles · {state.index.folderCount} folders</p>
          : <p>Indexing interrupted · {state.index.completed} of {state.index.total}</p>}
    </div>}
    {state.suggestion && <div aria-label="Folder suggestions">
      <p>Suggested folders for {state.suggestion.title}</p>
      {state.suggestion.folders.length
        ? <ol>{state.suggestion.folders.map(folder => <li key={folder.id}>{folder.path.join(' / ')}</li>)}</ol>
        : <p>No indexed writable folders available.</p>}
    </div>}
    {(error || state.error) && <p className="error" role="alert">{error || state.error}</p>}
  </section>;
}
