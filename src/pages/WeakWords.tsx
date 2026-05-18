import React from 'react';
import { Star, Trash2, Volume2 } from 'lucide-react';
import { VocabEntry } from '../types/vocab.types';
import { SpeechService } from '../services/speech.service';

interface WeakWordsProps {
  weakWords: string[];
  vocabDB: VocabEntry[];
  onUnmarkWeak: (word: string) => void;
  onSetSelectedWord: (word: VocabEntry) => void;
}

export const WeakWords: React.FC<WeakWordsProps> = ({ weakWords, vocabDB, onUnmarkWeak, onSetSelectedWord }) => {
  const weakEntries = weakWords.map(w => vocabDB.find(v => v.k === w)).filter(Boolean) as VocabEntry[];

  return (
    <div className="max-w-4xl mx-auto py-10 px-6 space-y-10">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-rose-500/10 rounded-xl text-rose-500">
          <Star size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Danh sách Từ yếu</h2>
          <p className="text-xs text-slate-500">Bạn đang gặp khó khăn với {weakWords.length} từ vựng</p>
        </div>
      </div>

      {weakEntries.length === 0 ? (
        <div className="text-center py-32 opacity-20">
          <Star size={64} className="mx-auto mb-4" />
          <p className="text-lg">Chúc mừng! Bạn chưa có từ yếu nào.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {weakEntries.map((v, i) => (
            <div 
              key={i} 
              onClick={() => onSetSelectedWord(v)}
              className="bg-brand-card p-6 rounded-2xl border border-brand-border hover:border-rose-500/30 transition-all cursor-pointer relative group"
            >
              <div className="flex justify-between items-start mb-2">
                <h4 className="text-xl font-bold text-white group-hover:text-rose-400">{v.k}</h4>
                <div className="flex gap-1">
                  <button 
                    onClick={(e) => { e.stopPropagation(); SpeechService.speak(v.k); }}
                    className="p-1.5 text-slate-600 hover:text-indigo-400"
                  >
                    <Volume2 size={14} />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); onUnmarkWeak(v.k); }}
                    className="p-1.5 text-slate-600 hover:text-rose-500"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <p className="text-sm text-slate-400 mb-4">{v.vi}</p>
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-brand-border/50">
                <span className="text-[10px] text-slate-600 font-mono italic">{v.p}</span>
                <span className="text-[10px] bg-brand-bg px-2 py-0.5 rounded text-rose-400/50 border border-brand-border">Level {v.level}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
