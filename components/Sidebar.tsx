
import React from 'react';
import { LayoutDashboard, BookMarked, FileText, Sparkles, UserCircle } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: 'notes' | 'bookmarks' | 'dashboard') => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'notes', label: 'Notes', icon: FileText },
    { id: 'bookmarks', label: 'Library', icon: BookMarked },
  ];

  return (
    <aside className="w-64 bg-[#09090b] border-r border-[#27272a] flex flex-col h-screen sticky top-0">
      <div className="p-8 flex items-center space-x-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
          <Sparkles size={18} className="text-white" />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-white">ZenKeep</h1>
      </div>
      
      <nav className="flex-1 px-4 mt-2 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-all duration-200 group ${
                isActive 
                  ? 'bg-[#18181b] text-white border border-[#27272a]' 
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#18181b]/50'
              }`}
            >
              <Icon size={18} className={isActive ? 'text-blue-400' : 'group-hover:text-zinc-300'} />
              <span className="text-sm font-medium">{item.label}</span>
              {isActive && <div className="ml-auto w-1 h-4 rounded-full bg-blue-500" />}
            </button>
          );
        })}
      </nav>

      <div className="p-6 mt-auto">
        <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500/5 to-purple-500/5 border border-blue-500/10">
          <p className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 mb-2">Pro Plan</p>
          <div className="flex items-center justify-between">
             <span className="text-xs text-zinc-300">Unlimited AI usage</span>
             <Sparkles size={12} className="text-blue-400" />
          </div>
        </div>
        <div className="flex items-center space-x-3 mt-6 px-2 opacity-60 hover:opacity-100 transition-opacity cursor-pointer">
          <UserCircle size={24} className="text-zinc-400" />
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-white">User Account</span>
            <span className="text-[10px] text-zinc-500">Free Tier</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
