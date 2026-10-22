import React from 'react';
import { TabType } from '../types';
import { PWAInstallButton } from './PWAInstallButton';
import { sound } from '../utils/audioEngine';
import { Volume2, VolumeX, Sparkles } from 'lucide-react';

interface TopBarProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentTab,
  onSelectTab,
  isMuted,
  onToggleMute,
}) => {
  return (
    <header className="sticky top-0 z-30 w-full bg-[#FAF9F5]/90 backdrop-blur-md border-b border-[#E5E4DE] px-4 sm:px-8 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
        {/* Zone 1: Single element Brand Wordmark */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => onSelectTab('learn')}
            className="flex items-center gap-2 cursor-pointer text-left focus:outline-hidden"
          >
            <span className="text-xl font-bold tracking-tight text-[#1C1917] font-mono whitespace-nowrap">
              FALS
            </span>
            <span className="hidden sm:inline-block text-[11px] font-mono text-[#78716C] border-l border-[#E5E4DE] pl-2">
              Teori Nada & Studio Bar
            </span>
          </button>
        </div>

        {/* Zone 2: 4 single-line nav links (Desktop/Tablet) */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-[#78716C]">
          <button
            onClick={() => onSelectTab('learn')}
            className={`whitespace-nowrap transition-colors cursor-pointer ${
              currentTab === 'learn'
                ? 'text-[#1C1917] border-b-2 border-[#1C1917] pb-0.5'
                : 'hover:text-[#1C1917]'
            }`}
          >
            Belajar Teori Nada
          </button>
          <button
            onClick={() => onSelectTab('lyrics')}
            className={`whitespace-nowrap transition-colors cursor-pointer ${
              currentTab === 'lyrics'
                ? 'text-[#1C1917] border-b-2 border-[#1C1917] pb-0.5'
                : 'hover:text-[#1C1917]'
            }`}
          >
            Studio Lirik TipTap
          </button>
          <button
            onClick={() => onSelectTab('bank')}
            className={`whitespace-nowrap transition-colors cursor-pointer ${
              currentTab === 'bank'
                ? 'text-[#1C1917] border-b-2 border-[#1C1917] pb-0.5'
                : 'hover:text-[#1C1917]'
            }`}
          >
            Bank Bar & Rima
          </button>
          <button
            onClick={() => onSelectTab('tools')}
            className={`whitespace-nowrap transition-colors cursor-pointer ${
              currentTab === 'tools'
                ? 'text-[#1C1917] border-b-2 border-[#1C1917] pb-0.5'
                : 'hover:text-[#1C1917]'
            }`}
          >
            Koleksi Alat Musisi
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action Area / Install & Mute toggle */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onToggleMute}
            className="p-1.5 rounded-md text-[#78716C] hover:text-[#1C1917] hover:bg-[#F5F4EE] border border-[#E5E4DE] transition cursor-pointer"
            title={isMuted ? 'Nyalakan Audio Web Synth' : 'Bisukan Audio'}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-[#A8A29E]" />
            ) : (
              <Volume2 className="w-4 h-4 text-[#1C1917]" />
            )}
          </button>

          <PWAInstallButton />
        </div>
      </div>
    </header>
  );
};
