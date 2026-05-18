import React, { useState } from 'react';
import { Navigation } from './components/layout/Navigation';
import { Home } from './pages/Home';
import { Search } from './pages/Search';
import { Grammar } from './pages/Grammar';
import { Flashcards } from './pages/Flashcards';
import { WeakWords } from './pages/WeakWords';
import { Settings } from './pages/Settings';
import { WordPopup } from './components/popup/WordPopup';
import { useVocabulary } from './hooks/useVocabulary';
import { useLocalStorage } from './hooks/useLocalStorage';
import { STORAGE_KEYS } from './services/storage.service';
import { ApiConfig } from './types/api.types';
import { VocabEntry, AIWordAnalysis } from './types/vocab.types';
import { INITIAL_GRAMMAR } from './data/grammar';

type TabType = 'context' | 'search' | 'grammar' | 'flashcards' | 'weak' | 'settings';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('context');
  const [selectedWord, setSelectedWord] = useState<VocabEntry | AIWordAnalysis | null>(null);
  
  const { 
    vocabDB, 
    weakWords, 
    markWeak, 
    unmarkWeak, 
    bulkImport,
    setVocabDB
  } = useVocabulary();

  const [apiConfig, setApiConfig] = useLocalStorage<ApiConfig>(STORAGE_KEYS.API_CONFIG, {
    keys: [],
    provider: 'gemini',
    model: 'gemini-2.0-flash'
  });

  const renderTab = () => {
    switch (activeTab) {
      case 'context':
        return (
          <Home 
            apiConfig={apiConfig} 
            vocabDB={vocabDB}
            onSetSelectedWord={setSelectedWord}
            onMarkWeak={markWeak}
            onMarkInputAsWeak={(input) => {
              const words = input.split(',').map(w => w.trim()).filter(Boolean);
              words.forEach(w => markWeak(w));
              alert(`Đã gán ${words.length} từ vào danh sách yếu.`);
            }}
          />
        );
      case 'search':
        return <Search vocabDB={vocabDB} onSetSelectedWord={setSelectedWord} />;
      case 'grammar':
        return <Grammar />;
      case 'flashcards':
        return (
          <Flashcards 
            vocabDB={vocabDB} 
            onMarkWeak={markWeak} 
            onUnmarkWeak={unmarkWeak} 
          />
        );
      case 'weak':
        return (
          <WeakWords 
            weakWords={weakWords} 
            vocabDB={vocabDB} 
            onUnmarkWeak={unmarkWeak}
            onSetSelectedWord={setSelectedWord}
          />
        );
      case 'settings':
        return (
          <Settings 
            apiConfig={apiConfig}
            setApiConfig={setApiConfig}
            vocabDBLength={vocabDB.length}
            grammarCount={INITIAL_GRAMMAR.length}
            onBulkImport={bulkImport}
            onResetDB={() => {
              localStorage.removeItem(STORAGE_KEYS.VOCAB_DB);
              localStorage.removeItem(STORAGE_KEYS.WEAK_WORDS);
              localStorage.removeItem(STORAGE_KEYS.API_CONFIG);
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-brand-bg text-slate-200 font-sans selection:bg-brand-accent/30 selection:text-brand-accent">
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {renderTab()}
        
        <WordPopup 
          selectedWord={selectedWord} 
          onClose={() => setSelectedWord(null)} 
          onMarkWeak={markWeak}
        />
      </main>
    </div>
  );
}
