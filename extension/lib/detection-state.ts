export const STORAGE_KEY = 'bookmarkDetection';
export const CLEAR_ACTIVITY_MESSAGE = 'bookmark-organizer:clear-activity';
export const MAX_RECENT_BOOKMARKS = 20;

export interface DetectedBookmark {
  id: string;
  title: string;
  url: string;
  folderPath: string[];
  folderIds: string[];
  detectedAt: number;
}

export interface DetectionState {
  recent: DetectedBookmark[];
  importInProgress: boolean;
}

export function emptyState(): DetectionState {
  return { recent: [], importInProgress: false };
}
