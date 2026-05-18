import React, { useState } from 'react';
import { 
  BrainCircuit, 
  Volume2, 
  RefreshCw, 
  Star, 
  Search, 
  Globe,
  Database
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AIResponse, ApiConfig } from '../types/api.types';
import { VocabEntry, AIWordAnalysis } from '../types/vocab.types';
import { GeminiService } from '../services/gemini.service';
import { SpeechService } from '../services/speech.service';
import { GrammarDetectorService } from '../services/grammarDetector.service';
import { cn } from '../lib/utils';

interface HomeProps {
  apiConfig: ApiConfig;
  vocabDB: VocabEntry[];
  onSetSelectedWord: (word: AIWordAnalysis | VocabEntry) => void;
  onMarkWeak: (word: string) => void;
  onMarkInputAsWeak: (input: string) => void;
}

export const Home: React.FC<HomeProps> = ({ 
  apiConfig, 
  vocabDB, 
  onSetSelectedWord, 
  onMarkWeak,
  onMarkInputAsWeak
}) => {
  const [inputWords, setInputWords] = useState('');
  const [difficulty, setDifficulty] = useState('normal');
  const [style, setStyle] = useState('daily life');
  const [topic, setTopic] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [aiResult, setAiResult] = useState<AIResponse | null>(null);
  const [showAiTranslation, setShowAiTranslation] = useState(false);

  const handleGenerate = async () => {
    if (apiConfig.keys.length === 0) {
      alert("Vui lòng thiết lập API Key trong cài đặt.");
      return;
    }
    if (!inputWords.trim()) {
      alert("Vui lòng nhập ít nhất một từ vựng trước khi tạo bài học.");
      return;
    }

    setIsLoading(true);
    const gemini = new GeminiService(apiConfig);
    const prompt = `Bạn là một giáo viên tiếng Hàn chuyên nghiệp cho người Việt Nam. 
Hãy viết một đoạn văn ngắn tự nhiên bằng tiếng Hàn (khoảng 300-500 ký tự) dựa trên các yêu cầu sau:
- Các từ vựng bắt buộc: ${inputWords}
- Độ khó: ${difficulty}
- Phong cách: ${style}
- Chủ đề: ${topic || 'Tự do'}

Yêu cầu output là một JSON object duy nhất, không có markdown wrapper, với cấu trúc:
{
  "korean_text": "đoạn văn tiếng Hàn",
  "vietnamese_translation": "bản dịch tiếng Việt tự nhiên",
  "word_analysis": [
    {
      "surface": "từ xuất hiện trong đoạn",
      "base": "từ gốc (dictionary form)",
      "meaning_in_context_vi": "nghĩa trong ngữ cảnh hiện tại",
      "pos": "loại từ",
      "synonym": "từ đồng nghĩa",
      "antonym": "từ trái nghĩa",
      "example": "ví dụ câu"
    }
  ],
  "grammar_analysis": [
    {
      "pattern": "ngữ pháp",
      "sentence": "câu mẫu",
      "meaning_vi": "nghĩa",
      "usage_vi": "cách dùng"
    }
  ]
}

Bắt buộc trả về JSON hợp lệ.`;

    try {
      const result = await gemini.generate(prompt);
      setAiResult(result);
      setShowAiTranslation(false);
    } catch (err) {
      console.error(err);
      const message = err instanceof Error ? err.message : "Lỗi không xác định";
      console.warn(`[GeminiService] Thất bại: ${message}. Chuyển sang chế độ Offline.`);
      handleGenerateOffline();
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateOffline = () => {
    const tokens = inputWords.split(',').map(s => s.trim()).filter(Boolean);
    const found = tokens.map(t => vocabDB.find(v => v.k === t)).filter(Boolean) as VocabEntry[];
    
    setAiResult({
      korean_text: tokens.join(' ') + ". (Chế độ Offline)",
      vietnamese_translation: "Dịch (Offline): " + found.map(v => v.vi).join(', '),
      word_analysis: found.map(v => ({
        surface: v.k,
        base: v.base,
        meaning_in_context_vi: v.vi,
        pos: v.pos,
        synonym: v.synonyms.join(', '),
        antonym: v.antonyms.join(', '),
        example: v.examples[0]?.kr || ''
      })),
      grammar_analysis: []
    });
  };

  const scanGrammar = () => {
    if (!aiResult) return;
    const detected = GrammarDetectorService.detect(aiResult.korean_text);
    if (detected.length === 0) {
      alert("Không tìm thấy mẫu ngữ pháp quen thuộc trong văn bản này.");
      return;
    }
    setAiResult({
      ...aiResult,
      grammar_analysis: [...aiResult.grammar_analysis, ...detected]
    });
    alert(`Đã phát hiện thêm ${detected.length} mẫu ngữ pháp.`);
  };

  return (
    <div className="flex flex-1 overflow-hidden">
      <aside className="w-[320px] bg-brand-card border-r border-brand-border p-5 flex flex-col gap-5 overflow-y-auto shrink-0">
        <section>
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">Từ vựng hôm nay</label>
          <textarea 
            value={inputWords}
            onChange={e => setInputWords(e.target.value)}
            className="w-full h-32 bg-brand-bg border border-brand-border-input rounded-lg p-3 text-sm focus:border-brand-accent outline-none font-medium transition-colors resize-none text-slate-200" 
            placeholder="Ví dụ: 쇠고기, 요리하다, 시장..."
          />
        </section>

        <section className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">Mức độ</label>
            <select 
              value={difficulty}
              onChange={e => setDifficulty(e.target.value)}
              className="w-full bg-brand-bg border border-brand-border-input rounded-md p-2 text-sm outline-none text-slate-300"
            >
              <option value="easy">TOPIK I</option>
              <option value="normal">Thông thường</option>
              <option value="hard">TOPIK II</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">Văn phong</label>
            <select 
              value={style}
              onChange={e => setStyle(e.target.value)}
              className="w-full bg-brand-bg border border-brand-border-input rounded-md p-2 text-sm outline-none text-slate-300"
            >
              <option value="daily life">Hằng ngày</option>
              <option value="work">Công việc</option>
              <option value="TOPIK">TOPIK</option>
            </select>
          </div>
        </section>

        <section>
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">Chủ đề (Topic)</label>
          <input 
            type="text" 
            value={topic}
            onChange={e => setTopic(e.target.value)}
            className="w-full bg-brand-bg border border-brand-border-input rounded-md p-2 text-sm outline-none text-slate-300" 
            placeholder="Nhập chủ đề..."
          />
        </section>

        <div className="space-y-3">
          <button 
            onClick={handleGenerate}
            disabled={isLoading}
            className="w-full py-3 bg-brand-accent hover:bg-brand-accent-deep text-white font-bold rounded-lg transition-all shadow-lg shadow-brand-accent/10 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? <RefreshCw className="animate-spin" size={18} /> : <BrainCircuit size={18} />}
            <span>{isLoading ? "ĐANG TẠO..." : "TẠO VĂN BẢN AI"}</span>
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button 
              onClick={() => onMarkInputAsWeak(inputWords)}
              className="py-2 bg-rose-500/10 text-rose-400 rounded border border-rose-500/20 text-[10px] font-bold hover:bg-rose-500/20 transition-all flex items-center justify-center gap-1"
            >
              <Star size={12} /> MARK WEAK
            </button>
            <button 
              onClick={handleGenerateOffline}
              className="py-2 bg-slate-500/10 text-slate-400 rounded border border-slate-500/20 text-[10px] font-bold hover:bg-slate-500/20 transition-all"
            >
              OFFLINE GEN
            </button>
          </div>
          <button 
            onClick={scanGrammar}
            className="w-full py-2 bg-violet-500/10 text-violet-400 rounded border border-violet-500/20 text-[10px] font-bold hover:bg-violet-500/20 transition-all flex items-center justify-center gap-2"
          >
            <Search size={12} /> SCAN GRAMMAR
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8 flex flex-col gap-6 overflow-y-auto">
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <span className="px-2 py-1 bg-brand-popup rounded text-[10px] text-slate-400 font-mono flex items-center gap-1 uppercase">
              <BrainCircuit size={10} /> AI_ENGINE_V3
            </span>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setShowAiTranslation(!showAiTranslation)}
              className={cn(
                "px-3 py-1.5 text-xs rounded transition-all border",
                showAiTranslation ? "bg-brand-accent/20 text-brand-accent border-brand-accent/30" : "bg-brand-popup text-slate-400 border-brand-border-input hover:text-brand-accent"
              )}
            >
              Dịch nghĩa
            </button>
            <button 
              onClick={() => SpeechService.speak(aiResult?.korean_text || "")}
              className="p-1.5 bg-brand-popup rounded-full text-slate-400 hover:text-white border border-brand-border-input transition-all"
            >
              <Volume2 size={16} />
            </button>
          </div>
        </div>

        <div className="bg-brand-card rounded-2xl p-10 border border-brand-border shadow-2xl min-h-[300px] flex items-center justify-center relative group">
          {aiResult ? (
            <div className="w-full">
              <div className="text-2xl leading-[2.2] font-medium text-slate-100 flex flex-wrap gap-x-2 gap-y-3">
                {aiResult.korean_text.split(/(\s+)/).map((part, idx) => {
                  if (part.match(/^\s+$/)) return <span key={idx} className="w-0"></span>;
                  const clean = part.trim().replace(/[.,!?;:]/g, '');
                  const analysis = aiResult.word_analysis.find(a => a.surface === clean || a.base === clean || clean.startsWith(a.base));
                  const isKeyword = inputWords.split(',').some(w => clean.includes(w.trim()));

                  return analysis ? (
                    <motion.span 
                      key={idx} 
                      whileHover={{ y: -2 }}
                      onClick={() => onSetSelectedWord(analysis)}
                      className={cn(
                        "cursor-pointer transition-all px-2 py-0.5 rounded-lg border-b-2 select-none",
                        isKeyword 
                          ? "text-brand-accent border-brand-accent bg-brand-accent/10 hover:bg-brand-accent/20" 
                          : "text-white border-white/5 hover:border-brand-accent/50 hover:bg-brand-accent/5"
                      )}
                    >
                      {part}
                    </motion.span>
                  ) : <span key={idx} className="text-slate-400">{part}</span>;
                })}
              </div>
              
              <AnimatePresence>
                {showAiTranslation && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-8 pt-8 border-t border-brand-border-input"
                  >
                    <p className="text-sm text-slate-400 italic leading-relaxed bg-brand-bg/30 p-4 rounded-lg border border-brand-border-input">
                      <Globe size={14} className="inline mr-2 opacity-50" />
                      {aiResult.vietnamese_translation}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="text-center space-y-4 opacity-50">
              <BrainCircuit size={48} className="mx-auto text-brand-accent" />
              <p className="text-slate-400 font-medium">Nhập từ vựng để bắt đầu tạo bài học AI</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-3 gap-4 mt-auto">
          <div className="bg-brand-card border border-brand-border p-5 rounded-xl shadow-lg">
            <h4 className="text-[10px] font-bold text-brand-accent uppercase tracking-widest mb-3">Ngữ pháp phát hiện</h4>
            <div className="space-y-2">
              {aiResult?.grammar_analysis.map((g, i) => (
                <div key={i}>
                  <p className="text-xs text-slate-200 font-bold">{g.pattern}</p>
                  <p className="text-[10px] text-slate-500">{g.meaning_vi}</p>
                </div>
              ))}
              {!aiResult && <p className="text-[10px] text-slate-600 italic">Trống</p>}
            </div>
          </div>
          
          <div className="bg-brand-card border border-brand-border p-5 rounded-xl shadow-lg">
            <h4 className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-3">Phân tích từ vựng</h4>
            <div className="flex flex-wrap gap-2">
              {aiResult?.word_analysis.slice(0, 5).map((w, i) => (
                <span key={i} className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[10px] rounded border border-emerald-500/20">
                  {w.surface}
                </span>
              ))}
              {!aiResult && <p className="text-[10px] text-slate-600 italic">Trống</p>}
            </div>
          </div>

          <div className="bg-brand-card border border-brand-border p-5 rounded-xl shadow-lg">
            <h4 className="text-[10px] font-bold text-amber-500 uppercase tracking-widest mb-3">Hỗ trợ học tập</h4>
            <p className="text-[10px] text-slate-400 leading-relaxed italic">
              {aiResult 
                ? `Hệ thống đã phân tích ${aiResult.word_analysis.length} từ vựng và ${aiResult.grammar_analysis.length} cấu trúc.`
                : "Bắt đầu bài học để nhận phân tích chi tiết."}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};
