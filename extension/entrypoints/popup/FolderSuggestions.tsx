import { useEffect, useState } from 'react';
import { browser } from 'wxt/browser';
import { MODEL_COMMAND, type BookmarkSuggestion } from '../../lib/model-state';

export default function FolderSuggestions({ suggestion }: { suggestion: BookmarkSuggestion }) {
  const [parentId, setParentId] = useState<string>();
  const [loading, setLoading] = useState(true);
  const [available, setAvailable] = useState(true);
  const [movingTo, setMovingTo] = useState<string>();
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    let version = 0;
    async function refresh() {
      const requestVersion = ++version;
      try {
        const [bookmark] = await browser.bookmarks.get(suggestion.bookmarkId);
        if (!active || requestVersion !== version) return;
        setAvailable(bookmark?.url !== undefined);
        setParentId(bookmark?.parentId);
      } catch {
        if (active && requestVersion === version) setAvailable(false);
      } finally {
        if (active && requestVersion === version) setLoading(false);
      }
    }
    const onMoved: Parameters<typeof browser.bookmarks.onMoved.addListener>[0] = (id, info) => {
      if (id !== suggestion.bookmarkId) return;
      version++;
      setAvailable(true);
      setParentId(info.parentId);
      setLoading(false);
    };
    // Removing an ancestor can remove the bookmark without an event for its ID.
    browser.bookmarks.onRemoved.addListener(refresh);
    browser.bookmarks.onMoved.addListener(onMoved);
    refresh();
    return () => {
      active = false;
      browser.bookmarks.onRemoved.removeListener(refresh);
      browser.bookmarks.onMoved.removeListener(onMoved);
    };
  }, [suggestion.bookmarkId]);

  async function move(folderId: string) {
    setMovingTo(folderId);
    setError('');
    setNotice('');
    try {
      const response = await browser.runtime.sendMessage({ type: MODEL_COMMAND, action: 'moveBookmark',
        id: suggestion.bookmarkId, parentId: folderId });
      if (!response?.ok) throw new Error();
      setNotice('Bookmark moved.');
    } catch {
      setError('Could not move the bookmark. Check that the bookmark and folder still exist and can be changed.');
    } finally {
      setMovingTo(undefined);
    }
  }

  return <div className="folder-suggestions" aria-label="Folder suggestions" aria-busy={Boolean(movingTo)}>
    <p>Suggested folders for {suggestion.title}</p>
    {suggestion.folders.length
      ? <ol>{suggestion.folders.map(folder => <li key={folder.id}>
        <span>{folder.path.join(' / ')}</span>
        {folder.id === parentId
          ? <small>Current folder</small>
          : <button disabled={loading || !available || Boolean(movingTo)} onClick={() => move(folder.id)}>
            {movingTo === folder.id ? 'Moving…' : 'Move here'}
          </button>}
      </li>)}</ol>
      : <p>No indexed writable folders available.</p>}
    {!available && <p role="alert">This bookmark is unavailable. Reopen the popup to try again.</p>}
    {notice && <p role="status">{notice}</p>}
    {error && <p className="error" role="alert">{error}</p>}
  </div>;
}
