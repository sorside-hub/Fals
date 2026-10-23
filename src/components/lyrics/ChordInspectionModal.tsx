import React, { useState, useEffect } from 'react';
import { parseChordSymbol } from '../../utils/chordParser';
import { InteractivePiano } from '../InteractivePiano';
import { InteractiveFretboard } from '../InteractiveFretboard';
import { sound } from '../../utils/audioEngine';
import { Volume2, Sparkles } from 'lucide-react';

interface ChordInspectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  chordSymbol: string | null;
}

export const ChordInspectionModal: React.FC<ChordInspectionModalProps> = ({
  isOpen,
  onClose,
  chordSymbol,
}) => {
  const [activeTab, setActiveTab] = useState<'piano' | 'guitar'>('piano');
  const [isPlaying, setIsPlaying] = useState(false);

  const parsed = parseChordSymbol(chordSymbol || 'C');

  // Play chord sound on open
  useEffect(() => {
    if (isOpen && chordSymbol) {
      sound.playChord(parsed.root, parsed.intervals);
    }
  }, [isOpen, chordSymbol, parsed.root, parsed.intervals]);

  if (!isOpen || !chordSymbol) return null;

  const handlePlaySound = () => {
    setIsPlaying(true);
    sound.playChord(parsed.root, parsed.intervals);
    setTimeout(() => setIsPlaying(false), 500);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/55 backdrop-blur-xs animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-[#FAF9F5] border border-[#E5E4DE] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 1. Modal Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-[#E5E4DE] bg-[#FFFFFF]">
          <div className="flex items-center gap-3">
            {/* Chord Badge Pill - Clean without music note icon */}
            <div className="flex items-center px-3 py-1 bg-[#1C1917] text-[#FAF9F5] rounded-lg font-mono font-bold text-base shadow-2xs">
              <span>{parsed.rawSymbol}</span>
            </div>

            <div>
              <h3 className="text-sm sm:text-base font-bold text-[#1C1917] tracking-tight">
                {parsed.displayName}
              </h3>
              <p className="text-xs text-[#78716C] font-mono">
                Rumus: {parsed.formulaNames} • Not: {parsed.notes.join(' - ')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick Play Audio Button */}
            <button
              type="button"
              onClick={handlePlaySound}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition cursor-pointer ${
                isPlaying
                  ? 'bg-amber-100 border-amber-300 text-amber-900 scale-95'
                  : 'bg-[#FAF9F5] hover:bg-[#F5F4EE] border-[#E5E4DE] text-[#1C1917]'
              }`}
              title="Dengarkan Akor"
            >
              <Volume2 className="w-3.5 h-3.5 text-[#57534E]" />
              <span className="hidden sm:inline">Putar Akor</span>
            </button>
          </div>
        </div>

        {/* 2. Instrument View Switcher Tabs */}
        <div className="px-4 sm:px-6 pt-3 pb-2 border-b border-[#F0EFEA] flex items-center justify-between gap-2 bg-[#FAF9F5]">
          <div className="flex items-center gap-1 bg-[#EAE8DF] p-1 rounded-xl text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab('piano')}
              className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'piano'
                  ? 'bg-[#FFFFFF] text-[#1C1917] shadow-2xs'
                  : 'text-[#78716C] hover:text-[#1C1917]'
              }`}
            >
              🎹 Piano Roll
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('guitar')}
              className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'guitar'
                  ? 'bg-[#FFFFFF] text-[#1C1917] shadow-2xs'
                  : 'text-[#78716C] hover:text-[#1C1917]'
              }`}
            >
              🎸 Fretboard Gitar
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-1 text-[11px] font-mono text-[#78716C]">
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>{parsed.feeling}</span>
          </div>
        </div>

        {/* 3. Interactive Visualization Canvas */}
        <div className="p-3 sm:p-5 overflow-y-auto flex-1 space-y-4">
          {activeTab === 'piano' ? (
            <div className="animate-fade-in">
              <InteractivePiano
                highlightNotes={parsed.notes}
                rootNote={parsed.root}
                title={`Posisi Tuts ${parsed.rawSymbol}`}
                subtitle={`Not pembentuk nada: ${parsed.notes.join(' - ')} (Akar: ${parsed.root})`}
              />
            </div>
          ) : (
            <div className="animate-fade-in">
              <InteractiveFretboard
                highlightNotes={parsed.notes}
                rootNote={parsed.root}
                title={`Diagram Fretboard ${parsed.rawSymbol}`}
              />
            </div>
          )}

          {/* Notes Breakdown Chips */}
          <div className="bg-[#FFFFFF] border border-[#E5E4DE] rounded-xl p-3 flex flex-col gap-2">
            <span className="text-[11px] font-mono text-[#78716C] uppercase tracking-wider font-semibold">
              Rincian Susunan Not Pembentuk:
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {parsed.notes.map((note, idx) => {
                const isRoot = note === parsed.root;
                const roleLabel = idx === 0 ? 'Root' : idx === 1 ? '3rd' : idx === 2 ? '5th' : '7th/ext';
                return (
                  <div
                    key={`${note}-${idx}`}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border font-mono text-xs ${
                      isRoot
                        ? 'bg-[#1C1917] text-[#FAF9F5] border-[#1C1917] font-bold'
                        : 'bg-[#FAF9F5] text-[#1C1917] border-[#E5E4DE]'
                    }`}
                  >
                    <span>{note}</span>
                    <span className={`text-[10px] ${isRoot ? 'text-amber-300' : 'text-[#78716C]'}`}>
                      ({roleLabel})
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 4. Modal Footer */}
        <div className="px-4 sm:px-6 py-2.5 border-t border-[#E5E4DE] bg-[#FFFFFF] flex items-center justify-between text-xs text-[#78716C]">
          <span className="text-[11px]">
            Sentuh tuts atau senar di atas untuk mencoba variasi nada.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#1C1917] hover:bg-[#292524] text-[#FAF9F5] font-medium transition cursor-pointer text-xs"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
