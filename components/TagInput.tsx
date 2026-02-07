
import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}

const TagInput: React.FC<TagInputProps> = ({ tags, onChange, placeholder = "Add tag..." }) => {
  const [input, setInput] = useState('');

  const addTag = () => {
    const trimmed = input.trim();
    if (trimmed && !tags.includes(trimmed)) {
      onChange([...tags, trimmed]);
      setInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    onChange(tags.filter(t => t !== tagToRemove));
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {tags.map(tag => (
          <span 
            key={tag} 
            className="flex items-center space-x-1 bg-slate-800 text-slate-300 px-2 py-1 rounded-md text-xs border border-slate-700"
          >
            <span>{tag}</span>
            <button onClick={() => removeTag(tag)} className="hover:text-red-400 transition-colors">
              <X size={12} />
            </button>
          </span>
        ))}
      </div>
      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
          placeholder={placeholder}
          className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
        />
        <button 
          onClick={addTag}
          className="p-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors"
        >
          <Plus size={18} />
        </button>
      </div>
    </div>
  );
};

export default TagInput;
