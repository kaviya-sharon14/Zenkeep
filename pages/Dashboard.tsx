
import React from 'react';
import { Note, Bookmark } from '../types';
import { FileText, BookMarked, ArrowRight, Clock, Star, ExternalLink, Sparkles } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface DashboardProps {
  stats: {
    totalNotes: number;
    totalBookmarks: number;
    recentNotes: Note[];
    recentBookmarks: Bookmark[];
  };
  // Fix: Specify the union type for tabs to match the App state definition in App.tsx
  onNavigate: (tab: 'notes' | 'bookmarks' | 'dashboard') => void;
  onAddNote: () => void;
  onAddBookmark: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ stats, onNavigate, onAddNote, onAddBookmark }) => {
  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-2 duration-700">
      <header className="space-y-2">
        <h2 className="text-4xl font-bold tracking-tight text-white flex items-center space-x-3">
          <span>Overview</span>
          <div className="px-2 py-0.5 rounded bg-blue-500/10 border-blue-500/20 text-[10px] font-bold text-blue-400 uppercase tracking-widest">Workspace</div>
        </h2>
        <p className="text-zinc-500 text-lg">Your synchronized knowledge base and AI assistants.</p>
      </header>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div 
          onClick={() => onNavigate('notes')}
          className="group cursor-pointer bg-[#18181b] border border-[#27272a] p-8 rounded-2xl hover:border-zinc-700 transition-all relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
            <FileText size={120} />
          </div>
          <div className="relative z-10">
            <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400 mb-6 group-hover:scale-110 transition-transform">
              <FileText size={24} />
            </div>
            <div className="text-4xl font-bold text-white mb-1 tracking-tighter">{stats.totalNotes}</div>
            <p className="text-zinc-400 font-medium">Notes captured</p>
          </div>
        </div>

        <div 
          onClick={() => onNavigate('bookmarks')}
          className="group cursor-pointer bg-[#18181b] border border-[#27272a] p-8 rounded-2xl hover:border-zinc-700 transition-all relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
            <BookMarked size={120} />
          </div>
          <div className="relative z-10">
            <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-400 mb-6 group-hover:scale-110 transition-transform">
              <BookMarked size={24} />
            </div>
            <div className="text-4xl font-bold text-white mb-1 tracking-tighter">{stats.totalBookmarks}</div>
            <p className="text-zinc-400 font-medium">Bookmarks saved</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pt-4">
        {/* Recent Items with refined typography */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-[#27272a] pb-4">
            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-zinc-500 flex items-center space-x-2">
              <Sparkles size={14} className="text-blue-400" />
              <span>Latest Notes</span>
            </h3>
            <button onClick={() => onNavigate('notes')} className="text-xs font-semibold text-zinc-400 hover:text-white transition-colors flex items-center space-x-1">
              <span>See more</span>
              <ArrowRight size={14} />
            </button>
          </div>
          <div className="space-y-4">
            {stats.recentNotes.length > 0 ? stats.recentNotes.map(note => (
              <div key={note.id} className="bg-[#18181b]/50 border border-[#27272a] p-5 rounded-xl hover:bg-[#18181b] transition-all hover:-translate-y-1 ai-glow cursor-pointer">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-white truncate max-w-[70%]">{note.title || "Untitled"}</h4>
                  <div className="flex items-center space-x-2 text-[10px] text-zinc-500">
                    <Clock size={10} />
                    <span>{formatDistanceToNow(new Date(note.updatedAt))} ago</span>
                  </div>
                </div>
                <p className="text-sm text-zinc-500 line-clamp-2 leading-relaxed">{note.content}</p>
              </div>
            )) : (
              <div className="py-12 text-center bg-[#18181b]/30 rounded-2xl border-2 border-dashed border-[#27272a]">
                <p className="text-zinc-500 text-sm mb-4">Start capturing ideas.</p>
                <button onClick={onAddNote} className="text-blue-400 text-sm font-bold hover:underline">New Note</button>
              </div>
            )}
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-[#27272a] pb-4">
            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-zinc-500 flex items-center space-x-2">
              <ExternalLink size={14} className="text-purple-400" />
              <span>Web Library</span>
            </h3>
            <button onClick={() => onNavigate('bookmarks')} className="text-xs font-semibold text-zinc-400 hover:text-white transition-colors flex items-center space-x-1">
              <span>View all</span>
              <ArrowRight size={14} />
            </button>
          </div>
          <div className="space-y-4">
             {stats.recentBookmarks.length > 0 ? stats.recentBookmarks.map(bookmark => (
              <div key={bookmark.id} className="bg-[#18181b]/50 border border-[#27272a] p-5 rounded-xl hover:bg-[#18181b] transition-all hover:-translate-y-1 ai-glow group cursor-pointer">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0 pr-4">
                    <h4 className="font-semibold text-white truncate mb-1">{bookmark.title || bookmark.url}</h4>
                    <p className="text-xs text-zinc-500 truncate mb-3">{new URL(bookmark.url).hostname}</p>
                  </div>
                  <div className="p-2 rounded-lg bg-[#27272a] text-zinc-400 group-hover:text-purple-400 transition-colors">
                    <ExternalLink size={14} />
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {bookmark.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="text-[9px] font-bold uppercase tracking-wider bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded">#{tag}</span>
                  ))}
                </div>
              </div>
            )) : (
              <div className="py-12 text-center bg-[#18181b]/30 rounded-2xl border-2 border-dashed border-[#27272a]">
                <p className="text-zinc-500 text-sm mb-4">Save your first resource.</p>
                <button onClick={onAddBookmark} className="text-purple-400 text-sm font-bold hover:underline">Add Bookmark</button>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
