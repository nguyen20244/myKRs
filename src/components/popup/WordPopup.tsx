import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Volume2, Database } from 'lucide-react';
import { VocabEntry, AIWordAnalysis } from '../../types/vocab.types';
import { SpeechService } from '../../services/speech.service';
import { cn } from '../../lib/utils';

interface WordPopupProps {
  selectedWord: AIWordAnalysis | VocabEntry | null;
  onClose: () => void;
  onMarkWeak: (word: string) => void;
}

export const WordPopup: React.FC<WordPopupProps> = ({ selectedWord, onClose, onMarkWeak }) => {
  if (!selectedWord) return null;
  
  const isFullEntry = 'k' in selectedWord;
  const wordText = isFullEntry ? (selectedWord as VocabEntry).k : (selectedWord as AIWordAnalysis).surface;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md" onClick={onClose}>
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="bg-brand-popup border border-brand-border-input w-[400px] max-w-full rounded-xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
        onClick={e => e.stopPropagation()}
      >
        <div className="bg-[#2D333F] p-4 flex items-center justify-between border-b border-brand-border-input">
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-bold text-white">{wordText}</h3>
            <span className="text-xs bg-brand-bg px-2 py-0.5 rounded text-slate-400">
              {isFullEntry ? (selectedWord as VocabEntry).p : (selectedWord as AIWordAnalysis).base}
            </span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="p-5 flex flex-col gap-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-brand-bg/50 p-3 rounded-lg border border-brand-border h-full">
              <span className="text-[10px] uppercase text-slate-500 font-bold block mb-1">Loại từ</span>
              <p className="text-sm text-indigo-300 font-semibold">
                {isFullEntry ? (selectedWord as VocabEntry).pos : (selectedWord as AIWordAnalysis).pos}
              </p>
            </div>
            <div className="bg-brand-bg/50 p-3 rounded-lg border border-brand-border h-full">
              <span className="text-[10px] uppercase text-slate-500 font-bold block mb-1">Dịch nghĩa</span>
              <p className="text-sm text-emerald-400 font-bold">
                {isFullEntry ? (selectedWord as VocabEntry).vi : (selectedWord as AIWordAnalysis).meaning_in_context_vi}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-brand-bg/30 p-4 rounded-xl border border-brand-border">
              <h4 className="text-[10px] uppercase text-brand-accent font-black mb-2 tracking-widest">Định nghĩa & Giải thích</h4>
              <div className="space-y-3">
                {isFullEntry ? (
                  <>
                    <div className="space-y-1">
                      <p className="text-[10px] text-slate-500 font-bold">KOREAN</p>
                      <p className="text-sm text-white leading-relaxed">{(selectedWord as VocabEntry).krdef}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] text-slate-500 font-bold">VIETNAMESE</p>
                      <p className="text-sm text-slate-300 leading-relaxed">{(selectedWord as VocabEntry).videf}</p>
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-slate-300 leading-relaxed italic">
                    Đây là từ vựng được AI phân tích trong đoạn văn. Nghĩa của từ có thể thay đổi linh hoạt tùy theo ngữ cảnh sử dụng.
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-brand-card p-3 rounded-lg border border-brand-border">
                <span className="text-[10px] uppercase text-slate-500 font-bold block mb-1">Đồng nghĩa</span>
                <p className="text-xs text-slate-400 truncate">
                  {isFullEntry 
                    ? (selectedWord as VocabEntry).synonyms.join(', ') || '---'
                    : (selectedWord as AIWordAnalysis).synonym || '---'}
                </p>
              </div>
              <div className="bg-brand-card p-3 rounded-lg border border-brand-border">
                <span className="text-[10px] uppercase text-slate-500 font-bold block mb-1">Trái nghĩa</span>
                <p className="text-xs text-slate-400 truncate">
                  {isFullEntry 
                    ? (selectedWord as VocabEntry).antonyms.join(', ') || '---'
                    : (selectedWord as AIWordAnalysis).antonym || '---'}
                </p>
              </div>
            </div>

            <div className="bg-indigo-500/5 p-4 rounded-xl border border-indigo-500/20">
              <h4 className="text-[10px] uppercase text-indigo-400 font-black mb-2 tracking-widest flex items-center gap-1">
                <Database size={10} /> Ví dụ minh họa
              </h4>
              <div className="space-y-2">
                <p className="text-sm text-white font-medium italic select-all">
                  {isFullEntry 
                    ? (selectedWord as VocabEntry).examples[0]?.kr 
                    : (selectedWord as AIWordAnalysis).example}
                </p>
                {isFullEntry && (
                  <p className="text-[10px] text-slate-500 italic">
                    {(selectedWord as VocabEntry).examples[0]?.vi}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-2 mt-2">
            <button 
              onClick={() => SpeechService.speak(wordText)}
              className="flex-1 py-2 bg-indigo-500/10 text-indigo-300 rounded border border-indigo-500/30 text-xs font-bold hover:bg-indigo-500/20 transition-all flex items-center justify-center gap-2"
            >
              <Volume2 size={14} /> PHÁT ÂM
            </button>
            <button 
              onClick={() => {
                onMarkWeak(wordText);
                onClose();
              }}
              className="flex-1 py-2 bg-rose-500/10 text-rose-400 rounded border border-rose-500/30 text-xs font-bold hover:bg-rose-500/20 transition-all"
            >
              TỪ VỰNG YẾU
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
