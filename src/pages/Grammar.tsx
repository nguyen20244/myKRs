import React from 'react';
import { BookOpen, ChevronRight } from 'lucide-react';
import { INITIAL_GRAMMAR } from '../data/grammar';

export const Grammar: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-10 px-6 space-y-10">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-brand-accent/10 rounded-xl text-brand-accent">
          <BookOpen size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Thư viện Ngữ pháp</h2>
          <p className="text-xs text-slate-500">Tổng cộng {INITIAL_GRAMMAR.length} mẫu ngữ pháp cốt lõi</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {INITIAL_GRAMMAR.map((g, i) => (
          <div key={i} className="bg-brand-card rounded-3xl border border-brand-border p-8 hover:shadow-2xl transition-all">
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="text-[10px] font-bold text-brand-accent uppercase tracking-widest bg-brand-accent/10 px-2 py-0.5 rounded">Level {g.level}</span>
                <h3 className="text-2xl font-black text-white mt-2">{g.pattern}</h3>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div>
                  <h4 className="text-[10px] uppercase text-slate-500 font-bold mb-1 tracking-widest">Ý nghĩa</h4>
                  <p className="text-emerald-400 font-bold">{g.meaning_vi}</p>
                </div>
                <div>
                  <h4 className="text-[10px] uppercase text-slate-500 font-bold mb-1 tracking-widest">Cách dùng</h4>
                  <p className="text-sm text-slate-300 leading-relaxed">{g.usage_vi}</p>
                </div>
              </div>

              <div className="bg-brand-bg/50 rounded-2xl p-6 border border-brand-border">
                <h4 className="text-[10px] uppercase text-indigo-400 font-bold mb-3 tracking-widest">Ví dụ điển hình</h4>
                <div className="space-y-4">
                  {g.examples.map((ex, idx) => (
                    <div key={idx} className="space-y-1">
                      <p className="text-sm font-medium text-white">{ex.kr}</p>
                      <p className="text-xs text-slate-500 italic">{ex.vi}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
