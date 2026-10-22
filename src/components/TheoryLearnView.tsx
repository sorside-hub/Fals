import React, { useState, useEffect } from 'react';
import { THEORY_THEMES, CHROMATIC_NOTES } from '../utils/musicTheory';
import { InteractivePiano } from './InteractivePiano';
import { InteractiveFretboard } from './InteractiveFretboard';
import { CircleOfFifths } from './CircleOfFifths';
import { ThemeDeepDiveView } from './ThemeDeepDiveView';
import { sound } from '../utils/audioEngine';
import {
  BookOpen,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Volume2,
  Layers,
  Compass,
  Guitar
} from 'lucide-react';

interface TheoryLearnViewProps {
  initialThemeId?: string | null;
  isDeepDive?: boolean;
  onNavigateToDeepDive?: (themeId: string) => void;
  onBackFromDeepDive?: () => void;
}

export const TheoryLearnView: React.FC<TheoryLearnViewProps> = ({
  initialThemeId,
  isDeepDive,
  onNavigateToDeepDive,
  onBackFromDeepDive,
}) => {
  const [selectedThemeId, setSelectedThemeId] = useState<string>(initialThemeId || 'fondasi');
  const [activeRoot, setActiveRoot] = useState<string>('C');
  const [instrumentMode, setInstrumentMode] = useState<'piano' | 'fretboard'>('piano');

  useEffect(() => {
    if (initialThemeId) {
      setSelectedThemeId(initialThemeId);
    }
  }, [initialThemeId]);

  const currentTheme = THEORY_THEMES.find(t => t.id === selectedThemeId) || THEORY_THEMES[0];

  const handleOpenDeepDive = () => {
    if (onNavigateToDeepDive) {
      onNavigateToDeepDive(currentTheme.id);
    }
  };

  const handleSelectThemeFromDeepDive = (newThemeId: string) => {
    setSelectedThemeId(newThemeId);
    if (onNavigateToDeepDive) {
      onNavigateToDeepDive(newThemeId);
    }
  };

  const handleBack = () => {
    if (onBackFromDeepDive) {
      onBackFromDeepDive();
    }
  };

  // If Deep Dive mode is active (controlled by URL route #learn/deep/:themeId), show Full Page view
  if (isDeepDive) {
    return (
      <ThemeDeepDiveView
        theme={currentTheme}
        onBack={handleBack}
        onSelectTheme={handleSelectThemeFromDeepDive}
        allThemes={THEORY_THEMES}
      />
    );
  }

  return (
    <div className="w-full space-y-4 animate-fade-in">
      {/* 5 Thematic Navigation Tabs Header (Zero-Pill Discipline) */}
      <div className="bg-[#FFFFFF] border border-[#E5E4DE] rounded-2xl p-4 sm:p-5 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-2 border-b border-[#F0EFEA]">
          <div>
            <h2 className="text-base font-bold text-[#1C1917] tracking-tight flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#1C1917]" />
              <span>Tema Pembelajaran Teori FALS</span>
            </h2>
            <p className="text-xs text-[#78716C] mt-0.5">
              Pilih tema yang ingin kamu eksplorasi. Baca versi ringkas di bawah atau buka materi mendalam.
            </p>
          </div>
          <span className="text-xs font-mono text-[#78716C] self-start sm:self-auto">
            5 Tema Utama Musisi
          </span>
        </div>

        {/* Horizontal Theme Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {THEORY_THEMES.map((theme) => {
            const isSelected = theme.id === selectedThemeId;

            return (
              <button
                key={theme.id}
                onClick={() => {
                  setSelectedThemeId(theme.id);
                  setActiveRoot(theme.preview.defaultRoot || 'C');
                }}
                className={`px-3.5 py-2.5 rounded-xl text-left transition shrink-0 cursor-pointer border flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#1C1917] text-[#FAF9F5] border-[#1C1917] shadow-xs'
                    : 'bg-[#FAF9F5] text-[#44403C] border-[#E5E4DE] hover:bg-[#F5F4EE]'
                }`}
              >
                <div className={`text-[10px] font-mono uppercase ${isSelected ? 'text-[#D6D3D1]' : 'text-[#78716C]'}`}>
                  TEMA {theme.themeNumber}
                </div>
                <div className="text-xs font-semibold whitespace-nowrap mt-1">
                  {theme.title}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tier 1 Preview Card (Simple & Friendly for Beginners) */}
      <div className="bg-[#FFFFFF] border border-[#E5E4DE] rounded-2xl p-5 sm:p-7 shadow-2xs space-y-6">
        {/* Card Header & Title */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-4 border-b border-[#F0EFEA]">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#78716C] mb-1">
              <span className="uppercase font-semibold text-[#1C1917]">
                TEMA {currentTheme.themeNumber}
              </span>
              <span aria-hidden="true">·</span>
              <span>Ringkasan Cepat Pemula</span>
              <span aria-hidden="true">·</span>
              <span>{currentTheme.readTime}</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-[#1C1917] tracking-tight">
              {currentTheme.title}
            </h3>
            <p className="text-sm text-[#57534E] mt-1 leading-relaxed max-w-2xl">
              {currentTheme.tagline}
            </p>
          </div>

          {/* Quick Root Selector */}
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#FAF9F5] border border-[#E5E4DE] rounded-lg text-xs font-mono self-start">
            <span className="text-[#78716C]">Root:</span>
            <select
              value={activeRoot}
              onChange={(e) => setActiveRoot(e.target.value)}
              className="bg-transparent font-bold text-[#1C1917] outline-hidden cursor-pointer"
            >
              {CHROMATIC_NOTES.map(note => (
                <option key={note} value={note}>{note}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Musician Analogy Box */}
        <div className="p-4 bg-[#FAF9F5] border border-[#E5E4DE] rounded-xl space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#1C1917] uppercase tracking-wide">
            <Sparkles className="w-4 h-4 text-[#78716C]" />
            <span>Analogi Santai Musisi</span>
          </div>
          <p className="text-xs sm:text-sm text-[#44403C] leading-relaxed italic">
            "{currentTheme.preview.analogy}"
          </p>
        </div>

        {/* Cheat Sheet: Poin Kunci Biar Gak Fals */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#1C1917] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#1C1917]" />
            <span>Poin Kunci Biar Gak Fals</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {currentTheme.preview.cheatSheet.map((item, idx) => (
              <div
                key={idx}
                className="p-3 bg-[#FAF9F5] border border-[#E5E4DE] rounded-xl text-xs text-[#44403C] leading-relaxed flex items-start gap-2.5"
              >
                <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#FFFFFF] border border-[#E5E4DE] text-[#1C1917] shrink-0 mt-0.5">
                  0{idx + 1}
                </span>
                <span>{item}</span>
              </div>
            ))}
          </div>

          {currentTheme.preview.quickTip && (
            <div className="p-3 bg-[#F5F4EE] border border-[#E5E4DE] rounded-lg text-xs text-[#44403C] leading-relaxed mt-1">
              <strong className="text-[#1C1917]">💡 Uji Telinga Instan:</strong> {currentTheme.preview.quickTip}
            </div>
          )}
        </div>

        {/* Mini Interactive Preview Instrument */}
        <div className="pt-2 border-t border-[#F0EFEA] space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold text-[#1C1917] uppercase tracking-wider">
              Preview Instrumen ({activeRoot})
            </div>

            {currentTheme.id !== 'lingkaran' && (
              <div className="flex bg-[#F5F4EE] border border-[#E5E4DE] rounded-md p-0.5 text-xs">
                <button
                  onClick={() => setInstrumentMode('piano')}
                  className={`px-2.5 py-0.5 rounded transition cursor-pointer font-medium ${
                    instrumentMode === 'piano'
                      ? 'bg-[#1C1917] text-[#FAF9F5]'
                      : 'text-[#57534E] hover:text-[#1C1917]'
                  }`}
                >
                  Piano
                </button>
                <button
                  onClick={() => setInstrumentMode('fretboard')}
                  className={`px-2.5 py-0.5 rounded transition cursor-pointer font-medium ${
                    instrumentMode === 'fretboard'
                      ? 'bg-[#1C1917] text-[#FAF9F5]'
                      : 'text-[#57534E] hover:text-[#1C1917]'
                  }`}
                >
                  Gitar
                </button>
              </div>
            )}
          </div>

          {currentTheme.id === 'lingkaran' ? (
            <CircleOfFifths />
          ) : instrumentMode === 'piano' ? (
            <InteractivePiano
              highlightNotes={currentTheme.preview.highlightNotes}
              rootNote={activeRoot}
              title={`Tuts Interaktif: ${currentTheme.title}`}
              subtitle="Sentuh tuts untuk membunyikan nada secara langsung"
            />
          ) : (
            <InteractiveFretboard
              highlightNotes={currentTheme.preview.highlightNotes}
              rootNote={activeRoot}
              title={`Fretboard Gitar: ${currentTheme.title}`}
            />
          )}
        </div>

        {/* Primary CTA: Pelajari Lebih Dalam */}
        <div className="pt-3 border-t border-[#E5E4DE]">
          <button
            onClick={handleOpenDeepDive}
            className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-[#1C1917] text-[#FAF9F5] hover:bg-[#292524] rounded-xl text-xs sm:text-sm font-semibold tracking-wide transition-all cursor-pointer shadow-sm active:scale-[0.99] group"
          >
            <span>Pelajari Lebih Dalam: Bab Lengkap, Kamus Akor & Fingering Gitar</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  );
};
