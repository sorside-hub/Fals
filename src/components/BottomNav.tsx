import React from 'react';
import { TabType } from '../types';
import { BookOpen, PenLine, Sparkles, Sliders } from 'lucide-react';

interface BottomNavProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  bankBarCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onSelectTab,
  bankBarCount,
}) => {
  const tabs: { id: TabType; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'learn', label: 'Teori', icon: BookOpen },
    { id: 'lyrics', label: 'Lirik', icon: PenLine },
    { id: 'bank', label: 'Amunisi', icon: Sparkles },
    { id: 'tools', label: 'Alat', icon: Sliders },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FAF9F5]/95 backdrop-blur-md border-t border-[#E5E4DE] pb-safe shadow-md">
      <div className="grid grid-cols-4 h-12 max-w-lg mx-auto items-center">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex flex-col items-center justify-center h-full relative transition-colors cursor-pointer py-1 ${
                isActive ? 'text-[#1C1917]' : 'text-[#78716C] hover:text-[#44403C]'
              }`}
            >
              <div className="relative">
                <Icon className={`w-4 h-4 transition-transform ${isActive ? 'scale-105' : ''}`} />
                {tab.id === 'bank' && bankBarCount > 0 && (
                  <span className="absolute -top-1 -right-2 text-[8px] font-mono font-bold bg-[#1C1917] text-[#FAF9F5] w-3 h-3 rounded-full flex items-center justify-center">
                    {bankBarCount > 9 ? '9+' : bankBarCount}
                  </span>
                )}
              </div>
              <span className={`text-[9.5px] tracking-tight mt-0.5 font-medium leading-none ${isActive ? 'font-bold' : ''}`}>
                {tab.label}
              </span>
              {isActive && (
                <span className="absolute bottom-0.5 w-4 h-0.5 bg-[#1C1917] rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
