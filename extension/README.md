# Bookmark Organizer

A Chrome MV3 extension built with WXT, React, and TypeScript. It detects new bookmarks and indexes the library with a local MiniLM Q8 or BGE-M3 Q8 model.

## Getting started

```sh
npm ci
npm run build
npm test
npm run typecheck
```

Open `chrome://extensions` in Chrome, enable developer mode, and load `.output/chrome-mv3`.

## Bookmark library

The extension reads the complete tree through `bookmarks.getTree()` when the background starts. The `bookmark-organizer:get-library` message provides folders and bookmarks with IDs, parent IDs, ordering, and full paths. Empty folders and inherited restrictions on managed folders are included. The in-memory cache is invalidated after creation, editing, moving, deletion, reordering, or import events. The next read fetches the current tree. An open popup automatically updates the Bookmark library section.

## Usage

New bookmarks appear in the popup with their title, URL, and folder path. The list contains up to 20 entries from the current session. Bookmark changes update the list, and reported imports are skipped.

Choose MiniLM Q8 (approximately 118 MB of weights) or BGE-M3 Q8 (approximately 570 MB of weights). Select Enable local AI. The extension immediately downloads the model and builds an index of existing bookmark titles and full folder paths. Progress appears in the popup. Model files are stored in Cache Storage, and vectors are stored in the `bookmark-embeddings` IndexedDB database, separately for MiniLM and BGE. Subsequent new bookmarks trigger processing of their titles.

Switching models closes the previous worker and cancels its queue. The model unloads after 15 seconds of inactivity. Disabling processing also unloads the model. Runtime code and WASM files are bundled with the extension.

The index is saved in full after computation completes. Interruption preserves the last complete version. Enabling AI again checks the saved index against the current titles, paths, and model. A matching index is reused. While AI is enabled, bookmark events automatically synchronize the selected model index. Events are grouped over 250 ms, and changes during indexing are synchronized when the current job finishes. Unchanged vectors are reused, new or changed text is embedded, and deleted entries are removed. Folder changes update affected full paths. Inactive model indexes are synchronized when selected; changes made with AI disabled are synchronized when AI is enabled again.

## Verification

`npm test` checks the detector, settings, and index preparation. `npm run test:model` runs a browser test in a separate profile using local MiniLM files supplied through `MODEL_TEST_CACHE_DIR`. It checks library reads, MiniLM indexing after enabling AI, vectors, progress, index reuse, cancellation, loading errors, and index persistence after restarting Chrome. The automated browser test uses MiniLM weights.
