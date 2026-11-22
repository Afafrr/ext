import { useEffect, useRef, useState, type KeyboardEvent, type RefObject } from 'react';
import { browser } from 'wxt/browser';
import type { LibraryNode } from '../../lib/bookmark-library';
import { MODEL_COMMAND, type BookmarkSuggestion } from '../../lib/model-state';

type Breadcrumb = { id?: string; title: string };

export default function FolderSuggestions({ suggestion, defaultFocus }: {
  suggestion: BookmarkSuggestion;
  defaultFocus?: RefObject<HTMLButtonElement | null>;
}) {
  const [parentId, setParentId] = useState<string>();
  const [loading, setLoading] = useState(true);
  const [available, setAvailable] = useState(true);
  const [movingRow, setMovingRow] = useState<string>();
  const [paths, setPaths] = useState<Map<string, Breadcrumb[]>>(new Map());
  const [selectedFolders, setSelectedFolders] = useState<Map<string, string>>(new Map());
  const rowButtons = useRef<Array<HTMLButtonElement | null>>([]);
  const folderIds = JSON.stringify(suggestion.folders.map(folder => folder.id));
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

  useEffect(() => {
    const ids: string[] = JSON.parse(folderIds);
    let active = true;
    let version = 0;
    let tracked = new Set(ids);

    async function refresh() {
      const revision = ++version;
      const nodes = new Map<string, Promise<LibraryNode | undefined>>();
      async function readPath(folderId: string): Promise<[string, Breadcrumb[] | undefined]> {
        const ancestors: LibraryNode[] = [];
        let id: string | undefined = folderId;
        while (id !== undefined) {
          const currentId: string = id;
          tracked.add(currentId);
          let lookup = nodes.get(currentId);
          if (!lookup) {
            lookup = browser.bookmarks.get(currentId).then(([node]) => node, () => undefined);
            nodes.set(currentId, lookup);
          }
          const node: LibraryNode | undefined = await lookup;
          if (!node || node.url !== undefined) return [folderId, undefined];
          if (node.parentId === undefined) break;
          ancestors.push(node);
          id = node.parentId;
        }
        let writable = true;
        return [folderId, ancestors.reverse().map(node => {
          writable &&= !node.unmodifiable;
          return { id: writable ? node.id : undefined, title: node.title || 'Untitled folder' };
        })];
      }

      const resolved = await Promise.all(ids.map(readPath));
      if (!active || revision !== version) return;
      const next = new Map<string, Breadcrumb[]>();
      for (const [id, path] of resolved) if (path?.length) next.set(id, path);
      tracked = new Set(nodes.keys());
      setPaths(next);
    }

    const onFolderChanged = (id: string) => { if (tracked.has(id)) void refresh(); };
    browser.bookmarks.onChanged.addListener(onFolderChanged);
    browser.bookmarks.onMoved.addListener(onFolderChanged);
    browser.bookmarks.onRemoved.addListener(onFolderChanged);
    void refresh();
    return () => {
      active = false;
      browser.bookmarks.onChanged.removeListener(onFolderChanged);
      browser.bookmarks.onMoved.removeListener(onFolderChanged);
      browser.bookmarks.onRemoved.removeListener(onFolderChanged);
    };
  }, [folderIds]);

  const unavailable = loading || !available;
  const busy = movingRow !== undefined;

  useEffect(() => {
    if (unavailable || busy) return;
    function enterSuggestions(event: globalThis.KeyboardEvent) {
      if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
      if (event.target !== defaultFocus?.current && event.target !== document.body) return;
      if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
      const enabled = rowButtons.current.filter(button => button?.isConnected && !button.disabled);
      const target = event.key === 'ArrowDown' ? enabled[0] : enabled.at(-1);
      if (!target) return;
      event.preventDefault();
      target.focus();
    }
    document.addEventListener('keydown', enterSuggestions);
    return () => document.removeEventListener('keydown', enterSuggestions);
  }, [defaultFocus, unavailable, busy]);

  function selectFolder(rowId: string, folderId: string) {
    setSelectedFolders(current => new Map(current).set(rowId, folderId));
  }

  function navigate(event: KeyboardEvent<HTMLLIElement>, row: number, rowId: string, path: Breadcrumb[], selected: number) {
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) event.preventDefault();
    if (unavailable || busy) return;
    switch (event.key) {
      case 'ArrowUp':
        rowButtons.current.slice(0, row).findLast(button => button?.isConnected && !button.disabled)?.focus();
        break;
      case 'ArrowDown':
        rowButtons.current.slice(row + 1).find(button => button?.isConnected && !button.disabled)?.focus();
        break;
      case 'ArrowLeft': {
        const previous = path.slice(0, selected).findLast(crumb => crumb.id !== undefined);
        if (previous?.id !== undefined) selectFolder(rowId, previous.id);
        break;
      }
      case 'ArrowRight': {
        const next = path.slice(selected + 1).find(crumb => crumb.id !== undefined);
        if (next?.id !== undefined) selectFolder(rowId, next.id);
        break;
      }
    }
  }

  async function move(rowId: string, folderId: string) {
    if (unavailable || busy) return;
    setMovingRow(rowId);
    setError('');
    setNotice('');
    try {
      const response = await browser.runtime.sendMessage({ type: MODEL_COMMAND, action: 'moveBookmark',
        id: suggestion.bookmarkId, parentId: folderId });
      if (!response?.ok) throw new Error();
      setNotice(folderId === parentId ? 'Bookmark saved here.' : 'Bookmark moved.');
    } catch {
      setError('Could not move the bookmark. Check that the bookmark and folder still exist and can be changed.');
    } finally {
      setMovingRow(undefined);
    }
  }

  return <div className="folder-suggestions" role="group" aria-label="Folder suggestions" aria-busy={busy}>
    <p>Suggested folders for {suggestion.title}</p>
    {suggestion.folders.length
      ? <>
        <div className="folder-suggestion-hint" role="group" aria-label="Keyboard shortcuts">
          <span><kbd>↑</kbd><kbd>↓</kbd> Suggestions</span>
          <span><kbd>←</kbd><kbd>→</kbd> Folder path</span>
          <span><kbd>Enter</kbd> Save</span>
        </div>
        <ol>{suggestion.folders.map((folder, row) => {
          // A stored suggestion can still be displayed while its live folder path loads.
          const names = folder.path.length ? folder.path : ['Untitled folder'];
          const path = paths.get(folder.id) ?? names.map((title, index) => ({
            title, id: index === names.length - 1 ? folder.id : undefined,
          }));
          const selectedFolder = selectedFolders.get(folder.id);
          const target = path.find(crumb => crumb.id !== undefined && crumb.id === selectedFolder)
            ?? path.findLast(crumb => crumb.id !== undefined) ?? path.at(-1)!;
          const selected = path.indexOf(target);
          const destination = path.slice(0, selected + 1).map(crumb => crumb.title).join(' / ');
          const currentFolder = target.id !== undefined && target.id === parentId;
          return <li key={folder.id} className="folder-suggestion" data-folder-id={folder.id}
            onKeyDown={event => navigate(event, row, folder.id, path, selected)}>
            <button type="button" className="folder-suggestion-save" aria-label={`Save to ${destination}`}
              ref={button => { rowButtons.current[row] = button; }}
              disabled={unavailable || target.id === undefined} aria-disabled={busy || undefined}
              onClick={() => { if (target.id !== undefined) void move(folder.id, target.id); }}>
              <strong>{target.title}</strong>
              {movingRow === folder.id ? <small>Saving…</small> : currentFolder && <small>Current folder</small>}
              <span aria-hidden="true" className="folder-suggestion-arrow">›</span>
            </button>
            <div className="folder-breadcrumbs" role="group" aria-label="Folder path">
              {path.map(({ id, title }, index) => <span className="folder-breadcrumb" key={id ?? index}>
                {index > 0 && <span className="folder-breadcrumb-separator" aria-hidden="true">/</span>}
                {id === undefined ? <span>{title}</span> : <button type="button"
                  aria-label={`Select ${path.slice(0, index + 1).map(crumb => crumb.title).join(' / ')}`}
                  aria-pressed={index === selected} tabIndex={-1} disabled={unavailable || busy}
                  onClick={() => {
                    selectFolder(folder.id, id);
                    rowButtons.current[row]?.focus();
                  }}>{title}</button>}
              </span>)}
            </div>
          </li>;
        })}</ol>
      </>
      : <p>No indexed writable folders available.</p>}
    {!available && <p role="alert">This bookmark is unavailable. Reopen the popup to try again.</p>}
    {notice && <p role="status">{notice}</p>}
    {error && <p className="error" role="alert">{error}</p>}
  </div>;
}
