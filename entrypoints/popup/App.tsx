import { useEffect, useState } from 'react';
import { browser } from 'wxt/browser';
import {
  CLEAR_ACTIVITY_MESSAGE,
  STORAGE_KEY,
  emptyState,
  type DetectionState,
} from '../../lib/detection-state';

function displayUrl(value: string) {
  try {
    const url = new URL(value);
    return `${url.hostname}${url.pathname === '/' ? '' : url.pathname}` || value;
  } catch {
    return value;
  }
}

const timeFormat = new Intl.DateTimeFormat(undefined, {
  hour: '2-digit',
  minute: '2-digit',
});

export default function App() {
  const [state, setState] = useState<DetectionState>(emptyState);
  const [loading, setLoading] = useState(true);
  const [clearing, setClearing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    let receivedUpdate = false;

    const handleChange: Parameters<typeof browser.storage.onChanged.addListener>[0] = (
      changes,
      area,
    ) => {
      if (area === 'session' && changes[STORAGE_KEY]) {
        receivedUpdate = true;
        setState((changes[STORAGE_KEY].newValue as DetectionState | undefined) ?? emptyState());
        setLoading(false);
        setError('');
      }
    };

    // Subscribe before reading so a newly detected save cannot be missed.
    browser.storage.onChanged.addListener(handleChange);
    void browser.storage.session.get(STORAGE_KEY).then(
      (stored) => {
        if (!active || receivedUpdate) return;
        setState((stored[STORAGE_KEY] as DetectionState | undefined) ?? emptyState());
        setLoading(false);
      },
      () => {
        if (!active || receivedUpdate) return;
        setError('Could not load recent activity. Close this popup and try again.');
        setLoading(false);
      },
    );

    return () => {
      active = false;
      browser.storage.onChanged.removeListener(handleChange);
    };
  }, []);

  async function clearActivity() {
    setClearing(true);
    setError('');
    try {
      const result = await browser.runtime.sendMessage({ type: CLEAR_ACTIVITY_MESSAGE });
      if (!result?.ok) throw new Error('Clear failed');
    } catch {
      setError('Could not clear activity. Please try again.');
    } finally {
      setClearing(false);
    }
  }

  return (
    <main>
      <header className="header">
        <div className="brand">
          <img src="/icons/48.png" width="36" height="36" alt="" />
          <div>
            <h1>Bookmark Organizer</h1>
            <p className="subtitle">A little order, every time you save.</p>
          </div>
        </div>
        <span className="milestone">DETECTION PREVIEW</span>
      </header>

      <section className="status" aria-label="Detection status">
        <span className={`status-dot${state.importInProgress ? ' paused' : ''}`} />
        <div>
          <h2>{state.importInProgress ? 'Import in progress' : 'Ready for your next bookmark'}</h2>
          <p>
            {state.importInProgress
              ? 'Imported bookmarks are skipped. Detection resumes when the import finishes.'
              : 'Save a new page with Chrome’s star or Ctrl/Cmd + D.'}
          </p>
        </div>
      </section>

      <div className="section-heading">
        <h2>Recent saves <span className="count">{state.recent.length}</span></h2>
        <button
          className="clear-button"
          disabled={loading || clearing || state.recent.length === 0}
          onClick={() => void clearActivity()}
          title="Clear the activity list. Your bookmarks stay saved."
        >
          {clearing ? 'Clearing…' : 'Clear activity'}
        </button>
      </div>

      {error && <p className="error" role="alert">{error}</p>}

      {loading ? (
        <p className="empty-text" role="status">Loading recent saves…</p>
      ) : state.recent.length === 0 ? (
        <section className="empty-state">
          <span className="empty-star" aria-hidden="true">☆</span>
          <h3>Your next save will appear here</h3>
          <p>Bookmark a page you haven’t saved yet, then open this popup again.</p>
          <p className="empty-note">The toolbar badge also updates when a save is detected.</p>
        </section>
      ) : (
        <ol className="bookmark-list" aria-label="Recently detected bookmarks">
          {state.recent.map((bookmark) => (
            <li className="bookmark-card" key={bookmark.id}>
              <div className="card-heading">
                <span className="detected-label">✓ Bookmark detected</span>
                <time dateTime={new Date(bookmark.detectedAt).toISOString()}>
                  {timeFormat.format(bookmark.detectedAt)}
                </time>
              </div>
              <h3>{bookmark.title || 'Untitled bookmark'}</h3>
              <p className="bookmark-url" title={bookmark.url}>{displayUrl(bookmark.url)}</p>
              <p className="folder-path">
                <span aria-hidden="true">↳</span>
                {bookmark.folderPath.join(' / ') || 'Folder unavailable'}
              </p>
            </li>
          ))}
        </ol>
      )}

      <footer>
        <p>Activity stays on this device and clears when Chrome restarts.</p>
        <p>Detection only · Your bookmarks are never moved.</p>
      </footer>
    </main>
  );
}
