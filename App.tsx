
import React, { useState, useEffect, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import NotesPage from './pages/NotesPage';
import BookmarksPage from './pages/BookmarksPage';
import { storage } from './store/storage';
import { Note, Bookmark } from './types';
import { Search, Plus, Sparkles, Command } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'notes' | 'bookmarks'>('dashboard');
  const [notes, setNotes] = useState<Note[]>([]);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [isBookmarkModalOpen, setIsBookmarkModalOpen] = useState(false);

  useEffect(() => {
    setNotes(storage.getNotes());
    setBookmarks(storage.getBookmarks());
  }, []);

  useEffect(() => { storage.saveNotes(notes); }, [notes]);
  useEffect(() => { storage.saveBookmarks(bookmarks); }, [bookmarks]);

  const stats = useMemo(() => ({
    totalNotes: notes.length,
    totalBookmarks: bookmarks.length,
    recentNotes: [...notes].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()).slice(0, 3),
    recentBookmarks: [...bookmarks].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 3),
  }), [notes, bookmarks]);

  return (
    <div className="flex min-h-screen bg-[#09090b] text-zinc-200">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Modern AI Studio Header */}
        <header className="h-16 flex items-center justify-between px-8 border-b border-[#27272a] bg-[#09090b]/80 backdrop-blur-xl z-50">
          <div className="flex items-center space-x-6 flex-1 max-w-2xl">
            <div className="relative flex-1 group">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-blue-400 transition-colors">
                <Search size={16} />
              </div>
              <input 
                type="text" 
                placeholder={`Search your ${activeTab}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#18181b] border border-[#27272a] rounded-lg pl-10 pr-12 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all placeholder:text-zinc-600"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-1 px-1.5 py-0.5 rounded border border-[#27272a] bg-[#09090b] text-[10px] text-zinc-500">
                <Command size={10} />
                <span>K</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 ml-4">
            <button 
              onClick={() => activeTab === 'notes' ? setIsNoteModalOpen(true) : setIsBookmarkModalOpen(true)}
              className="flex items-center space-x-2 bg-white hover:bg-zinc-200 text-black px-4 py-1.5 rounded-lg transition-all text-sm font-semibold shadow-sm active:scale-95"
            >
              <Plus size={16} strokeWidth={3} />
              <span>Create</span>
            </button>
            <div className="w-8 h-8 rounded-full bg-[#18181b] border border-[#27272a] flex items-center justify-center cursor-pointer hover:bg-[#27272a] transition-colors">
                <Sparkles size={14} className="text-zinc-400" />
            </div>
          </div>
        </header>

        {/* Content with smoother scrolling */}
        <div className="flex-1 overflow-y-auto scroll-smooth custom-scrollbar p-8">
          {activeTab === 'dashboard' && <Dashboard stats={stats} onNavigate={setActiveTab} onAddNote={() => setIsNoteModalOpen(true)} onAddBookmark={() => setIsBookmarkModalOpen(true)} />}
          {activeTab === 'notes' && <NotesPage notes={notes} setNotes={setNotes} searchTerm={searchTerm} isOpen={isNoteModalOpen} setIsOpen={setIsNoteModalOpen} />}
          {activeTab === 'bookmarks' && <BookmarksPage bookmarks={bookmarks} setBookmarks={setBookmarks} searchTerm={searchTerm} isOpen={isBookmarkModalOpen} setIsOpen={setIsBookmarkModalOpen} />}
        </div>
      </main>
    </div>
  );
};

export default App;
