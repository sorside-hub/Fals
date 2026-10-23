import React, { useState, useMemo } from 'react';
import { ChevronDown, Volume2, Check } from 'lucide-react';
import { sound } from '../../utils/audioEngine';
import { useVirtualKeyboard } from '../../hooks/useVirtualKeyboard';

export interface ChordOption {
  name: string;
  intervals: number[];
}

export interface LyricWritingToolbarProps {
  activeKey: string;
  availableChords?: ChordOption[];
  onInsertSection: (sectionName: string) => void;
  onInsertChord: (chordName: string) => void;
  onPlayChord?: (key: string, intervals: number[]) => void;
  onDismissKeyboard?: () => void;
  variant?: 'auto' | 'desktop' | 'mobile';
  keyboardOffset?: number;
}

export const LyricWritingToolbar: React.FC<LyricWritingToolbarProps> = ({
  activeKey,
  availableChords,
  onInsertSection,
  onInsertChord,
  onPlayChord,
  onDismissKeyboard,
  variant = 'auto',
  keyboardOffset: customKeyboardOffset,
}) => {
  const [showChordTrayDesktop, setShowChordTrayDesktop] = useState(false);
  const { isKeyboardVisible, keyboardOffset: detectedOffset } = useVirtualKeyboard();

  const effectiveOffset = customKeyboardOffset !== undefined ? customKeyboardOffset : detectedOffset;

  const sections = ['Verse', 'Pre-Chorus', 'Chorus', 'Bridge', 'Hook', 'Outro'];

  // Automatically compute common chords for active key if not passed
  const chords = useMemo(() => {
    if (availableChords && availableChords.length > 0) return availableChords;
    const root = activeKey || 'C';
    return [
      { name: root, intervals: [0, 4, 7] },
      { name: `${root}maj7`, intervals: [0, 4, 7, 11] },
      { name: `${root}add9`, intervals: [0, 4, 7, 14] },
      { name: `${root}sus2`, intervals: [0, 2, 7] },
      { name: `${root}sus4`, intervals: [0, 5, 7] },
    ];
  }, [activeKey, availableChords]);

  const handlePlayChordSound = (keyName: string, intervals: number[]) => {
    if (onPlayChord) {
      onPlayChord(keyName, intervals);
    } else {
      sound.playChord(keyName, intervals);
    }
  };

  // 1. Desktop Strip Component
  const renderDesktopStrip = () => (
    <div className="w-full flex flex-col border-b border-[#F0EFEA] animate-fade-in">
      <div className="py-2 flex flex-wrap items-center justify-between gap-2 text-xs">
        {/* Section Insertion Tags */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <span className="text-[#78716C] mr-1 font-mono text-[11px] shrink-0">Sisip Bagian:</span>
          {sections.map((sec) => (
            <button
              key={sec}
              type="button"
              onPointerDown={(e) => {
                e.preventDefault();
                onInsertSection(sec);
              }}
              className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-[#FFFFFF] border border-[#E5E4DE] text-[#44403C] hover:bg-[#F5F4EE] hover:text-[#1C1917] cursor-pointer whitespace-nowrap transition shadow-2xs"
            >
              +{sec}
            </button>
          ))}
        </div>

        {/* Toggle Chord Inserter */}
        <button
          type="button"
          onClick={() => setShowChordTrayDesktop((prev) => !prev)}
          className="flex items-center gap-1 text-[11px] font-mono text-[#57534E] hover:text-[#1C1917] px-2.5 py-1 rounded-md bg-[#FFFFFF] border border-[#E5E4DE] cursor-pointer ml-auto shadow-2xs"
        >
          <span>Sisip Akor ({activeKey})</span>
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showChordTrayDesktop ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Collapsible Desktop Chord Tray */}
      {showChordTrayDesktop && (
        <div className="py-2 px-1 border-t border-[#E5E4DE] flex items-center gap-1.5 overflow-x-auto scrollbar-none text-xs bg-[#F5F4EE]/60">
          <span className="text-[11px] font-mono text-[#78716C] shrink-0 mr-1">Klik sisip akor:</span>
          {chords.map((c) => (
            <button
              key={c.name}
              type="button"
              onPointerDown={(e) => {
                e.preventDefault();
                onInsertChord(c.name);
                handlePlayChordSound(activeKey, c.intervals);
              }}
              className="px-2.5 py-1 rounded-md font-mono font-medium text-[11px] bg-[#FFFFFF] border border-[#D6D3D1] text-[#1C1917] hover:bg-[#FAF9F5] hover:border-[#1C1917] transition cursor-pointer flex items-center gap-1 shadow-2xs"
            >
              <span>[{c.name}]</span>
            </button>
          ))}

          <button
            type="button"
            onClick={() => handlePlayChordSound(activeKey, [0, 4, 7])}
            className="p-1 rounded text-[#78716C] hover:text-[#1C1917] ml-auto cursor-pointer"
            title="Dengarkan akor dasar"
          >
            <Volume2 className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );

  // 2. Mobile Floating Strip Component (docked directly above virtual keyboard)
  const renderMobileStrip = () => (
    <div
      style={{
        bottom: `${effectiveOffset}px`,
      }}
      className="fixed inset-x-0 bottom-0 z-50 bg-[#FAF9F5]/98 backdrop-blur-md border-t border-b border-[#E5E4DE] shadow-xl px-2 py-1.5 flex items-center gap-1.5 animate-fade-in"
    >
      {/* Scrollable Action Chips for thumbs */}
      <div className="flex-1 flex items-center gap-1 overflow-x-auto scrollbar-none py-0.5">
        {/* Fast Section chips */}
        {['Verse', 'Chorus', 'Bridge', 'Hook'].map((sec) => (
          <button
            key={sec}
            type="button"
            onPointerDown={(e) => {
              e.preventDefault();
              onInsertSection(sec);
            }}
            className="px-2.5 py-1 rounded-md text-[11px] font-mono font-medium bg-[#FFFFFF] border border-[#E5E4DE] text-[#1C1917] active:bg-[#EAE8DF] shrink-0"
          >
            +{sec}
          </button>
        ))}

        <span className="w-px h-4 bg-[#E5E4DE] mx-0.5 shrink-0" />

        {/* Quick Chords */}
        {chords.map((c) => (
          <button
            key={c.name}
            type="button"
            onPointerDown={(e) => {
              e.preventDefault();
              onInsertChord(c.name);
              handlePlayChordSound(activeKey, c.intervals);
            }}
            className="px-2 py-1 rounded-md text-[11px] font-mono font-semibold bg-[#FFFFFF] border border-[#D6D3D1] text-[#1C1917] active:bg-[#EAE8DF] shrink-0"
          >
            [{c.name}]
          </button>
        ))}
      </div>

      {/* Dismiss Keyboard Button */}
      {onDismissKeyboard && (
        <button
          type="button"
          onPointerDown={(e) => {
            e.preventDefault();
            onDismissKeyboard();
          }}
          className="w-8 h-8 shrink-0 flex items-center justify-center rounded-md bg-[#F5F4EE] hover:bg-[#EAE8DF] text-[#1C1917] active:scale-95 border border-[#E5E4DE] cursor-pointer"
          title="Tutup Keyboard"
        >
          <Check className="w-4 h-4 text-[#1C1917]" />
        </button>
      )}
    </div>
  );

  if (variant === 'desktop') {
    return renderDesktopStrip();
  }

  if (variant === 'mobile') {
    return renderMobileStrip();
  }

  // AUTO VARIANT: Renders desktop view on md+ and mobile view on mobile when keyboard is visible
  return (
    <>
      <div className="hidden md:block">
        {renderDesktopStrip()}
      </div>
      {isKeyboardVisible && (
        <div className="md:hidden">
          {renderMobileStrip()}
        </div>
      )}
    </>
  );
};
