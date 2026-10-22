import React, { useState } from 'react';
import { TheoryTheme, ChordDictionaryItem } from '../types';
import { InteractivePiano } from './InteractivePiano';
import { InteractiveFretboard } from './InteractiveFretboard';
import { CircleOfFifths } from './CircleOfFifths';
import { ChordDictionaryCard, ChordFingeringDetail } from './theory/ChordDictionaryCard';
import { SongCaseStudyCard } from './theory/SongCaseStudyCard';
import { sound } from '../utils/audioEngine';
import {
  ArrowLeft,
  BookOpen,
  Sparkles,
  Disc3,
  Guitar,
  Layers,
  ChevronRight
} from 'lucide-react';

interface ThemeDeepDiveViewProps {
  theme: TheoryTheme;
  onBack: () => void;
  onSelectTheme: (themeId: string) => void;
  allThemes: TheoryTheme[];
}

export const ThemeDeepDiveView: React.FC<ThemeDeepDiveViewProps> = ({
  theme,
  onBack,
  onSelectTheme,
  allThemes
}) => {
  const [selectedChord, setSelectedChord] = useState<ChordDictionaryItem | null>(
    theme.deepDive.chordDictionary ? theme.deepDive.chordDictionary[0] : null
  );
  const [instrumentView, setInstrumentView] = useState<'piano' | 'fretboard'>('piano');
  const [activeRoot, setActiveRoot] = useState<string>(theme.preview.defaultRoot || 'C');

  const currentIndex = allThemes.findIndex(t => t.id === theme.id);
  const nextTheme = currentIndex < allThemes.length - 1 ? allThemes[currentIndex + 1] : null;

  const handlePlayChord = (item: ChordDictionaryItem) => {
    setSelectedChord(item);
    const root = item.symbol.replace(/[^A-G#b]/g, '') || 'C';
    sound.playChord(root, item.intervals, 4, true);
  };

  const handlePlaySongProgression = (chords: string[]) => {
    chords.forEach((chord, i) => {
      setTimeout(() => {
        const root = chord.replace(/[^A-G#b]/g, '');
        const isMinor = chord.includes('m') && !chord.includes('maj');
        sound.playChord(root, isMinor ? [0, 3, 7] : [0, 4, 7], 4, true);
      }, i * 650);
    });
  };

  return (
    <div className="w-full space-y-6 pb-12 animate-fade-in">
      {/* Sticky Back Navigation Bar */}
      <div className="sticky top-14 z-20 bg-[#FAF9F5]/95 backdrop-blur-md py-3 border-b border-[#E5E4DE] flex items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 min-h-[44px] min-w-[44px] px-3 py-1.5 text-xs font-semibold text-[#1C1917] hover:bg-[#F5F4EE] border border-[#E5E4DE] rounded-lg transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-[#57534E]" />
          <span>Kembali ke Ringkasan</span>
        </button>

        <div className="flex items-center gap-2 text-xs font-mono text-[#78716C] truncate">
          <span className="uppercase font-bold text-[#1C1917]">TEMA {theme.themeNumber}</span>
          <span aria-hidden="true">·</span>
          <span className="truncate">{theme.title}</span>
          <span aria-hidden="true">·</span>
          <span>{theme.readTime}</span>
        </div>
      </div>

      {/* Main Title Hero Banner */}
      <div className="bg-[#FFFFFF] border border-[#E5E4DE] rounded-2xl p-5 sm:p-8 shadow-2xs space-y-3">
        <div className="flex items-center gap-2 text-xs font-mono text-[#78716C]">
          <span className="bg-[#1C1917] text-[#FAF9F5] px-2 py-0.5 rounded text-[10px] font-bold">
            MODUL MENDALAM
          </span>
          <span aria-hidden="true">·</span>
          <span>Tema {theme.themeNumber} dari {allThemes.length}</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-[#1C1917] tracking-tight">
          {theme.title}
        </h1>
        <p className="text-sm sm:text-base text-[#57534E] leading-relaxed max-w-3xl">
          {theme.tagline}
        </p>

        {/* Analogi Musisi Section */}
        <div className="mt-4 p-4 bg-[#FAF9F5] border border-[#E5E4DE] rounded-xl flex items-start gap-3">
          <Sparkles className="w-4 h-4 text-[#78716C] shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm text-[#44403C] leading-relaxed italic">
            <strong>Analogi Santai:</strong> "{theme.preview.analogy}"
          </div>
        </div>
      </div>

      {/* Chapters Breakdown */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#78716C] px-1">
          <BookOpen className="w-4 h-4 text-[#1C1917]" />
          <span>Bab Pembelajaran Komprehensif</span>
        </div>

        {theme.deepDive.chapters.map((chapter) => (
          <div
            key={chapter.chapterNum}
            className="bg-[#FFFFFF] border border-[#E5E4DE] rounded-xl p-5 sm:p-6 shadow-2xs space-y-3"
          >
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[#F5F4EE] text-[#1C1917] border border-[#E5E4DE]">
                BAB {chapter.chapterNum}
              </span>
              <h3 className="text-base sm:text-lg font-bold text-[#1C1917]">
                {chapter.heading}
              </h3>
            </div>

            <p className="text-xs sm:text-sm text-[#44403C] leading-relaxed">
              {chapter.content}
            </p>

            {chapter.bulletPoints && chapter.bulletPoints.length > 0 && (
              <div className="space-y-1.5 pl-4 py-1 border-l-2 border-[#E5E4DE] my-2">
                {chapter.bulletPoints.map((pt, pIdx) => (
                  <div key={pIdx} className="text-xs text-[#57534E] leading-relaxed">
                    • {pt}
                  </div>
                ))}
              </div>
            )}

            {chapter.proTip && (
              <div className="p-3 bg-[#F5F4EE] border border-[#E5E4DE] rounded-lg text-xs text-[#44403C] leading-relaxed mt-3">
                <strong className="text-[#1C1917]">💡 Pro Tip Musisi:</strong> {chapter.proTip}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Kamus Formula Akor Mendalam & Fingering Gitar */}
      {theme.deepDive.chordDictionary && theme.deepDive.chordDictionary.length > 0 && (
        <div className="bg-[#FFFFFF] border border-[#E5E4DE] rounded-2xl p-5 sm:p-6 shadow-2xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#F0EFEA]">
            <div>
              <h3 className="text-base font-bold text-[#1C1917] flex items-center gap-2">
                <Guitar className="w-4 h-4 text-[#1C1917]" />
                <span>Kamus Formula Akor & Fingering Gitar</span>
              </h3>
              <p className="text-xs text-[#78716C] mt-0.5">
                Sentuh kartu akor untuk mendengarkan suaranya dan melihat posisi senar gitar.
              </p>
            </div>
            <span className="text-xs font-mono text-[#78716C] self-start sm:self-auto">
              {theme.deepDive.chordDictionary.length} Bentuk Akor Utama
            </span>
          </div>

          {/* Chord grid using modular ChordDictionaryCard */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
            {theme.deepDive.chordDictionary.map((item) => (
              <ChordDictionaryCard
                key={item.name}
                chord={item}
                isSelected={selectedChord?.name === item.name}
                onSelect={handlePlayChord}
              />
            ))}
          </div>

          {/* Active Chord Detail & Guitar Fingering Display */}
          {selectedChord && (
            <ChordFingeringDetail
              chord={selectedChord}
              onPlay={() => handlePlayChord(selectedChord)}
            />
          )}
        </div>
      )}

      {/* Song Case Studies Section using modular SongCaseStudyCard */}
      {theme.deepDive.songCaseStudies && theme.deepDive.songCaseStudies.length > 0 && (
        <div className="bg-[#FFFFFF] border border-[#E5E4DE] rounded-2xl p-5 sm:p-6 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[#F0EFEA]">
            <Disc3 className="w-4 h-4 text-[#1C1917]" />
            <h3 className="text-base font-bold text-[#1C1917]">
              Bedah Studi Kasus Lagu Populer
            </h3>
          </div>
          <p className="text-xs text-[#78716C]">
            Lihat bagaimana produser dan musisi dunia menerapkan formula tema ini pada lagu nyata:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {theme.deepDive.songCaseStudies.map((study, idx) => (
              <SongCaseStudyCard
                key={idx}
                study={study}
                onPlayProgression={handlePlaySongProgression}
              />
            ))}
          </div>
        </div>
      )}

      {/* Interactive Instrument Studio Workspace */}
      <div className="bg-[#FFFFFF] border border-[#E5E4DE] rounded-2xl p-5 sm:p-6 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#F0EFEA]">
          <div>
            <h3 className="text-base font-bold text-[#1C1917] flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#1C1917]" />
              <span>Studio Instrumen Interaktif</span>
            </h3>
            <p className="text-xs text-[#78716C]">
              Uji langsung nada dan akor di tuts virtual atau fretboard gitar.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex bg-[#F5F4EE] border border-[#E5E4DE] rounded-md p-0.5 text-xs">
              <button
                onClick={() => setInstrumentView('piano')}
                className={`px-3 py-1 rounded transition cursor-pointer font-medium ${
                  instrumentView === 'piano'
                    ? 'bg-[#1C1917] text-[#FAF9F5]'
                    : 'text-[#57534E] hover:text-[#1C1917]'
                }`}
              >
                Piano Roll
              </button>
              <button
                onClick={() => setInstrumentView('fretboard')}
                className={`px-3 py-1 rounded transition cursor-pointer font-medium ${
                  instrumentView === 'fretboard'
                    ? 'bg-[#1C1917] text-[#FAF9F5]'
                    : 'text-[#57534E] hover:text-[#1C1917]'
                }`}
              >
                Fretboard Gitar
              </button>
            </div>
          </div>
        </div>

        {theme.id === 'lingkaran' ? (
          <CircleOfFifths />
        ) : instrumentView === 'piano' ? (
          <InteractivePiano
            highlightNotes={theme.preview.highlightNotes}
            rootNote={activeRoot}
            title={`Eksplorasi Tuts ${theme.title}`}
          />
        ) : (
          <InteractiveFretboard
            highlightNotes={theme.preview.highlightNotes}
            rootNote={activeRoot}
            title={`Eksplorasi Fretboard ${theme.title}`}
          />
        )}
      </div>

      {/* Bottom Navigation to Next Theme */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-5 bg-[#FFFFFF] border border-[#E5E4DE] rounded-2xl shadow-2xs">
        <button
          onClick={onBack}
          className="text-xs font-semibold text-[#78716C] hover:text-[#1C1917] cursor-pointer"
        >
          ← Kembali ke Semua Tema
        </button>

        {nextTheme && (
          <button
            onClick={() => onSelectTheme(nextTheme.id)}
            className="flex items-center gap-2 px-4 py-2 bg-[#1C1917] text-[#FAF9F5] rounded-xl text-xs font-semibold hover:bg-[#292524] transition cursor-pointer shadow-xs"
          >
            <span>Lanjut ke Tema {nextTheme.themeNumber}: {nextTheme.title}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
