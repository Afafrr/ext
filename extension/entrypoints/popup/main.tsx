import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import SaveBookmark from './SaveBookmark';
import './style.css';

const bookmarkId = new URLSearchParams(location.search).get('bookmark');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {bookmarkId ? <SaveBookmark initialBookmarkId={bookmarkId} /> : <App />}
  </StrictMode>,
);
