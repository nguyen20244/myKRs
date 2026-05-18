import React, { useState } from 'react';
import { Database, Key, ChevronDown } from 'lucide-react';
import { ApiConfig } from '../types/api.types';
import { cn } from '../lib/utils';

interface SettingsProps {
  apiConfig: ApiConfig;
  setApiConfig: (config: ApiConfig) => void;
  vocabDBLength: number;
  grammarCount: number;
  onBulkImport: (data: string) => void;
  onResetDB: () => void;
}

const GEMINI_MODELS = [
  'gemini-2.0-flash',
  'gemini-2.0-flash-lite',
  'gemini-1.5-flash',
  'gemini-1.5-pro',
];

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
    if (keys.length === 0) {
      alert("Vui lòng nhập ít nhất một API key hợp lệ.");
      return;
    }
    setApiConfig({ ...apiConfig, keys });
    alert(`Đã lưu ${keys.length} API key.`);
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
              <div className="relative">
                <select
                  value={GEMINI_MODELS.includes(apiConfig.model) ? apiConfig.model : 'custom'}
                  onChange={e => {
                    if (e.target.value !== 'custom') setApiConfig({ ...apiConfig, model: e.target.value });
                  }}
                  className="w-full bg-brand-bg border border-brand-border-input rounded-xl p-3 text-sm focus:border-brand-accent outline-none text-white font-mono appearance-none pr-8"
                >
                  {GEMINI_MODELS.map(m => <option key={m} value={m}>{m}</option>)}
                  {!GEMINI_MODELS.includes(apiConfig.model) && (
                    <option value="custom">{apiConfig.model} (custom)</option>
                  )}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="text-[10px] text-slate-500 uppercase font-bold mb-2 block tracking-widest">Model tùy chỉnh</label>
              <input
                value={apiConfig.model}
                onChange={e => setApiConfig({ ...apiConfig, model: e.target.value })}
                className="w-full bg-brand-bg border border-brand-border-input rounded-xl p-3 text-sm focus:border-brand-accent outline-none text-white font-mono"
                placeholder="gemini-2.0-flash"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] text-slate-500 uppercase font-bold mb-2 block tracking-widest">
              API Keys <span className="text-slate-600 normal-case">(Mỗi dòng 1 key — sẽ xoay vòng khi lỗi)</span>
            </label>
            <textarea
              value={keyInput}
              onChange={e => setKeyInput(e.target.value)}
              placeholder="Dán các API keys vào đây..."
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
            <label className="text-[10px] text-slate-500 uppercase font-bold mb-2 block tracking-widest">
              Nhập từ vựng hàng loạt <span className="normal-case text-slate-600">(cột phân cách bằng TAB)</span>
            </label>
            <p className="text-[10px] text-slate-600 mb-2 font-mono">Từ ⇥ Phát âm ⇥ Loại từ ⇥ Nghĩa Việt ⇥ Định nghĩa Hàn ⇥ Giải thích Việt</p>
            <textarea
              value={bulkInput}
              onChange={e => setBulkInput(e.target.value)}
              placeholder={"가다\t[가다]\t동사\tđi\t이동하다\tĐộng từ chỉ sự di chuyển"}
              className="w-full h-32 bg-brand-bg border border-brand-border-input rounded-xl p-4 text-xs focus:border-brand-accent outline-none text-slate-300 font-mono"
            />
            <button
              onClick={() => {
                if (!bulkInput.trim()) { alert("Không có dữ liệu để nhập."); return; }
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
              if (confirm("Reset database về mặc định? Mọi từ vựng và API key đã thêm sẽ bị xóa.")) {
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


