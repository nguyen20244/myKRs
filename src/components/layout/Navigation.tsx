import React from 'react';
import { 
  BookOpen, 
  Settings, 
  Gamepad2, 
  Search, 
  Star,
  Globe
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
}

export const Navigation: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'context', icon: Globe, label: 'Luyện tập' },
    { id: 'search', icon: Search, label: 'Từ điển' },
    { id: 'grammar', icon: BookOpen, label: 'Ngữ pháp' },
    { id: 'flashcards', icon: Gamepad2, label: 'Flashcards' },
    { id: 'weak', icon: Star, label: 'Từ yếu' },
    { id: 'settings', icon: Settings, label: 'Cài đặt' },
  ];

  return (
    <nav className="w-16 md:w-20 bg-brand-card border-r border-brand-border flex flex-col items-center py-8 gap-6 shrink-0">
      <div className="w-10 h-10 md:w-12 md:h-12 bg-brand-accent rounded-2xl flex items-center justify-center text-white shadow-lg shadow-brand-accent/20 mb-4 cursor-pointer hover:rotate-3 transition-transform">
        <Globe size={24} />
      </div>
      
      <div className="flex-1 flex flex-col gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "group relative p-3 md:p-4 rounded-xl transition-all duration-300",
              activeTab === tab.id 
                ? "bg-brand-accent/10 text-brand-accent" 
                : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
            )}
            title={tab.label}
          >
            <tab.icon size={22} className={cn(activeTab === tab.id ? "scale-110" : "transition-transform group-hover:scale-105")} />
            {activeTab === tab.id && (
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-brand-accent rounded-l-full shadow-[0_0_15px_rgba(33,150,243,0.5)]"></div>
            )}
          </button>
        ))}
      </div>
    </nav>
  );
};
