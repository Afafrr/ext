# Bookmark Organizer

A Chrome extension built with **WXT, React, TypeScript, and Manifest V3**.
This first milestone detects new bookmarks and displays recent saves in the
extension's toolbar popup. It observes bookmarks without changing them.

## What works

- Detects new bookmark creation through `chrome.bookmarks.onCreated`.
- Works with Chrome's star, Ctrl/Cmd + D, the bookmark manager, and other sources
  that create bookmark nodes.
- Updates the toolbar badge and a live list of the 20 most recent detections.
- Displays the title, URL, nested folder path, and detection time.
- Reflects edits, manual moves, folder renames, and deletions for tracked saves.
- Skips folder creation and bookmark creation during Chrome's reported imports.
- Keeps activity and import state through service worker suspension, using
  session storage. Activity clears when the browser session ends or the extension
  is reloaded, updated, or disabled.
- Lets you clear the activity list without deleting or moving your bookmarks.

AI classification, automatic moves, Change folder, Undo, and the expanding
in-page confirmation card belong to later milestones. There is no model
download or inference in this version.

## Local development

Use Node.js **22.18 or newer** and npm.

```bash
npm install
npm run dev
```

WXT opens a development browser with the extension installed. By default, its
development profile is separate from your everyday Chrome profile, so existing
bookmarks may differ. Pin the extension through Chrome's extensions menu.

To build and validate:

```bash
npm test
npm run typecheck
npm run build
```

The production extension is generated in `.output/chrome-mv3/`.
`npm run zip` also produces a distribution archive under `.output/`.

## Install in your own Chrome profile

1. Run `npm install` and `npm run build`.
2. Open `chrome://extensions` and enable **Developer mode**.
3. Click **Load unpacked**.
4. Select this project's **`.output/chrome-mv3`** directory, not the project root.
5. Pin **Bookmark Organizer** using Chrome's extensions menu.
6. Open a page that is not already bookmarked and click Chrome's normal star.
7. Dismiss Chrome's native bookmark dialog and open the extension's toolbar icon.
   The new bookmark should appear in **Recent saves**, with a badge count.

After source changes, rebuild and click **Reload** on the extension's card in
`chrome://extensions`. Reloading clears this extension's temporary activity.

Chrome 102+ is required for `chrome.storage.session`.

## Architecture

```text
Chrome bookmark events
        |
        v
entrypoints/background.ts       MV3 service worker; synchronous event registration
        |
        v
lib/bookmark-detector.ts        Ordered event processing, import suppression,
        |                      bounded detections, folder-path resolution
        v
chrome.storage.session         Temporary state on this device
        |
        +--> Toolbar badge
        |
        v
entrypoints/popup/App.tsx       React popup, live storage updates, clear activity
```

The detector serializes asynchronous reads and writes so rapid saves and import
events cannot overwrite each other's state. It re-reads a created bookmark in
case the user deleted or edited it while processing was pending. Only recorded
bookmarks and their ancestors are refreshed when changes occur; existing
bookmarks are never scanned on startup. Folder traversal supports nested folders
and includes a cycle guard.

The detector receives a narrow API with no bookmark mutation methods. Runtime
dependencies are React/React DOM; WXT and its React module provide the build tools.
Tests use Node's built-in runner without an additional test framework.

## Permissions and privacy

| Permission | Purpose |
| --- | --- |
| `bookmarks` | Receive creation/import/change events and read affected nodes and their ancestors. Chrome grants bookmark write access with this permission too, but this version never invokes it. |
| `storage` | Keep the latest 20 detections and import status in `chrome.storage.session`, surviving service worker suspension. |

No website access, browsing history, tabs, notifications, or content-script
permissions are requested. Titles and URLs are never sent over the network,
logged, or placed in synchronized extension storage. No analytics or remote
fonts/favicons are loaded. The popup renders bookmark text as text, without
executing bookmark URLs. Clearing activity only clears this extension's records.

Production detection works offline immediately. The development server uses a
local connection for WXT's development tooling. No AI model is included yet;
future local inference and model caching are not implemented by this milestone.

## Browser limitations

- **Creation is observable; the native star click is not.** There is no supported
  extension API identifying the star as the source. Clicking the star for an
  already-saved page opens Chrome's editor and does not create a new bookmark.
- `onCreated` does not include a reliable source or originating tab ID. Saves
  from sync, other extensions, and browser features may also appear. This version
  labels them as detections and performs no automatic organization.
- Imports are skipped between `onImportBegan` and `onImportEnded`. That also skips
  unrelated saves during the same import. Creation bursts from sources that do
  not emit import events cannot be reliably recognized as imports.
- Chrome does not expose the native bookmark editor's open/closed state to this
  extension. The popup is opened by the user; detection does not interrupt or
  attempt to control Chrome's native dialog.
- No events before installation or while the extension was disabled are replayed.
- The badge counts retained detections (up to 20), not unread notifications.
- Session storage is temporary. Your actual Chrome bookmarks follow Chrome's
  existing storage/sync settings; the extension does not change those settings.

## Tests and manual checks

Automated tests cover detection, rapid saves, duplicate events, folder exclusion,
import ordering and worker recreation, deletion before processing, retention,
manual edits/moves, ancestor changes/removal, clear activity, recovery after
storage errors, and deep/cyclic folder structures. These use a fake browser data
source and do not substitute for checking native Chrome behavior.

Manual Chrome checklist:

1. Star an unbookmarked page: its title, URL, and folder appear in the popup.
2. Use Ctrl/Cmd + D on another new page: a second detection appears.
3. Click the star on an already-saved page: no duplicate detection is added.
4. Edit the title/folder in Chrome's dialog: the tracked card reflects the change.
5. Create a bookmark folder: no saved-page card appears.
6. Delete a tracked bookmark or its containing folder: its card is removed.
7. Save multiple pages quickly: all appear, newest first, with at most 20 retained.
8. Import an HTML bookmark file: imported entries do not appear in recent saves.
9. Leave the worker idle, then save another page: it should wake and record the save.
10. Click **Clear activity**: list and badge clear; all actual bookmarks remain.
11. Fully quit/reopen Chrome: temporary activity clears; new saves are detected.
12. Disconnect the network: creating and detecting bookmarks still works.

API references: [Chrome Bookmarks](https://developer.chrome.com/docs/extensions/reference/api/bookmarks),
[Chrome storage](https://developer.chrome.com/docs/extensions/reference/api/storage),
[MV3 worker lifecycle](https://developer.chrome.com/docs/extensions/develop/concepts/service-workers/lifecycle),
[WXT](https://wxt.dev/).

The simple toolbar PNG icons can be regenerated with `npm run icons` (Node only).
