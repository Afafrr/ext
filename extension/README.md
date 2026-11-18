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

Choose MiniLM Q8 (approximately 118 MB of weights) or BGE-M3 Q8 (approximately 570 MB of weights). Select Enable local AI to index bookmark titles and folder paths with saved folder descriptions. Model files use Cache Storage. Per-model vectors and metadata use the `indexes` store in the `bookmark-embeddings` IndexedDB database.

During indexing, the selected model chooses up to three representative bookmark titles for each folder and combines them with its path. A bookmark URL supplies the text when its title is empty. Descriptions are refreshed when folder contents, paths, or the selected model change. Empty folders use their paths. Manual edits, including a cleared description, are preserved.

Expand a folder in Bookmark library to edit and save its description. Folder descriptions are stored in `folderDescriptions`, keyed by Chrome folder ID, and survive model switches and browser restarts. Saving or clearing a description refreshes its embedding when AI is enabled. Deleting a folder removes its saved description.

Page descriptions and query embeddings are held in memory for the current job. Database version 3 removes the previous `pages` store and invalidates indexes containing persisted page descriptions so they can be rebuilt from titles. Existing title-only indexes and saved folder descriptions are retained.

Switching models closes the previous worker and cancels its queue. The model unloads after 60 seconds of inactivity. Disabling processing also unloads the model. Runtime code and WASM files are bundled with the extension.

The index is saved in full after computation completes. Interruption preserves the last complete version. Enabling AI again checks the saved index against the current titles, paths, and model. A matching index is reused. While AI is enabled, bookmark events automatically synchronize the selected model index. Events are grouped over 250 ms, and changes during indexing are synchronized when the current job finishes. Unchanged vectors are reused, new or changed text is embedded, and deleted entries are removed. Folder changes update affected full paths. Inactive model indexes are synchronized when selected; changes made with AI disabled are synchronized when AI is enabled again.

Page description access is off by default. The Use page descriptions checkbox requests optional `scripting` and HTTP(S) host permissions through Chrome after a user click. Turning it off revokes those permissions. Permission is checked before reading metadata and again before using it. Reload the extension after updating.

## Bookmark suggestion flow

1. Chrome reports a new bookmark. The extension records it in recent activity and starts a suggestion job. The suggestion reuses saved vectors and computes missing reference vectors in memory. The persistent index is synchronized after pending suggestions finish.
2. If Use page descriptions is enabled and website access is granted, read `meta[name="description"]` from a matching open HTTP(S) tab. Fall back to `meta[property="og:description"]`, then to the bookmark title alone. Use the URL when the title is empty.
3. Combine the current title and available page description, then compute a normalized query embedding with the selected model in the offscreen worker. Keep the page description and query embedding in memory for this job.
4. Compare the query with the selected model's indexed folder and bookmark vectors using the ranking algorithm below.
5. Show up to three suggested folders with full paths in the popup for the latest processed bookmark. Moving the bookmark after user confirmation is a planned follow-up.

## Ranking algorithm

- Each folder vector represents its full path combined with its saved folder description, when available.
- Each existing bookmark vector represents its title, with the URL used for an empty title.
- Similarity is the dot product of normalized vectors, equivalent to cosine similarity.
- For each folder, find the most similar indexed bookmark directly inside it. Exclude the newly added bookmark from this search.

```text
folder_score = similarity(query, folder_vector)
bookmark_score = highest similarity(query, existing_bookmark_vector) in that folder
score = 0.3 * folder_score + 0.7 * bookmark_score
```

- When a folder has no other indexed bookmark, use `folder_score` as its final score.
- Include writable folders with an indexed folder vector. Skip vectors whose dimensions differ from the query.
- Sort folders by descending score and return up to three results. Scores represent similarity.

## Planned improvements

- Assess description confidence using the amount of supporting content, how informative the titles are, and their topical consistency. Validate review thresholds against user-reviewed examples.
- Mark low-confidence descriptions as needing review and show the reason, such as too few bookmarks, vague titles, or mixed topics. Let users approve or edit them, and allow editing any description.
- Add an explicit action to move a bookmark into a suggested folder after user confirmation.

## Verification

`npm test` checks the detector, settings, and index preparation. `npm run test:model` runs a browser test in a separate profile using local MiniLM files supplied through `MODEL_TEST_CACHE_DIR`. It checks optional access and revocation, transient page metadata and fallbacks, database upgrades, folder descriptions, library reads, MiniLM indexing after enabling AI, vectors, progress, index reuse, cancellation, loading errors, and persistence after restarting Chrome. The automated browser test uses MiniLM weights. It seeds prior host-access approval through Chrome settings in its isolated profile because native permission dialogs are outside Playwright page automation.
