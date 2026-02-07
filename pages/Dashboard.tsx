
import React from 'react';
import { Note, Bookmark } from '../types';
import { FileText, BookMarked, ArrowRight, Clock, Star, ExternalLink } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface DashboardProps {
  stats: {
    totalNotes: number;
    totalBookmarks: number;
    recentNotes: Note[];
    recentBookmarks: Bookmark[];
  };
  onNavigate: (tab: string) => void;
  onAddNote: () => void;
  onAddBookmark: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ stats, onNavigate, onAddNote, onAddBookmark }) => {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Welcome back!</h2>
        <p className="text-slate-400">Here's a quick look at your organized space.</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl hover:border-slate-700 transition-all group">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400 group-hover:scale-110 transition-transform">
              <FileText size={24} />
            </div>
          </div>
          <div className="text-3xl font-bold text-white">{stats.totalNotes}</div>
          <div className="text-slate-400 text-sm">Notes saved</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl hover:border-slate-700 transition-all group">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400 group-hover:scale-110 transition-transform">
              <BookMarked size={24} />
            </div>
          </div>
          <div className="text-3xl font-bold text-white">{stats.totalBookmarks}</div>
          <div className="text-slate-400 text-sm">Bookmarks kept</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Notes */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-white flex items-center space-x-2">
              <FileText className="text-blue-400" size={20} />
              <span>Recent Notes</span>
            </h3>
            <button onClick={() => onNavigate('notes')} className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center space-x-1">
              <span>View all</span>
              <ArrowRight size={14} />
            </button>
          </div>
          <div className="space-y-3">
            {stats.recentNotes.length > 0 ? stats.recentNotes.map(note => (
              <div key={note.id} className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl hover:bg-slate-800/50 transition-colors">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium text-slate-100 line-clamp-1">{note.title || "Untitled Note"}</h4>
                  {note.isFavorite && <Star size={14} className="text-yellow-500 fill-yellow-500" />}
                </div>
                <p className="text-sm text-slate-400 line-clamp-2 mb-2">{note.content}</p>
                <div className="flex items-center text-[10px] text-slate-500 uppercase tracking-wider space-x-2">
                  <Clock size={10} />
                  <span>Modified {formatDistanceToNow(new Date(note.updatedAt))} ago</span>
                </div>
              </div>
            )) : (
              <div className="text-center py-8 bg-slate-900/30 rounded-xl border border-dashed border-slate-800">
                <p className="text-slate-500 text-sm mb-4">No notes yet</p>
                <button onClick={onAddNote} className="text-blue-400 text-sm hover:underline">Create your first note</button>
              </div>
            )}
          </div>
        </section>

        {/* Recent Bookmarks */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-white flex items-center space-x-2">
              <BookMarked className="text-indigo-400" size={20} />
              <span>Recent Bookmarks</span>
            </h3>
            <button onClick={() => onNavigate('bookmarks')} className="text-indigo-400 hover:text-indigo-300 text-sm font-medium flex items-center space-x-1">
              <span>View all</span>
              <ArrowRight size={14} />
            </button>
          </div>
          <div className="space-y-3">
             {stats.recentBookmarks.length > 0 ? stats.recentBookmarks.map(bookmark => (
              <div key={bookmark.id} className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl hover:bg-slate-800/50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-slate-100 line-clamp-1 mb-1">{bookmark.title || bookmark.url}</h4>
                    <p className="text-sm text-slate-400 line-clamp-1 mb-2">{bookmark.description}</p>
                  </div>
                  <a href={bookmark.url} target="_blank" rel="noopener noreferrer" className="p-2 text-slate-500 hover:text-indigo-400 transition-colors">
                    <ExternalLink size={16} />
                  </a>
                </div>
                <div className="flex flex-wrap gap-2">
                  {bookmark.tags.slice(0, 2).map(tag => (
                    <span key={tag} className="text-[10px] bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded border border-indigo-500/20">#{tag}</span>
                  ))}
                </div>
              </div>
            )) : (
              <div className="text-center py-8 bg-slate-900/30 rounded-xl border border-dashed border-slate-800">
                <p className="text-slate-500 text-sm mb-4">No bookmarks yet</p>
                <button onClick={onAddBookmark} className="text-indigo-400 text-sm hover:underline">Add your first bookmark</button>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
