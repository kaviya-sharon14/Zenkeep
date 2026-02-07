
export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Bookmark {
  id: string;
  url: string;
  title: string;
  description: string;
  tags: string[];
  isFavorite: boolean;
  createdAt: string;
}

export type ItemType = 'note' | 'bookmark';

export interface AppState {
  notes: Note[];
  bookmarks: Bookmark[];
  activeTab: 'notes' | 'bookmarks' | 'dashboard';
  searchTerm: string;
  selectedTags: string[];
}
