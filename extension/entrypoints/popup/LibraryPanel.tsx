import { useEffect, useMemo, useState } from 'react';
import { browser } from 'wxt/browser';
import { GET_LIBRARY_MESSAGE, type BookmarkLibrary, type LibraryBookmark, type LibraryFolder } from '../../lib/bookmark-library';

function Folder({ folder, bookmarks }: { folder: LibraryFolder; bookmarks: LibraryBookmark[] }) {
  const [open, setOpen] = useState(false);
  return <li>
    <details onToggle={event => setOpen(event.currentTarget.open)}>
      <summary>{folder.path.join(' / ')} ({bookmarks.length})</summary>
      {open && <>
        <small>ID {folder.id} · parent {folder.parentId}{!folder.writable && ' · read-only'}</small>
        {bookmarks.length === 0 ? <p>No bookmarks directly in this folder.</p>
          : <ul>{bookmarks.map(bookmark => <li key={bookmark.id}>
            <strong>{bookmark.title || 'Untitled bookmark'}</strong>
            <small>{bookmark.url}</small>
            <small>ID {bookmark.id}</small>
          </li>)}</ul>}
      </>}
    </details>
  </li>;
}

export default function LibraryPanel() {
  const [library, setLibrary] = useState<BookmarkLibrary>();
  const [busy, setBusy] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    let version = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;
    async function refresh() {
      const requestVersion = ++version;
      setBusy(true);
      try {
        const result = await browser.runtime.sendMessage({ type: GET_LIBRARY_MESSAGE });
        if (!active || requestVersion !== version) return;
        if (!result?.ok) throw new Error();
        setLibrary(result.library);
        setError('');
      } catch {
        if (active && requestVersion === version) setError('Could not read the library. Reopen the popup.');
      } finally {
        if (active && requestVersion === version) setBusy(false);
      }
    }
    const onChange = () => {
      // Coalesce import/burst events before requesting the complete snapshot.
      version++;
      clearTimeout(timer);
      timer = setTimeout(() => { void refresh(); }, 75);
    };
    const events = [browser.bookmarks.onCreated, browser.bookmarks.onChanged,
      browser.bookmarks.onMoved, browser.bookmarks.onRemoved,
      browser.bookmarks.onChildrenReordered, browser.bookmarks.onImportEnded];
    for (const event of events) event.addListener(onChange);
    void refresh();
    return () => {
      active = false;
      clearTimeout(timer);
      for (const event of events) event.removeListener(onChange);
    };
  }, []);

  const grouped = useMemo(() => {
    const folders = new Map<string, LibraryBookmark[]>();
    for (const bookmark of library?.bookmarks ?? []) {
      if (!bookmark.parentId) continue;
      const entries = folders.get(bookmark.parentId) ?? [];
      entries.push(bookmark);
      folders.set(bookmark.parentId, entries);
    }
    return folders;
  }, [library]);
  return <section className="library-panel" aria-label="Bookmark library" aria-busy={busy}>
    <details onToggle={event => setExpanded(event.currentTarget.open)}>
      <summary>Bookmark library{library && ` · ${library.folders.length} folders · ${library.bookmarks.length} bookmarks`}</summary>
      {busy && <p role="status">Loading library…</p>}
      {error && <p className="error" role="alert">{error}</p>}
      {expanded && library && <ul>{library.folders.map(folder =>
        <Folder key={folder.id} folder={folder} bookmarks={grouped.get(folder.id) ?? []} />)}</ul>}
    </details>
  </section>;
}
