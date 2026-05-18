import React, { useState } from 'react';
import { Database, Key, AlertCircle, CheckCircle2, X } from 'lucide-react';
import { ApiConfig } from '../types/api.types';
import { useVocabulary } from '../hooks/useVocabulary';
import { cn } from '../lib/utils';

interface SettingsProps {
  apiConfig: ApiConfig;
  setApiConfig: (config: ApiConfig) => void;
  vocabDBLength: number;
  grammarCount: number;
  onBulkImport: (data: string) => void;
  onResetDB: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ 
  apiConfig, 
  setApiConfig, 
  vocabDBLength, 
  grammarCount,
  onBulkImport,
  onResetDB
}) => {
  const [keyInput, setKeyInput] = useState(apiConfig.keys.join('\n'));
  const [bulkInput, setBulkInput] = useState('');

  const saveKeys = () => {
    const keys = keyInput.split('\n').map(k => k.trim()).filter(Boolean);
    setApiConfig({ ...apiConfig, keys });
    alert("Đã lưu API Keys mới.");
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-6 space-y-10">
      <section className="bg-brand-card p-10 rounded-3xl border border-brand-border shadow-2xl">
        <div className="flex items-center gap-5 mb-10">
          <div className="w-14 h-14 bg-brand-accent/10 rounded-2xl flex items-center justify-center text-brand-accent">
            <Key size={28} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">AI Configuration</h2>
            <p className="text-xs text-slate-500">Quản lý kết nối Gemini API</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] text-slate-500 uppercase font-bold mb-2 block tracking-widest">Model</label>
              <input 
                value={apiConfig.model}
                onChange={e => setApiConfig({...apiConfig, model: e.target.value})}
                className="w-full bg-brand-bg border border-brand-border-input rounded-xl p-3 text-sm focus:border-brand-accent outline-none text-white font-mono"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] text-slate-500 uppercase font-bold mb-2 block tracking-widest">API Keys (Mỗi dòng 1 key)</label>
            <textarea 
              value={keyInput}
              onChange={e => setKeyInput(e.target.value)}
              placeholder="Dán các API keys..."
              className="w-full h-32 bg-brand-bg border border-brand-border-input rounded-xl p-4 text-xs font-mono focus:border-brand-accent outline-none text-slate-300 resize-none"
            />
            <button 
              onClick={saveKeys}
              className="w-full mt-4 py-3 bg-brand-accent hover:bg-brand-accent-deep text-white font-bold rounded-xl text-xs transition-all uppercase tracking-widest"
            >
              Cập nhật Keys
            </button>
          </div>
        </div>
      </section>

      <section className="bg-brand-card p-10 rounded-3xl border border-brand-border shadow-2xl">
        <div className="flex items-center gap-5 mb-10">
          <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500">
            <Database size={28} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Database Management</h2>
            <p className="text-xs text-emerald-600">Hệ thống có {vocabDBLength} từ & {grammarCount} ngữ pháp</p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="text-[10px] text-slate-500 uppercase font-bold mb-2 block tracking-widest">Nhập từ vựng hàng loạt (TAB)</label>
            <textarea 
              value={bulkInput}
              onChange={e => setBulkInput(e.target.value)}
              placeholder="Từ <tab> Phát âm <tab> Loại từ <tab> Nghĩa..."
              className="w-full h-32 bg-brand-bg border border-brand-border-input rounded-xl p-4 text-xs focus:border-brand-accent outline-none text-slate-300 font-mono"
            />
            <button 
              onClick={() => {
                onBulkImport(bulkInput);
                setBulkInput('');
                alert("Đã nhập dữ liệu thành công!");
              }}
              className="w-full mt-4 py-3 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl text-xs font-bold hover:bg-emerald-500/20 transition-all uppercase tracking-widest"
            >
              Tiến hành nạp dữ liệu
            </button>
          </div>

          <button 
            onClick={() => {
              if (confirm("Reset database về mặc định? Mọi thay đổi của bạn sẽ mất.")) {
                onResetDB();
                window.location.reload();
              }
            }}
            className="w-full py-3 bg-rose-500/5 text-rose-500 border border-rose-500/20 rounded-xl text-[10px] font-bold hover:bg-rose-500/10 transition-all uppercase tracking-widest"
          >
            Reset To Default
          </button>
        </div>
      </section>
    </div>
  );
};
