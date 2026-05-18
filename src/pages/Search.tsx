import React, { useState } from 'react';
import { Search as SearchIcon, Volume2, ArrowRight } from 'lucide-react';
import { VocabEntry } from '../types/vocab.types';
import { SpeechService } from '../services/speech.service';

interface SearchProps {
  vocabDB: VocabEntry[];
  onSetSelectedWord: (word: VocabEntry) => void;
}

export const Search: React.FC<SearchProps> = ({ vocabDB, onSetSelectedWord }) => {
  const [query, setQuery] = useState('');
  const results = vocabDB.filter(v => v.k.includes(query) || v.vi.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="space-y-12 max-w-4xl mx-auto py-10 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="relative group">
          <SearchIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-brand-accent transition-colors" size={20} />
          <input 
            type="text"
            placeholder="Tìm kiếm từ vựng (Hàn hoặc Việt)..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full bg-brand-card border border-brand-border rounded-full py-5 pl-16 pr-8 text-lg font-medium text-white focus:border-brand-accent outline-none shadow-2xl transition-all placeholder:text-slate-600"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {results.slice(0, 20).map((v, i) => (
          <div 
            key={i} 
            onClick={() => onSetSelectedWord(v)}
            className="bg-brand-card p-6 rounded-2xl border border-brand-border hover:border-brand-accent/50 transition-all cursor-pointer group hover:shadow-xl"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="text-2xl font-bold text-white group-hover:text-brand-accent transition-colors">{v.k}</h4>
                <p className="text-xs text-slate-500 font-mono">/{v.p}/</p>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); SpeechService.speak(v.k); }}
                className="p-2 bg-brand-bg rounded-lg text-slate-500 hover:text-brand-accent transition-colors border border-brand-border"
              >
                <Volume2 size={16} />
              </button>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-slate-300 font-semibold line-clamp-1">{v.vi}</p>
              <p className="text-[10px] text-slate-600 line-clamp-2 italic">{v.videf}</p>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-[10px] bg-brand-bg px-2 py-0.5 rounded text-indigo-400 font-bold border border-brand-border">{v.pos}</span>
              <ArrowRight size={14} className="text-slate-700 group-hover:text-brand-accent transition-all" />
            </div>
          </div>
        ))}
      </div>
      
      {results.length === 0 && (
        <div className="text-center py-20 opacity-30">
          <SearchIcon size={48} className="mx-auto mb-4" />
          <p className="text-slate-400">Không tìm thấy từ vựng nào phù hợp.</p>
        </div>
      )}
    </div>
  );
};
