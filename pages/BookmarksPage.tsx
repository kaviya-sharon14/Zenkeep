
import React, { useState, useMemo } from 'react';
import { Bookmark } from '../types';
import Modal from '../components/Modal';
import TagInput from '../components/TagInput';
import { aiService } from '../services/geminiService';
import { Trash2, Edit2, Star, Plus, Sparkles, ExternalLink, Globe, Hash, X } from 'lucide-react';

interface BookmarksPageProps {
  bookmarks: Bookmark[];
  setBookmarks: React.Dispatch<React.SetStateAction<Bookmark[]>>;
  searchTerm: string;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const BookmarksPage: React.FC<BookmarksPageProps> = ({ bookmarks, setBookmarks, searchTerm, isOpen, setIsOpen }) => {
  const [editingBookmark, setEditingBookmark] = useState<Bookmark | null>(null);
  const [formData, setFormData] = useState({ 
    url: '', 
    title: '', 
    description: '', 
    tags: [] as string[] 
  });
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    bookmarks.forEach(b => b.tags.forEach(tag => tags.add(tag)));
    return Array.from(tags).sort();
  }, [bookmarks]);

  const filteredBookmarks = useMemo(() => {
    return bookmarks.filter(b => {
      const matchesSearch = 
        b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesFavorite = showFavoritesOnly ? b.isFavorite : true;
      const matchesTag = selectedTag ? b.tags.includes(selectedTag) : true;
      
      return matchesSearch && matchesFavorite && matchesTag;
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [bookmarks, searchTerm, showFavoritesOnly, selectedTag]);

  const handleSave = () => {
    if (!formData.url.trim()) return;
    
    try {
      new URL(formData.url);
    } catch (_) {
      alert('Please enter a valid URL');
      return;
    }

    if (editingBookmark) {
      setBookmarks(prev => prev.map(b => b.id === editingBookmark.id ? {
        ...b,
        ...formData
      } : b));
    } else {
      const newBookmark: Bookmark = {
        id: crypto.randomUUID(),
        ...formData,
        isFavorite: false,
        createdAt: new Date().toISOString()
      };
      setBookmarks(prev => [newBookmark, ...prev]);
    }
    closeModal();
  };

  const closeModal = () => {
    setIsOpen(false);
    setEditingBookmark(null);
    setFormData({ url: '', title: '', description: '', tags: [] });
  };

  const handleEdit = (bookmark: Bookmark) => {
    setEditingBookmark(bookmark);
    setFormData({ 
      url: bookmark.url, 
      title: bookmark.title, 
      description: bookmark.description, 
      tags: bookmark.tags 
    });
    setIsOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this bookmark?')) {
      setBookmarks(prev => prev.filter(b => b.id !== id));
    }
  };

  const toggleFavorite = (id: string) => {
    setBookmarks(prev => prev.map(b => b.id === id ? { ...b, isFavorite: !b.isFavorite } : b));
  };

  const handleAiAutoFill = async () => {
    if (!formData.url) return;
    setIsAiProcessing(true);
    try {
      const meta = await aiService.getBookmarkMetadata(formData.url);
      if (meta) {
        setFormData(prev => ({
          ...prev,
          title: prev.title || meta.title,
          description: prev.description || meta.description,
          tags: Array.from(new Set([...prev.tags, ...meta.tags]))
        }));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsAiProcessing(false);
    }
  };

  const getHostname = (url: string) => {
    try {
      return new URL(url).hostname;
    } catch {
      return url;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white">Your Bookmarks</h2>
          <p className="text-slate-400">Save and organize your favorite web resources.</p>
        </div>
        
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 md:pb-0">
          <button 
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg border transition-all text-sm font-medium ${
              showFavoritesOnly 
                ? 'bg-yellow-500/10 border-yellow-500/50 text-yellow-500' 
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <Star size={16} fill={showFavoritesOnly ? "currentColor" : "none"} />
            <span>Favorites</span>
          </button>
          
          <div className="h-6 w-px bg-slate-800" />
          
          <div className="flex items-center space-x-2 whitespace-nowrap">
            {selectedTag && (
              <button 
                onClick={() => setSelectedTag(null)}
                className="flex items-center space-x-1 px-2 py-1 bg-indigo-600/20 text-indigo-400 rounded-md text-xs border border-indigo-600/30"
              >
                <span>#{selectedTag}</span>
                <X size={12} />
              </button>
            )}
            {allTags.slice(0, 5).map(tag => (
              <button 
                key={tag}
                onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                className={`px-2 py-1 rounded-md text-xs border transition-colors ${
                  tag === selectedTag 
                    ? 'bg-indigo-600/20 border-indigo-600/50 text-indigo-400' 
                    : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300 hover:border-slate-700'
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredBookmarks.map(bookmark => (
          <div key={bookmark.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col h-full hover:border-slate-700 transition-all group overflow-hidden relative">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3 truncate">
                <div className="p-2 bg-slate-800 rounded-lg text-slate-400 shrink-0">
                  <Globe size={20} />
                </div>
                <h3 className="text-lg font-semibold text-white truncate leading-tight">
                  {bookmark.title || bookmark.url}
                </h3>
              </div>
              <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => toggleFavorite(bookmark.id)} className={`p-2 rounded-lg transition-colors ${bookmark.isFavorite ? 'text-yellow-500' : 'text-slate-500 hover:text-slate-300'}`}>
                  <Star size={16} fill={bookmark.isFavorite ? "currentColor" : "none"} />
                </button>
                <button onClick={() => handleEdit(bookmark)} className="p-2 text-slate-500 hover:text-blue-400 rounded-lg transition-colors">
                  <Edit2 size={16} />
                </button>
                <button onClick={() => handleDelete(bookmark.id)} className="p-2 text-slate-500 hover:text-red-400 rounded-lg transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            
            <p className="text-slate-500 text-[10px] mb-3 truncate font-bold uppercase tracking-widest">{getHostname(bookmark.url)}</p>
            
            <p className="text-slate-400 text-sm mb-6 line-clamp-2 leading-relaxed flex-1">
              {bookmark.description || "No description provided."}
            </p>

            <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-800/50">
              <div className="flex flex-wrap gap-1.5 overflow-hidden">
                {bookmark.tags.map(tag => (
                  <button 
                    key={tag} 
                    onClick={() => setSelectedTag(tag)}
                    className="flex items-center space-x-1 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded text-[10px] border border-indigo-500/20 transition-colors"
                  >
                    <Hash size={10} />
                    <span>{tag}</span>
                  </button>
                ))}
              </div>
              <a 
                href={bookmark.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 bg-slate-800 text-slate-400 hover:text-indigo-400 hover:bg-slate-700 rounded-lg transition-all ml-2"
              >
                <ExternalLink size={16} />
              </a>
            </div>
            {bookmark.isFavorite && (
              <div className="absolute top-0 right-0 p-1">
                <div className="w-2 h-2 rounded-full bg-yellow-500 shadow-lg shadow-yellow-500/50" />
              </div>
            )}
          </div>
        ))}

        {filteredBookmarks.length === 0 && (
          <div className="col-span-full py-20 text-center bg-slate-900/20 border-2 border-dashed border-slate-800 rounded-3xl">
             <div className="flex justify-center mb-4">
               <div className="p-4 bg-slate-800 rounded-2xl text-slate-600">
                 <Globe size={48} />
               </div>
             </div>
             <p className="text-slate-400 mb-2 font-medium">No bookmarks match your filters</p>
             <button onClick={() => { setShowFavoritesOnly(false); setSelectedTag(null); }} className="text-blue-400 hover:underline">Clear filters</button>
          </div>
        )}
      </div>

      <Modal 
        isOpen={isOpen} 
        onClose={closeModal} 
        title={editingBookmark ? 'Edit Bookmark' : 'Add New Bookmark'}
      >
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-400">URL</label>
            <div className="relative">
              <input 
                type="url"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                placeholder="https://example.com"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
              <button 
                onClick={handleAiAutoFill}
                disabled={isAiProcessing || !formData.url}
                className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-1.5 text-[10px] uppercase font-bold tracking-widest bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-400 px-3 py-1.5 rounded-lg transition-all disabled:opacity-50"
              >
                <Sparkles size={12} className={isAiProcessing ? 'animate-pulse' : ''} />
                <span>{isAiProcessing ? '...' : 'AI Meta'}</span>
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Title (Optional)</label>
            <input 
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Great React Tutorial"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Description (Optional)</label>
            <textarea 
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Why are you saving this?"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Tags</label>
            <TagInput 
              tags={formData.tags}
              onChange={(tags) => setFormData({ ...formData, tags })}
              placeholder="e.g. dev, article, reading-list"
            />
          </div>
          <button 
            onClick={handleSave}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-indigo-900/20"
          >
            {editingBookmark ? 'Update Bookmark' : 'Save Bookmark'}
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default BookmarksPage;
