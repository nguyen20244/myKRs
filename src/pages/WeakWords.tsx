import React from 'react';
import { Star, Trash2, Volume2, AlertCircle } from 'lucide-react';
import { VocabEntry } from '../types/vocab.types';
import { SpeechService } from '../services/speech.service';

interface WeakWordsProps {
  weakWords: string[];
  vocabDB: VocabEntry[];
  onUnmarkWeak: (word: string) => void;
  onSetSelectedWord: (word: VocabEntry) => void;
}

export const WeakWords: React.FC<WeakWordsProps> = ({ weakWords, vocabDB, onUnmarkWeak, onSetSelectedWord }) => {
  const weakEntries = weakWords.map(w => ({
    word: w,
    entry: vocabDB.find(v => v.k === w) ?? null
  }));

  const withEntry = weakEntries.filter(e => e.entry !== null);
  const withoutEntry = weakEntries.filter(e => e.entry === null);

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

      {weakWords.length === 0 ? (
        <div className="text-center py-32 opacity-20">
          <Star size={64} className="mx-auto mb-4" />
          <p className="text-lg">Chúc mừng! Bạn chưa có từ yếu nào.</p>
        </div>
      ) : (
        <>
          {withEntry.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {withEntry.map(({ word, entry: v }, i) => (
                <div
                  key={i}
                  onClick={() => onSetSelectedWord(v!)}
                  className="bg-brand-card p-6 rounded-2xl border border-brand-border hover:border-rose-500/30 transition-all cursor-pointer relative group"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-xl font-bold text-white group-hover:text-rose-400">{v!.k}</h4>
                    <div className="flex gap-1">
                      <button
                        onClick={(e) => { e.stopPropagation(); SpeechService.speak(v!.k); }}
                        className="p-1.5 text-slate-600 hover:text-indigo-400"
                      >
                        <Volume2 size={14} />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); onUnmarkWeak(word); }}
                        className="p-1.5 text-slate-600 hover:text-rose-500"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-slate-400 mb-4">{v!.vi}</p>
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-brand-border/50">
                    <span className="text-[10px] text-slate-600 font-mono italic">{v!.p}</span>
                    <span className="text-[10px] bg-brand-bg px-2 py-0.5 rounded text-rose-400/50 border border-brand-border">Level {v!.level}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {withoutEntry.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle size={14} className="text-amber-500" />
                <p className="text-[10px] text-amber-500 font-bold uppercase tracking-widest">Từ AI (chưa có trong từ điển)</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {withoutEntry.map(({ word }, i) => (
                  <div key={i} className="flex items-center gap-1 px-3 py-1.5 bg-amber-500/5 border border-amber-500/20 rounded-xl group">
                    <span className="text-sm text-amber-300 font-bold">{word}</span>
                    <button
                      onClick={() => SpeechService.speak(word)}
                      className="text-slate-600 hover:text-indigo-400 ml-1"
                    >
                      <Volume2 size={12} />
                    </button>
                    <button
                      onClick={() => onUnmarkWeak(word)}
                      className="text-slate-700 hover:text-rose-500"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
