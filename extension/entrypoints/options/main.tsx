import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import ModelPanel from '../popup/ModelPanel';
import LibraryPanel from '../popup/LibraryPanel';
import '../popup/style.css';
import './style.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <main className="settings-page">
      <header className="brand">
        <img src="/icons/48.png" width="40" height="40" alt="" />
        <div>
          <p className="settings-brand">Bookmark Organizer</p>
          <h1>Settings</h1>
        </div>
      </header>
      <ModelPanel configuration />
      <section className="settings-folders" aria-label="Folder settings">
        <h2>Folders and descriptions</h2>
        <p className="model-note">Edit folder descriptions to help AI choose where to save new bookmarks.</p>
        <LibraryPanel />
      </section>
    </main>
  </StrictMode>,
);
