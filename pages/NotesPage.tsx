
import React, { useState, useMemo } from 'react';
import { Note } from '../types';
import Modal from '../components/Modal';
import TagInput from '../components/TagInput';
import { aiService } from '../services/geminiService';
import { Trash2, Edit2, Star, Plus, Sparkles, Clock, Hash, Filter, X } from 'lucide-react';
import { format } from 'date-fns';

interface NotesPageProps {
  notes: Note[];
  setNotes: React.Dispatch<React.SetStateAction<Note[]>>;
  searchTerm: string;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const NotesPage: React.FC<NotesPageProps> = ({ notes, setNotes, searchTerm, isOpen, setIsOpen }) => {
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [formData, setFormData] = useState({ title: '', content: '', tags: [] as string[] });
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    notes.forEach(note => note.tags.forEach(tag => tags.add(tag)));
    return Array.from(tags).sort();
  }, [notes]);

  const filteredNotes = useMemo(() => {
    return notes.filter(note => {
      const matchesSearch = 
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesFavorite = showFavoritesOnly ? note.isFavorite : true;
      const matchesTag = selectedTag ? note.tags.includes(selectedTag) : true;
      
      return matchesSearch && matchesFavorite && matchesTag;
    }).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }, [notes, searchTerm, showFavoritesOnly, selectedTag]);

  const handleSave = () => {
    if (!formData.content.trim()) return;

    if (editingNote) {
      setNotes(prev => prev.map(n => n.id === editingNote.id ? {
        ...n,
        ...formData,
        updatedAt: new Date().toISOString()
      } : n));
    } else {
      const newNote: Note = {
        id: crypto.randomUUID(),
        ...formData,
        isFavorite: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setNotes(prev => [newNote, ...prev]);
    }
    closeModal();
  };

  const closeModal = () => {
    setIsOpen(false);
    setEditingNote(null);
    setFormData({ title: '', content: '', tags: [] });
  };

  const handleEdit = (note: Note) => {
    setEditingNote(note);
    setFormData({ title: note.title, content: note.content, tags: note.tags });
    setIsOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this note?')) {
      setNotes(prev => prev.filter(n => n.id !== id));
    }
  };

  const toggleFavorite = (id: string) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, isFavorite: !n.isFavorite } : n));
  };

  const handleAiSuggest = async () => {
    if (!formData.content) return;
    setIsAiProcessing(true);
    try {
      const suggested = await aiService.suggestTagsForNote(formData.title, formData.content);
      const combined = Array.from(new Set([...formData.tags, ...suggested]));
      setFormData(prev => ({ ...prev, tags: combined }));
    } catch (e) {
      console.error(e);
    } finally {
      setIsAiProcessing(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white">Your Notes</h2>
          <p className="text-slate-400">Capture your thoughts and organize them with tags.</p>
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
                className="flex items-center space-x-1 px-2 py-1 bg-blue-600/20 text-blue-400 rounded-md text-xs border border-blue-600/30"
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
                    ? 'bg-blue-600/20 border-blue-600/50 text-blue-400' 
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
        {filteredNotes.map(note => (
          <div key={note.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col h-full hover:border-slate-700 transition-all group relative">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-semibold text-white line-clamp-1">{note.title || "Untitled"}</h3>
              <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => toggleFavorite(note.id)} className={`p-2 rounded-lg transition-colors ${note.isFavorite ? 'text-yellow-500' : 'text-slate-500 hover:text-slate-300'}`}>
                  <Star size={16} fill={note.isFavorite ? "currentColor" : "none"} />
                </button>
                <button onClick={() => handleEdit(note)} className="p-2 text-slate-500 hover:text-blue-400 rounded-lg transition-colors">
                  <Edit2 size={16} />
                </button>
                <button onClick={() => handleDelete(note.id)} className="p-2 text-slate-500 hover:text-red-400 rounded-lg transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            
            <p className="text-slate-400 text-sm flex-1 line-clamp-6 leading-relaxed mb-6 whitespace-pre-wrap">
              {note.content}
            </p>

            <div className="flex flex-wrap gap-2 mt-auto">
              {note.tags.map(tag => (
                <button 
                  key={tag} 
                  onClick={() => setSelectedTag(tag)}
                  className="flex items-center space-x-1 bg-slate-800 hover:bg-slate-700 text-slate-400 px-2 py-1 rounded text-xs transition-colors"
                >
                  <Hash size={10} />
                  <span>{tag}</span>
                </button>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-slate-800/50 flex items-center justify-between text-[10px] text-slate-600 uppercase tracking-widest">
               <span className="flex items-center space-x-1">
                 <Clock size={10} />
                 <span>{format(new Date(note.updatedAt), 'MMM d, h:mm a')}</span>
               </span>
               {note.isFavorite && <span className="text-yellow-500/80 font-bold">Favorite</span>}
            </div>
          </div>
        ))}
        
        {filteredNotes.length === 0 && (
          <div className="col-span-full py-20 text-center bg-slate-900/20 border-2 border-dashed border-slate-800 rounded-3xl">
             <div className="flex justify-center mb-4">
               <div className="p-4 bg-slate-800 rounded-2xl text-slate-600">
                 <Plus size={48} />
               </div>
             </div>
             <p className="text-slate-400 mb-2 font-medium">No notes match your filters</p>
             <button onClick={() => { setShowFavoritesOnly(false); setSelectedTag(null); }} className="text-blue-400 hover:underline">Clear filters</button>
          </div>
        )}
      </div>

      <Modal 
        isOpen={isOpen} 
        onClose={closeModal} 
        title={editingNote ? 'Edit Note' : 'Create New Note'}
      >
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Title</label>
            <input 
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Give your note a title..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Content</label>
            <textarea 
              rows={8}
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="What's on your mind?"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-slate-400">Tags</label>
              <button 
                onClick={handleAiSuggest}
                disabled={isAiProcessing || !formData.content}
                className="flex items-center space-x-1.5 text-xs text-indigo-400 hover:text-indigo-300 transition-colors disabled:opacity-50"
              >
                <Sparkles size={14} className={isAiProcessing ? 'animate-pulse' : ''} />
                <span>{isAiProcessing ? 'Thinking...' : 'AI Suggest Tags'}</span>
              </button>
            </div>
            <TagInput 
              tags={formData.tags}
              onChange={(tags) => setFormData({ ...formData, tags })}
            />
          </div>
          <button 
            onClick={handleSave}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-blue-900/20"
          >
            {editingNote ? 'Update Note' : 'Create Note'}
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default NotesPage;
