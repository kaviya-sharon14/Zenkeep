
import React, { useState, useEffect, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import NotesPage from './pages/NotesPage';
import BookmarksPage from './pages/BookmarksPage';
import { storage } from './store/storage';
import { Note, Bookmark } from './types';
import { Search, Plus, Filter, LayoutGrid, List } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'notes' | 'bookmarks'>('dashboard');
  const [notes, setNotes] = useState<Note[]>([]);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [isBookmarkModalOpen, setIsBookmarkModalOpen] = useState(false);

  // Load initial data
  useEffect(() => {
    setNotes(storage.getNotes());
    setBookmarks(storage.getBookmarks());
  }, []);

  // Save data on change
  useEffect(() => {
    storage.saveNotes(notes);
  }, [notes]);

  useEffect(() => {
    storage.saveBookmarks(bookmarks);
  }, [bookmarks]);

  const stats = useMemo(() => ({
    totalNotes: notes.length,
    totalBookmarks: bookmarks.length,
    recentNotes: notes.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()).slice(0, 3),
    recentBookmarks: bookmarks.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 3),
  }), [notes, bookmarks]);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard 
          stats={stats} 
          onNavigate={(tab) => setActiveTab(tab as any)}
          onAddNote={() => setIsNoteModalOpen(true)}
          onAddBookmark={() => setIsBookmarkModalOpen(true)}
        />;
      case 'notes':
        return <NotesPage 
          notes={notes} 
          setNotes={setNotes} 
          searchTerm={searchTerm} 
          isOpen={isNoteModalOpen} 
          setIsOpen={setIsNoteModalOpen} 
        />;
      case 'bookmarks':
        return <BookmarksPage 
          bookmarks={bookmarks} 
          setBookmarks={setBookmarks} 
          searchTerm={searchTerm} 
          isOpen={isBookmarkModalOpen} 
          setIsOpen={setIsBookmarkModalOpen} 
        />;
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-200">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 px-8 py-4 flex items-center justify-between">
          <div className="flex-1 max-w-xl">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={18} />
              <input 
                type="text" 
                placeholder={`Search ${activeTab}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 transition-all"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-4 ml-8">
            <button 
              onClick={() => activeTab === 'notes' ? setIsNoteModalOpen(true) : setIsBookmarkModalOpen(true)}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl transition-all font-medium shadow-lg shadow-blue-900/20 active:scale-95"
            >
              <Plus size={18} />
              <span>Create {activeTab === 'bookmarks' ? 'Bookmark' : 'Note'}</span>
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8 bg-slate-950">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
