import { useEffect, useState } from 'react';
import { browser } from 'wxt/browser';
import { GET_LIBRARY_MESSAGE, type BookmarkLibrary, type LibraryNode } from '../../lib/bookmark-library';
import { MODEL_COMMAND, MODEL_STATE_KEY, emptyModelState, type ModelState } from '../../lib/model-state';
import FolderSuggestions from './FolderSuggestions';

export default function SaveBookmark({ initialBookmarkId }: { initialBookmarkId: string }) {
  const bookmarkId = initialBookmarkId;
  const [bookmark, setBookmark] = useState<LibraryNode>();
  const [folderPath, setFolderPath] = useState('');
  const [state, setState] = useState<ModelState>(emptyModelState);
  const [error, setError] = useState('');

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
          browser.runtime.sendMessage({ type: GET_LIBRARY_MESSAGE }),
        ]);
        if (!active || requestVersion !== version) return;
        if (node?.url === undefined || !result?.ok) throw new Error();
        const library = result.library as BookmarkLibrary;
        setBookmark(node);
        setFolderPath(library.folders.find(folder => folder.id === node.parentId)?.path.join(' / ') ?? 'Folder unavailable');
        setError('');
      } catch {
        if (active && requestVersion === version) setError('Could not read this bookmark. It may have been removed.');
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
    {suggestion && <FolderSuggestions key={bookmarkId} suggestion={suggestion} />}
    {(error || state.saveWindowError || state.autoMoveError || state.error) && <p className="error" role="alert">{error || state.saveWindowError || state.autoMoveError || state.error}</p>}
    <div className="save-bookmark-actions">
      <button autoFocus onClick={() => window.close()}>Done</button>
    </div>
  </main>;
}
