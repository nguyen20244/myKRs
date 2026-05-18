import React from 'react';
import { Volume2, BrainCircuit, X, CheckCircle2, ChevronLeft, ChevronRight, Shuffle, ListOrdered } from 'lucide-react';
import { motion } from 'motion/react';
import { VocabEntry } from '../types/vocab.types';
import { useFlashcards } from '../hooks/useFlashcards';
import { SpeechService } from '../services/speech.service';
import { cn } from '../lib/utils';

interface FlashcardsProps {
  vocabDB: VocabEntry[];
  onMarkWeak: (word: string) => void;
  onUnmarkWeak: (word: string) => void;
}

export const Flashcards: React.FC<FlashcardsProps> = ({ vocabDB, onMarkWeak, onUnmarkWeak }) => {
  const { index, sequenceIndex, total, isFlipped, isShuffleMode, next, prev, flip, shuffle, clearShuffle } = useFlashcards(vocabDB.length);
  const card = vocabDB[index];
  const progress = total > 0 ? ((sequenceIndex + 1) / total) * 100 : 0;

  if (!card) return <div className="text-center py-20 text-slate-500">Chưa có dữ liệu flashcards.</div>;

  return (
    <div className="max-w-xl mx-auto space-y-8 py-10 px-6">
      <div className="flex items-center justify-between text-slate-500">
        <div className="flex items-center gap-2">
          <BrainCircuit size={16} className="text-brand-accent animate-pulse" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Hệ thống Flashcards</span>
          {isShuffleMode && (
            <span className="text-[10px] bg-violet-500/10 text-violet-400 px-2 py-0.5 rounded border border-violet-500/20 font-bold">SHUFFLE</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono bg-brand-popup px-2 py-0.5 rounded border border-brand-border-input">{sequenceIndex + 1} / {vocabDB.length}</span>
          <button
            onClick={isShuffleMode ? clearShuffle : shuffle}
            title={isShuffleMode ? "Tắt shuffle" : "Shuffle ngẫu nhiên"}
            className={cn(
              "p-1.5 rounded transition-all border text-[10px]",
              isShuffleMode
                ? "bg-violet-500/20 text-violet-400 border-violet-500/30"
                : "bg-brand-popup text-slate-500 border-brand-border-input hover:text-violet-400"
            )}
          >
            {isShuffleMode ? <ListOrdered size={14} /> : <Shuffle size={14} />}
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1 bg-brand-border rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-brand-accent rounded-full"
          animate={{ width: `${progress}%` }}
          transition={{ type: 'spring', stiffness: 60 }}
        />
      </div>

      <div
        className="relative h-[440px] w-full perspective-1000 cursor-pointer"
        onClick={flip}
      >
        <motion.div
          className="absolute inset-0 bg-brand-card rounded-[2.5rem] border border-brand-border shadow-2xl flex flex-col items-center justify-center p-12 text-center"
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ type: 'spring', stiffness: 50, damping: 20 }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          <div className={cn("backface-hidden flex flex-col items-center gap-6", isFlipped && "opacity-0")}>
            <h2 className="text-7xl font-bold text-white tracking-tighter">{card.k}</h2>
            <p className="text-slate-400 text-xl font-medium">/{card.p}/</p>
            <button
              onClick={(e) => { e.stopPropagation(); SpeechService.speak(card.k); }}
              className="mt-6 p-5 bg-brand-popup hover:bg-brand-accent hover:text-white rounded-full text-brand-accent transition-all border border-brand-border-input"
            >
              <Volume2 size={32} />
            </button>
          </div>

          <div className={cn("backface-hidden absolute inset-0 rotate-y-180 flex flex-col items-center justify-center p-10", !isFlipped && "opacity-0")}>
            <div className="space-y-6 w-full text-center">
              <span className="inline-block text-[10px] uppercase font-bold text-brand-accent tracking-widest bg-brand-accent/10 px-3 py-1 rounded-full">{card.pos}</span>
              <h3 className="text-4xl font-bold text-white">{card.vi}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{card.videf}</p>
              <div className="bg-brand-bg/50 p-4 rounded-xl border border-brand-border-input">
                <p className="text-sm font-medium text-white">{card.examples[0]?.kr}</p>
                <p className="text-xs text-slate-500 italic mt-1">{card.examples[0]?.vi}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Navigation row */}
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={prev}
          className="p-3 bg-brand-popup border border-brand-border-input text-slate-400 rounded-2xl hover:text-white hover:bg-white/5 transition-all"
        >
          <ChevronLeft size={20} />
        </button>

        <div className="flex-1 grid grid-cols-2 gap-3">
          <button
            onClick={() => { onMarkWeak(card.k); next(); }}
            className="py-4 bg-rose-500/5 border border-rose-500/20 text-rose-400 rounded-2xl font-bold hover:bg-rose-500/10 transition-all flex items-center justify-center gap-2 text-xs uppercase"
          >
            <X size={18} /> Chưa thuộc
          </button>
          <button
            onClick={() => { onUnmarkWeak(card.k); next(); }}
            className="py-4 bg-emerald-500/5 border border-emerald-500/20 text-emerald-400 rounded-2xl font-bold hover:bg-emerald-500/10 transition-all flex items-center justify-center gap-2 text-xs uppercase"
          >
            <CheckCircle2 size={18} /> Đã thuộc
          </button>
        </div>

        <button
          onClick={next}
          className="p-3 bg-brand-popup border border-brand-border-input text-slate-400 rounded-2xl hover:text-white hover:bg-white/5 transition-all"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};
