
import { Note, Bookmark } from '../types';

const STORAGE_KEYS = {
  NOTES: 'zenkeep_notes',
  BOOKMARKS: 'zenkeep_bookmarks'
};

export const storage = {
  getNotes: (): Note[] => {
    const data = localStorage.getItem(STORAGE_KEYS.NOTES);
    return data ? JSON.parse(data) : [];
  },
  saveNotes: (notes: Note[]) => {
    localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
  },
  getBookmarks: (): Bookmark[] => {
    const data = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
    return data ? JSON.parse(data) : [];
  },
  saveBookmarks: (bookmarks: Bookmark[]) => {
    localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(bookmarks));
  }
};
