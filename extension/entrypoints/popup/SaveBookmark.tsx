import { useEffect, useState } from 'react';
import { browser } from 'wxt/browser';
import { GET_LIBRARY_MESSAGE, type BookmarkLibrary, type LibraryNode } from '../../lib/bookmark-library';
import { MODEL_COMMAND, MODEL_STATE_KEY, emptyModelState, type ModelState } from '../../lib/model-state';
import FolderSuggestions from './FolderSuggestions';
import SettingsButton from './SettingsButton';

export default function SaveBookmark({ initialBookmarkId }: { initialBookmarkId: string }) {
  const bookmarkId = initialBookmarkId;
  const [bookmark, setBookmark] = useState<LibraryNode>();
  const [folderPath, setFolderPath] = useState('');
  const [state, setState] = useState<ModelState>(emptyModelState);
  const [error, setError] = useState('');
  const [removing, setRemoving] = useState(false);
  const [removeError, setRemoveError] = useState('');

  useEffect(() => {
    let active = true;
    let receivedUpdate = false;
    const onChange: Parameters<typeof browser.storage.onChanged.addListener>[0] = (changes, area) => {
      if (area !== 'session') return;
      if (changes[MODEL_STATE_KEY]) {
        receivedUpdate = true;
        setState((changes[MODEL_STATE_KEY].newValue as ModelState) ?? emptyModelState());
      }
    };
    browser.storage.onChanged.addListener(onChange);
    browser.runtime.sendMessage({ type: MODEL_COMMAND, action: 'get' }).then(result => {
      if (!active || receivedUpdate) return;
      if (!result?.ok) throw new Error();
      setState(result.state);
    }).catch(() => { if (active) setError('Could not read folder suggestions. Reopen the extension.'); });
    return () => {
      active = false;
      browser.storage.onChanged.removeListener(onChange);
    };
  }, []);

  useEffect(() => {
    let active = true;
    let version = 0;
    setBookmark(undefined);
    setFolderPath('');
    setError('');
    async function refresh() {
      const requestVersion = ++version;
      try {
        const [[node], result] = await Promise.all([
          browser.bookmarks.get(bookmarkId),
          browser.runtime.sendMessage({ type: GET_LIBRARY_MESSAGE }).catch(() => undefined),
        ]);
        if (!active || requestVersion !== version) return;
        if (node?.url === undefined) throw new Error();
        const library = result?.ok ? result.library as BookmarkLibrary : undefined;
        setBookmark(node);
        setFolderPath(library?.folders.find(folder => folder.id === node.parentId)?.path.join(' / ') ?? 'Folder unavailable');
        setError('');
      } catch {
        if (!active || requestVersion !== version) return;
        setBookmark(undefined);
        setError('Could not read this bookmark. It may have been removed.');
      }
    }
    browser.bookmarks.onMoved.addListener(refresh);
    browser.bookmarks.onChanged.addListener(refresh);
    browser.bookmarks.onRemoved.addListener(refresh);
    refresh();
    return () => {
      active = false;
      browser.bookmarks.onMoved.removeListener(refresh);
      browser.bookmarks.onChanged.removeListener(refresh);
      browser.bookmarks.onRemoved.removeListener(refresh);
    };
  }, [bookmarkId]);

  async function removeBookmark() {
    setRemoving(true);
    setRemoveError('');
    try {
      await browser.bookmarks.remove(bookmarkId);
      window.close();
    } catch {
      setRemoveError('Could not remove this bookmark. Please try again.');
    } finally {
      setRemoving(false);
    }
  }

  const suggestion = state.suggestion?.bookmarkId === bookmarkId ? state.suggestion : undefined;
  return <main className="save-bookmark">
    <header className="brand">
      <img src="/icons/48.png" width="32" height="32" alt="" />
      <h1>Bookmark added</h1>
    </header>
    {bookmark && <>
      <p className="save-bookmark-title">{bookmark.title || bookmark.url}</p>
      <div className="model-field">Folder
        <p className="save-bookmark-folder" role="status">{folderPath || 'Reading folder…'}</p>
      </div>
    </>}
    {!suggestion && !state.error && !error && <p className="model-note" role="status">Finding the best folder…</p>}
    {bookmark && suggestion && !removing && <FolderSuggestions key={bookmarkId} suggestion={suggestion} />}
    {bookmark && removeError && <p className="error" role="alert">{removeError}</p>}
    {(error || state.saveWindowError || state.autoMoveError || state.error) && <p className="error" role="alert">{error || state.saveWindowError || state.autoMoveError || state.error}</p>}
    <div className="save-bookmark-actions">
      {bookmark && <button className="remove-bookmark-button" disabled={removing} onClick={removeBookmark}>
        {removing ? 'Removing…' : 'Remove bookmark'}
      </button>}
      <SettingsButton />
      <button className="save-bookmark-done" autoFocus onClick={() => window.close()}>Done</button>
    </div>
  </main>;
}
