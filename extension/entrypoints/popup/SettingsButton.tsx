import { useState } from 'react';
import { browser } from 'wxt/browser';

export default function SettingsButton() {
  const [opening, setOpening] = useState(false);
  const [error, setError] = useState('');

  async function open() {
    setOpening(true);
    setError('');
    try {
      await browser.runtime.openOptionsPage();
    } catch {
      setError('Could not open settings. Please try again.');
    } finally { setOpening(false); }
  }

  return <div className="settings-link">
    <button className="settings-button" disabled={opening} onClick={open}>
      {opening ? 'Opening…' : 'Settings'}
    </button>
    {error && <p className="error" role="alert">{error}</p>}
  </div>;
}
