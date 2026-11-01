import React, { useState, useMemo, useRef, useEffect } from 'react';
import { CHROMATIC_NOTES, getScaleNotes, GUITAR_STRINGS, getGuitarFretNote } from '../../utils/musicTheory';
import {
  getDiatonicChords,
  THREE_NOTE_PER_STRING_PATTERNS,
  CAGED_BOX_PATTERNS,
  PENTATONIC_BOX_PATTERNS,
  POPULAR_MAJOR_PROGRESSIONS,
  ScalePattern,
  getPatternExplicitPositions,
} from '../../data/scaleLabData';
import { InteractiveFretboard } from '../InteractiveFretboard';
import { InteractivePiano } from '../InteractivePiano';
import { sound } from '../../utils/audioEngine';
import {
  Volume2,
  Compass,
  Layers,
  Music,
  Send,
  Check,
  Copy,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Info,
  Sparkles,
  Play,
  Square,
  Maximize2,
  Minimize2,
  X,
  Smartphone,
  Monitor,
} from 'lucide-react';

interface ScaleLabViewProps {
  onSendToLyric?: (text: string) => void;
}

const SCALE_TYPES = [
  { id: 'major', name: 'Skala Mayor (Ionian)', formula: '1 - 2 - 3 - 4 - 5 - 6 - 7' },
];

// Helper Component for Vertical Guitar Fretboard View (Nut at top to Fret 15 at bottom)
const VerticalFretboardView: React.FC<{
  rootNote: string;
  scaleNotes: string[];
  maxFret?: number;
}> = ({ rootNote, scaleNotes, maxFret = 15 }) => {
  const [activeFretPos, setActiveFretPos] = useState<string | null>(null);
  const frets = Array.from({ length: maxFret + 1 }, (_, i) => i);

  const isHighlighted = (note: string) =>
    scaleNotes.some((n) => n.toUpperCase() === note.toUpperCase());
  const isRoot = (note: string) =>
    rootNote.toUpperCase() === note.toUpperCase();

  const handleFretClick = (
    openNote: string,
    openOctave: number,
    fret: number,
    stringNum: number
  ) => {
    const { note, octaveDiff } = getGuitarFretNote(openNote, fret);
    const finalOctave = openOctave + octaveDiff;
    setActiveFretPos(`${stringNum}-${fret}`);
    sound.playGuitarNote(note, finalOctave);
    setTimeout(() => setActiveFretPos(null), 200);
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-[#1C1917] border border-[#292524] rounded-2xl p-4 sm:p-6 text-[#FAF9F5] shadow-2xl">
      {/* String labels header */}
      <div className="grid grid-cols-7 text-center font-mono text-xs font-bold text-[#A8A29E] pb-3 border-b-2 border-[#44403C]">
        <span className="text-[10px] text-[#78716C] self-center">Fret</span>
        {GUITAR_STRINGS.map((str) => (
          <div key={str.stringNumber} className="flex flex-col items-center">
            <span className="text-white text-xs font-black">Senar {str.stringNumber}</span>
            <span className="text-[10px] text-amber-500 font-mono">({str.openNote})</span>
          </div>
        ))}
      </div>

      {/* Frets Rows 0..15 */}
      <div className="divide-y divide-[#292524] relative mt-1">
        {frets.map((fret) => {
          const isMarker =
            fret === 3 || fret === 5 || fret === 7 || fret === 9 || fret === 15;
          const isOctaveMarker = fret === 12;

          return (
            <div
              key={fret}
              className={`grid grid-cols-7 items-center py-2 relative border-b border-[#332F2C] ${
                fret === 0 ? 'bg-[#292524]/90 py-3 border-b-4 border-amber-600' : ''
              }`}
            >
              {/* Fret Number Label */}
              <div className="text-center font-mono text-xs font-bold text-[#A8A29E]">
                {fret === 0 ? 'Nut' : `Fret ${fret}`}
              </div>

              {/* Fret Marker Dots overlay */}
              {isMarker && (
                <div className="absolute left-[57%] -translate-x-1/2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-[#44403C] pointer-events-none z-0 border border-[#57534E]" />
              )}
              {isOctaveMarker && (
                <div className="absolute left-[57%] -translate-x-1/2 top-1/2 -translate-y-1/2 flex gap-1.5 pointer-events-none z-0">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                </div>
              )}

              {/* 6 Guitar Strings */}
              {GUITAR_STRINGS.map((guitarString) => {
                const { note } = getGuitarFretNote(
                  guitarString.openNote,
                  fret
                );
                const highlighted = isHighlighted(note);
                const root = isRoot(note);
                const isPressed =
                  activeFretPos === `${guitarString.stringNumber}-${fret}`;

                return (
                  <div
                    key={guitarString.stringNumber}
                    className="flex justify-center items-center z-10"
                  >
                    <button
                      onClick={() =>
                        handleFretClick(
                          guitarString.openNote,
                          guitarString.openOctave,
                          fret,
                          guitarString.stringNumber
                        )
                      }
                      className={`w-7 h-7 sm:w-9 sm:h-9 rounded-full font-mono text-xs font-bold transition-all cursor-pointer flex items-center justify-center ${
                        isPressed
                          ? 'scale-90 bg-amber-400 text-[#1C1917]'
                          : highlighted
                          ? root
                            ? 'bg-[#FFFFFF] text-[#1C1917] ring-2 ring-amber-400 font-black shadow-lg scale-105'
                            : 'bg-[#44403C] text-[#FAF9F5] border border-[#78716C] font-bold'
                          : 'opacity-20 hover:opacity-70 bg-[#292524] text-[#A8A29E]'
                      }`}
                      title={`Senar ${guitarString.stringNumber}, Fret ${fret}: Nada ${note}`}
                    >
                      {highlighted ? note : ''}
                    </button>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const ScaleLabView: React.FC<ScaleLabViewProps> = ({ onSendToLyric }) => {
  // 1. Root & Scale State
  const [selectedRoot, setSelectedRoot] = useState<string>('C');
  const [selectedScaleType, setSelectedScaleType] = useState<string>('major');

  // Custom Dropdown Open States
  const [isRootDropdownOpen, setIsRootDropdownOpen] = useState(false);
  const [isScaleDropdownOpen, setIsScaleDropdownOpen] = useState(false);

  const rootDropdownRef = useRef<HTMLDivElement>(null);
  const scaleDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (rootDropdownRef.current && !rootDropdownRef.current.contains(event.target as Node)) {
        setIsRootDropdownOpen(false);
      }
      if (scaleDropdownRef.current && !scaleDropdownRef.current.contains(event.target as Node)) {
        setIsScaleDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 2. Instrument Visualizer View & Fullscreen Modal State
  const [instrumentView, setInstrumentView] = useState<'fretboard' | 'piano'>('fretboard');
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);
  const [popupOctave, setPopupOctave] = useState<number>(4);

  // 3. Pattern / Box State (Dedicated Pattern Trainer)
  const [patternCategory, setPatternCategory] = useState<'3nps' | 'caged' | 'pentatonic'>('3nps');
  const [patternIndex, setPatternIndex] = useState<number>(0);
  const [isPlayingPatternAudio, setIsPlayingPatternAudio] = useState(false);
  const patternAudioTimeouts = useRef<NodeJS.Timeout[]>([]);

  // 4. Diatonic Chord Extension Level
  const [chordExtensionLevel, setChordExtensionLevel] = useState<'triad' | 'seventh' | 'variation'>('triad');
  const [playingChordSymbol, setPlayingChordSymbol] = useState<string | null>(null);

  // 5. Progression Player State
  const [playingProgressionId, setPlayingProgressionId] = useState<string | null>(null);
  const [copiedProgressionId, setCopiedProgressionId] = useState<string | null>(null);

  // Notes in the active scale
  const scaleNotes = useMemo(() => {
    return getScaleNotes(selectedRoot, selectedScaleType);
  }, [selectedRoot, selectedScaleType]);

  // Diatonic Chords for the active scale
  const diatonicChords = useMemo(() => {
    return getDiatonicChords(selectedRoot);
  }, [selectedRoot]);

  // Root note fret on the 6th string (E)
  const rootFretString6 = useMemo(() => {
    const eIndex = CHROMATIC_NOTES.indexOf('E');
    const rootIndex = CHROMATIC_NOTES.indexOf(selectedRoot);
    let fret = (rootIndex - eIndex + 12) % 12;
    if (fret === 0) fret = 12;
    return fret;
  }, [selectedRoot]);

  // Active pattern list for currently selected category
  const currentPatternList = useMemo<ScalePattern[]>(() => {
    if (patternCategory === '3nps') return THREE_NOTE_PER_STRING_PATTERNS;
    if (patternCategory === 'caged') return CAGED_BOX_PATTERNS;
    if (patternCategory === 'pentatonic') return PENTATONIC_BOX_PATTERNS;
    return THREE_NOTE_PER_STRING_PATTERNS;
  }, [patternCategory]);

  // Current active pattern
  const activePattern = currentPatternList[patternIndex] || currentPatternList[0];

  // Active scale notes filtered for the pattern (7 notes for standard major, 5 notes for pentatonic)
  const activePatternScaleNotes = useMemo(() => {
    if (patternCategory === 'pentatonic') {
      if (scaleNotes.length >= 7) {
        return [scaleNotes[0], scaleNotes[1], scaleNotes[2], scaleNotes[4], scaleNotes[5]];
      }
    }
    return scaleNotes;
  }, [patternCategory, scaleNotes]);

  // Compute exact positions for the active pattern (3 notes per string, zero duplicate notes across strings)
  const activePatternPositions = useMemo(() => {
    return getPatternExplicitPositions(patternCategory, patternIndex, selectedRoot, 15);
  }, [patternCategory, patternIndex, selectedRoot]);

  // Compute active fret range strictly from pattern positions
  const activePatternFretRange = useMemo<[number, number]>(() => {
    if (activePatternPositions.length === 0) return [0, 4];
    const frets = activePatternPositions.map((p) => p.fret);
    return [Math.min(...frets), Math.max(...frets)];
  }, [activePatternPositions]);

  // Play entire scale notes in sequence
  const handlePlayFullScaleAudio = () => {
    scaleNotes.forEach((note, idx) => {
      sound.playPianoNote(note, 4, 1.4, idx * 0.18);
    });
  };

  // Stop pattern audio
  const stopPatternAudio = () => {
    patternAudioTimeouts.current.forEach((t) => clearTimeout(t));
    patternAudioTimeouts.current = [];
    setIsPlayingPatternAudio(false);
  };

  useEffect(() => {
    return () => {
      stopPatternAudio();
    };
  }, []);

  // Category switch handler
  const handleSelectCategory = (cat: '3nps' | 'caged' | 'pentatonic') => {
    stopPatternAudio();
    setPatternCategory(cat);
    setPatternIndex(0);
  };

  // Stepper handlers
  const handlePrevPattern = () => {
    stopPatternAudio();
    setPatternIndex((prev) => (prev > 0 ? prev - 1 : currentPatternList.length - 1));
  };

  const handleNextPattern = () => {
    stopPatternAudio();
    setPatternIndex((prev) => (prev < currentPatternList.length - 1 ? prev + 1 : 0));
  };

  const handleSelectPatternIndex = (idx: number) => {
    stopPatternAudio();
    setPatternIndex(idx);
  };

  // Play pattern notes run from String 6 to String 1 strictly following the exact positions
  const handlePlayPatternRun = () => {
    if (isPlayingPatternAudio) {
      stopPatternAudio();
      return;
    }
    if (activePatternPositions.length === 0) return;

    setIsPlayingPatternAudio(true);

    // Sort positions: String 6 down to 1 (descending stringNum), then ascending fret on each string
    const sortedPositions = [...activePatternPositions].sort((a, b) => {
      if (b.stringNum !== a.stringNum) {
        return b.stringNum - a.stringNum; // String 6 before 5 before 4...
      }
      return a.fret - b.fret; // low fret to high fret
    });

    sortedPositions.forEach((pos, idx) => {
      const gString = GUITAR_STRINGS.find((s) => s.stringNumber === pos.stringNum);
      const openOctave = gString ? gString.openOctave : 3;
      const openNote = gString ? gString.openNote : 'E';
      const { octaveDiff } = getGuitarFretNote(openNote, pos.fret);
      const octave = openOctave + octaveDiff;

      const t = setTimeout(() => {
        sound.playGuitarNote(pos.note, octave, 0.8);
        if (idx === sortedPositions.length - 1) {
          setIsPlayingPatternAudio(false);
        }
      }, idx * 190);
      patternAudioTimeouts.current.push(t);
    });
  };

  // Play a single Diatonic Chord
  const handlePlayDiatonicChord = (chord: typeof diatonicChords[0]) => {
    let intervals = chord.intervals;
    let symbol = chord.symbol;

    if (chordExtensionLevel === 'seventh') {
      intervals = chord.seventhIntervals;
      symbol = chord.seventhSymbol;
    } else if (chordExtensionLevel === 'variation') {
      intervals = chord.variationIntervals;
      symbol = chord.variationSymbol;
    }

    setPlayingChordSymbol(symbol);
    sound.playChord(chord.root, intervals);
    setTimeout(() => {
      setPlayingChordSymbol(null);
    }, 600);
  };

  // Play entire Chord Progression Sequentially
  const handlePlayProgression = (prog: typeof POPULAR_MAJOR_PROGRESSIONS[0]) => {
    if (playingProgressionId === prog.id) {
      setPlayingProgressionId(null);
      return;
    }

    setPlayingProgressionId(prog.id);

    prog.degrees.forEach((degNum, idx) => {
      const chord = diatonicChords[degNum - 1];
      if (chord) {
        setTimeout(() => {
          if (chordExtensionLevel === 'seventh') {
            sound.playChord(chord.root, chord.seventhIntervals);
          } else {
            sound.playChord(chord.root, chord.intervals);
          }
        }, idx * 800);
      }
    });

    setTimeout(() => {
      setPlayingProgressionId(null);
    }, prog.degrees.length * 800 + 400);
  };

  // Copy Progression
  const handleCopyProgression = (prog: typeof POPULAR_MAJOR_PROGRESSIONS[0]) => {
    const chordNames = prog.degrees.map((d) => {
      const c = diatonicChords[d - 1];
      if (!c) return '';
      if (chordExtensionLevel === 'seventh') return c.seventhSymbol;
      return c.symbol;
    });

    const textToCopy = `[${prog.title} (${selectedRoot} Mayor)]\n${chordNames.join(' - ')} (${prog.roman})`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedProgressionId(prog.id);
    setTimeout(() => setCopiedProgressionId(null), 1600);
  };

  // Send Progression to Lyric Draft
  const handleSendProgression = (prog: typeof POPULAR_MAJOR_PROGRESSIONS[0]) => {
    if (!onSendToLyric) return;
    const chordNames = prog.degrees.map((d) => {
      const c = diatonicChords[d - 1];
      if (!c) return '';
      if (chordExtensionLevel === 'seventh') return c.seventhSymbol;
      return c.symbol;
    });

    const formatted = `[Prog: ${prog.roman}]\n${chordNames.map((c) => `[${c}]`).join('   ')}`;
    onSendToLyric(formatted);
  };

  const activeScaleObj = SCALE_TYPES.find((s) => s.id === selectedScaleType) || SCALE_TYPES[0];

  return (
    <div className="w-full animate-fade-in pb-16">
      {/* 1. Header: Icon + Title */}
      <div className="flex items-center gap-2.5 pb-5 border-b border-[#E5E4DE]">
        <div className="w-8 h-8 rounded-lg bg-[#FFFFFF] border border-[#E5E4DE] flex items-center justify-center shadow-2xs">
          <Compass className="w-4 h-4 text-[#1C1917]" />
        </div>
        <h2 className="text-base sm:text-lg font-bold text-[#1C1917] tracking-tight">
          Lab Tangga Nada & Harmoni
        </h2>
      </div>

      {/* 2. Selektor Dropdowns (Root Note & Jenis Skala) */}
      <div className="py-4 border-b border-[#E5E4DE]">
        <div className="grid grid-cols-2 gap-3 sm:gap-4 max-w-xl">
          {/* Custom Dropdown: Root Note */}
          <div className="relative" ref={rootDropdownRef}>
            <label className="block text-[11px] font-semibold text-[#78716C] mb-1">
              Nada Dasar (Root)
            </label>
            <button
              type="button"
              onClick={() => {
                setIsRootDropdownOpen(!isRootDropdownOpen);
                setIsScaleDropdownOpen(false);
              }}
              className="w-full h-10 flex items-center justify-between px-3 bg-[#FFFFFF] border border-[#E5E4DE] hover:border-[#1C1917] rounded-xl text-left transition cursor-pointer shadow-2xs"
            >
              <div className="flex items-center gap-2 truncate">
                <span className="w-5 h-5 shrink-0 rounded bg-[#1C1917] text-[#FAF9F5] font-mono text-xs font-black flex items-center justify-center">
                  {selectedRoot}
                </span>
                <span className="text-xs font-bold text-[#1C1917] truncate">
                  Nada {selectedRoot}
                </span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-[#78716C] shrink-0 transition-transform duration-200 ${
                  isRootDropdownOpen ? 'rotate-180 text-[#1C1917]' : ''
                }`}
              />
            </button>

            {/* Root Menu Popover */}
            {isRootDropdownOpen && (
              <div className="absolute top-full left-0 mt-1.5 w-64 p-2 bg-[#FFFFFF] border border-[#E5E4DE] rounded-xl shadow-lg z-30 animate-fade-in">
                <div className="grid grid-cols-4 gap-1.5">
                  {CHROMATIC_NOTES.map((note) => (
                    <button
                      key={note}
                      type="button"
                      onClick={() => {
                        setSelectedRoot(note);
                        setIsRootDropdownOpen(false);
                      }}
                      className={`h-9 rounded-lg font-mono text-xs font-bold transition cursor-pointer border ${
                        selectedRoot === note
                          ? 'bg-[#1C1917] text-[#FAF9F5] border-[#1C1917] shadow-xs'
                          : 'bg-[#FAF9F5] text-[#44403C] border-[#E5E4DE] hover:bg-[#F5F4EE] hover:text-[#1C1917]'
                      }`}
                    >
                      {note}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Custom Dropdown: Jenis Skala */}
          <div className="relative" ref={scaleDropdownRef}>
            <label className="block text-[11px] font-semibold text-[#78716C] mb-1">
              Jenis Skala
            </label>
            <button
              type="button"
              onClick={() => {
                setIsScaleDropdownOpen(!isScaleDropdownOpen);
                setIsRootDropdownOpen(false);
              }}
              className="w-full h-10 flex items-center justify-between px-3 bg-[#FFFFFF] border border-[#E5E4DE] hover:border-[#1C1917] rounded-xl text-left transition cursor-pointer shadow-2xs"
            >
              <div className="truncate pr-1">
                <span className="text-xs font-bold text-[#1C1917] block truncate">
                  {activeScaleObj.name}
                </span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-[#78716C] shrink-0 transition-transform duration-200 ${
                  isScaleDropdownOpen ? 'rotate-180 text-[#1C1917]' : ''
                }`}
              />
            </button>

            {/* Scale Type Menu Popover */}
            {isScaleDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-1.5 p-1.5 bg-[#FFFFFF] border border-[#E5E4DE] rounded-xl shadow-lg z-30 animate-fade-in min-w-[200px]">
                {SCALE_TYPES.map((scale) => (
                  <button
                    key={scale.id}
                    type="button"
                    onClick={() => {
                      setSelectedScaleType(scale.id);
                      setIsScaleDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs transition cursor-pointer ${
                      selectedScaleType === scale.id
                        ? 'bg-[#1C1917] text-[#FAF9F5] font-bold'
                        : 'text-[#44403C] hover:bg-[#FAF9F5] hover:text-[#1C1917]'
                    }`}
                  >
                    <div>{scale.name}</div>
                    <div className="text-[10px] font-mono opacity-70 mt-0.5">
                      {scale.formula}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. UTAMA / HERO ATAS: Visualisasi Instrumen (Fretboard / Keyboard) */}
      <div className="py-6 border-b border-[#E5E4DE] space-y-4">
        <div className="flex items-center justify-between gap-3">
          {/* Instrument Toggle Switcher */}
          <div className="inline-flex bg-[#F5F4EE] border border-[#E5E4DE] rounded-xl p-1 text-xs">
            <button
              onClick={() => setInstrumentView('fretboard')}
              className={`px-3.5 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
                instrumentView === 'fretboard'
                  ? 'bg-[#FFFFFF] text-[#1C1917] shadow-2xs'
                  : 'text-[#78716C] hover:text-[#1C1917]'
              }`}
            >
              Fretboard Gitar (15 Fret)
            </button>
            <button
              onClick={() => setInstrumentView('piano')}
              className={`px-3.5 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
                instrumentView === 'piano'
                  ? 'bg-[#FFFFFF] text-[#1C1917] shadow-2xs'
                  : 'text-[#78716C] hover:text-[#1C1917]'
              }`}
            >
              Keyboard Piano
            </button>
          </div>

          {/* Tombol Fullscreen Pop-up Vertikal */}
          <button
            onClick={() => setIsFullscreenOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1C1917] hover:bg-[#292524] text-[#FAF9F5] rounded-xl text-xs font-bold transition cursor-pointer shadow-2xs"
            title="Buka visualisasi vertikal layar penuh (pas di HP tanpa scroll horizontal)"
          >
            <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
            <span>Layar Penuh</span>
          </button>
        </div>

        {/* Visualizer Main Canvas Display (Horizontal Standard) */}
        <div className="w-full overflow-hidden">
          {instrumentView === 'fretboard' ? (
            <InteractiveFretboard
              highlightNotes={scaleNotes}
              rootNote={selectedRoot}
              maxFret={15}
              orientation="horizontal"
            />
          ) : (
            <InteractivePiano
              highlightNotes={scaleNotes}
              rootNote={selectedRoot}
              orientation="horizontal"
            />
          )}
        </div>
      </div>

      {/* 4. TENGAH: Tangga Nada & Box Rumus Formulasi Skala */}
      <div className="py-6 border-b border-[#E5E4DE] space-y-3">
        <div className="space-y-1.5">
          <div className="text-xs font-mono font-bold text-[#1C1917]">
            Tangga Nada {selectedRoot} Mayor:
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            {scaleNotes.map((note, idx) => (
              <span
                key={`${note}-${idx}`}
                className={`px-3 py-1.5 rounded-lg font-mono text-xs sm:text-sm font-bold border transition ${
                  idx === 0
                    ? 'bg-[#1C1917] text-[#FAF9F5] border-[#1C1917] shadow-2xs'
                    : 'bg-[#FFFFFF] text-[#1C1917] border-[#E5E4DE]'
                }`}
              >
                {note}
              </span>
            ))}
            {/* Nada Oktaf Penutup */}
            <span className="px-3 py-1.5 rounded-lg font-mono text-xs sm:text-sm font-bold border bg-[#1C1917] text-[#FAF9F5] border-[#1C1917] shadow-2xs">
              {selectedRoot}
            </span>
          </div>
        </div>

        {/* Box Rumus / Formulasi Tangga Nada */}
        <div className="p-3.5 bg-[#FAF9F5] border border-[#E5E4DE] rounded-xl space-y-2 text-xs shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 pb-2 border-b border-[#E5E4DE]/70">
            <div className="font-semibold text-[#1C1917] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#1C1917]" />
              <span>Rumus & Formulasi Skala {selectedRoot} Mayor</span>
            </div>
            <div className="font-mono text-[11px] font-bold text-[#1C1917] bg-[#FFFFFF] px-2.5 py-0.5 rounded-md border border-[#E5E4DE] self-start sm:self-auto">
              Rumus Jarak: 1 - 1 - ½ - 1 - 1 - 1 - ½
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-[11px] text-[#57534E]">
            <div>
              <span className="font-bold text-[#1C1917]">Derajat Interval: </span>
              <span className="font-mono">1 - 2 - 3 - 4 - 5 - 6 - 7 - 8</span>
            </div>
            <div>
              <span className="font-bold text-[#1C1917]">Karakter Suara: </span>
              <span>Terang, Cerah & Harmonis</span>
            </div>
            <div>
              <span className="font-bold text-[#1C1917]">Jarak Fret (Semitone): </span>
              <span className="font-mono">+2, +2, +1, +2, +2, +2, +1</span>
            </div>
          </div>
        </div>
      </div>

      {/* 5. BAWAH: Bar Kontrol Audio Interaktif */}
      <div className="py-4 border-b border-[#E5E4DE] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={handlePlayFullScaleAudio}
            className="flex items-center gap-2 px-3.5 py-2 bg-[#1C1917] hover:bg-[#292524] text-[#FAF9F5] rounded-xl text-xs font-bold transition cursor-pointer shadow-2xs"
            title="Bunyikan seluruh nada skala berurutan"
          >
            <Play className="w-3.5 h-3.5 fill-[#FAF9F5]" />
            <span>Bunyikan Seluruh Nada Skala</span>
          </button>
        </div>

        <div className="text-xs text-[#78716C] font-mono">
          Skala: <span className="font-bold text-[#1C1917]">{selectedRoot} Mayor</span> (7 Nada Diatonik)
        </div>
      </div>

      {/* 6. Pola & Pattern Belajar Skala (Dedicated Pattern Trainer) */}
      <div className="py-6 border-b border-[#E5E4DE] space-y-4">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#1C1917]" />
            <h3 className="text-sm sm:text-base font-bold text-[#1C1917]">
              Pola & Pattern Latihan Skala
            </h3>
          </div>
          <p className="text-xs text-[#78716C] mt-0.5">
            Diagram terpisah khusus latihan per pola/box. Gunakan navigasi untuk menelusuri tiap posisi pola satu per satu.
          </p>
        </div>

        {/* Category Tabs: 3NPS, CAGED Box, Pentatonik */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 text-xs">
          {[
            { key: '3nps', label: '3-Note Per String (7 Pola)' },
            { key: 'caged', label: 'CAGED Box (5 Pola)' },
            { key: 'pentatonic', label: 'Pentatonik Mayor (5 Box)' },
          ].map((cat) => (
            <button
              key={cat.key}
              onClick={() => handleSelectCategory(cat.key as any)}
              className={`px-3 py-1.5 rounded-xl font-medium transition cursor-pointer whitespace-nowrap border ${
                patternCategory === cat.key
                  ? 'bg-[#1C1917] text-[#FAF9F5] border-[#1C1917] font-bold shadow-2xs'
                  : 'bg-[#FFFFFF] text-[#78716C] border-[#E5E4DE] hover:bg-[#FAF9F5]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Stepper Navigation Bar */}
        <div className="flex items-center justify-between gap-2 p-2 bg-[#FFFFFF] border border-[#E5E4DE] rounded-xl shadow-2xs">
          <button
            type="button"
            onClick={handlePrevPattern}
            className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 bg-[#FAF9F5] hover:bg-[#F0EFEA] border border-[#E5E4DE] rounded-lg text-xs font-semibold text-[#1C1917] transition cursor-pointer shrink-0"
          >
            <ChevronLeft className="w-4 h-4 text-[#57534E]" />
            <span className="hidden sm:inline">Pola Sebelumnya</span>
            <span className="sm:hidden">Prev</span>
          </button>

          <div className="flex items-center gap-1 overflow-x-auto scrollbar-none px-1">
            {currentPatternList.map((pat, idx) => {
              const isActive = patternIndex === idx;
              const shortLabel = patternCategory === '3nps' ? `Pola ${idx + 1}` : `Box ${idx + 1}`;

              return (
                <button
                  key={pat.id}
                  type="button"
                  onClick={() => handleSelectPatternIndex(idx)}
                  className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition cursor-pointer whitespace-nowrap border ${
                    isActive
                      ? 'bg-[#1C1917] text-[#FAF9F5] border-[#1C1917] shadow-xs'
                      : 'bg-[#FAF9F5] text-[#57534E] border-[#E5E4DE] hover:bg-[#F5F4EE] hover:text-[#1C1917]'
                  }`}
                  title={pat.name}
                >
                  {shortLabel}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={handleNextPattern}
            className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 bg-[#FAF9F5] hover:bg-[#F0EFEA] border border-[#E5E4DE] rounded-lg text-xs font-semibold text-[#1C1917] transition cursor-pointer shrink-0"
          >
            <span className="hidden sm:inline">Pola Berikutnya</span>
            <span className="sm:hidden">Next</span>
            <ChevronRight className="w-4 h-4 text-[#57534E]" />
          </button>
        </div>

        {/* Pattern Meta Strip & Play Run Audio Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-1">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-bold text-[#1C1917]">
                {activePattern.name}
              </span>
              <span className="text-[10px] font-mono font-bold bg-[#FAF9F5] text-[#1C1917] px-2 py-0.5 rounded border border-[#E5E4DE]">
                Posisi {patternIndex + 1} dari {currentPatternList.length}
              </span>
              <span className="text-[10px] font-mono font-semibold bg-[#FAF9F5] text-[#78716C] px-2 py-0.5 rounded border border-[#E5E4DE]">
                Fret {activePatternFretRange[0]} s/d {activePatternFretRange[1]}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handlePlayPatternRun}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer border shadow-2xs self-start sm:self-auto ${
              isPlayingPatternAudio
                ? 'bg-rose-50 border-rose-200 text-rose-700 animate-pulse'
                : 'bg-[#FFFFFF] border-[#E5E4DE] text-[#1C1917] hover:bg-[#FAF9F5]'
            }`}
          >
            {isPlayingPatternAudio ? (
              <>
                <Square className="w-3.5 h-3.5 fill-rose-600 text-rose-600" />
                <span>Hentikan Alunan</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-[#1C1917] text-[#1C1917]" />
                <span>Dengarkan Pola (Run)</span>
              </>
            )}
          </button>
        </div>

        {/* Dedicated Pattern Fretboard Diagram */}
        <div className="w-full overflow-hidden">
          <InteractiveFretboard
            highlightNotes={activePatternScaleNotes}
            rootNote={selectedRoot}
            fretRange={activePatternFretRange}
            patternPositions={activePatternPositions}
            maxFret={15}
            isolateRange={true}
            showStrumButton={false}
            title={`Diagram Khusus: ${activePattern.name}`}
            subTitle={`Posisi presisi tanpa nada dobel (Fret ${activePatternFretRange[0]} s/d ${activePatternFretRange[1]})`}
          />
        </div>

        {/* Selected Pattern Description & Tips */}
        <div className="p-3.5 bg-[#FFFFFF] border border-[#E5E4DE] rounded-xl space-y-2 animate-fade-in shadow-2xs">
          <div className="text-xs text-[#44403C] leading-relaxed">
            <span className="font-semibold text-[#1C1917]">Deskripsi Pola: </span>
            {activePattern.description}
          </div>
          <div className="flex items-start gap-1.5 text-[11px] text-[#57534E] pt-2 border-t border-[#E5E4DE]/60">
            <Info className="w-3.5 h-3.5 shrink-0 text-[#78716C] mt-0.5" />
            <div>
              <span className="font-semibold text-[#1C1917]">Panduan Jari & Tips: </span>
              {activePattern.tips}
            </div>
          </div>
        </div>
      </div>

      {/* 7. Keluarga Akor Diatonik */}
      <div className="py-6 border-b border-[#E5E4DE] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Music className="w-4 h-4 text-[#1C1917]" />
              <h3 className="text-sm sm:text-base font-bold text-[#1C1917]">
                Keluarga Akor di Skala {selectedRoot} Mayor
              </h3>
            </div>
            <p className="text-xs text-[#78716C] mt-0.5">
              Tiap derajat tangga nada menghasilkan akor harmonis yang tidak akan pernah fals.
            </p>
          </div>

          <div className="inline-flex bg-[#F5F4EE] border border-[#E5E4DE] rounded-xl p-1 text-xs self-start sm:self-auto">
            <button
              onClick={() => setChordExtensionLevel('triad')}
              className={`px-3 py-1 rounded-lg font-semibold transition cursor-pointer ${
                chordExtensionLevel === 'triad'
                  ? 'bg-[#FFFFFF] text-[#1C1917] shadow-2xs'
                  : 'text-[#78716C] hover:text-[#1C1917]'
              }`}
            >
              Triad Standar
            </button>
            <button
              onClick={() => setChordExtensionLevel('seventh')}
              className={`px-3 py-1 rounded-lg font-semibold transition cursor-pointer ${
                chordExtensionLevel === 'seventh'
                  ? 'bg-[#FFFFFF] text-[#1C1917] shadow-2xs'
                  : 'text-[#78716C] hover:text-[#1C1917]'
              }`}
            >
              Akor 7th (Jazz/Pop)
            </button>
            <button
              onClick={() => setChordExtensionLevel('variation')}
              className={`px-3 py-1 rounded-lg font-semibold transition cursor-pointer ${
                chordExtensionLevel === 'variation'
                  ? 'bg-[#FFFFFF] text-[#1C1917] shadow-2xs'
                  : 'text-[#78716C] hover:text-[#1C1917]'
              }`}
            >
              Variasi Ext/Sus
            </button>
          </div>
        </div>

        {/* Diatonic Chord Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
          {diatonicChords.map((chord) => {
            const displaySymbol =
              chordExtensionLevel === 'seventh'
                ? chord.seventhSymbol
                : chordExtensionLevel === 'variation'
                ? chord.variationSymbol
                : chord.symbol;

            const isPlaying = playingChordSymbol === displaySymbol;

            return (
              <div
                key={chord.degreeRoman}
                onClick={() => handlePlayDiatonicChord(chord)}
                className={`p-3 bg-[#FFFFFF] border rounded-xl flex flex-col justify-between transition cursor-pointer shadow-2xs hover:border-[#1C1917] group ${
                  isPlaying ? 'border-[#1C1917] ring-2 ring-[#1C1917]' : 'border-[#E5E4DE]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-[#78716C] mb-1">
                    <span className="font-bold text-[#1C1917] bg-[#FAF9F5] px-1.5 py-0.2 rounded border border-[#E5E4DE]">
                      {chord.degreeRoman}
                    </span>
                    <span className="text-[9px] uppercase">{chord.role}</span>
                  </div>

                  <div className="text-lg font-black font-mono text-[#1C1917] group-hover:underline">
                    {displaySymbol}
                  </div>

                  <div className="text-[10px] text-[#78716C] font-mono mt-0.5">
                    {chord.notes.join(' - ')}
                  </div>
                </div>

                <div className="mt-2 pt-1.5 border-t border-[#E5E4DE] flex items-center justify-between text-[10px] text-[#57534E]">
                  <span className="truncate text-[9.5px]">{chord.functionDescription.slice(0, 16)}...</span>
                  <Volume2 className="w-3 h-3 text-[#78716C] group-hover:text-[#1C1917] shrink-0" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 8. Contoh Progresi Akor Populer */}
      <div className="py-6 space-y-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#1C1917]" />
            <h3 className="text-sm sm:text-base font-bold text-[#1C1917]">
              Contoh Progresi Akor Populer ({selectedRoot} Mayor)
            </h3>
          </div>
          <p className="text-xs text-[#78716C] mt-0.5">
            Pola perputaran akor yang paling sering digunakan musisi dunia untuk melahirkan melodi lagu hit.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {POPULAR_MAJOR_PROGRESSIONS.map((prog) => {
            const isPlaying = playingProgressionId === prog.id;
            const isCopied = copiedProgressionId === prog.id;

            const chordsInKey = prog.degrees.map((d) => {
              const c = diatonicChords[d - 1];
              if (!c) return '';
              if (chordExtensionLevel === 'seventh') return c.seventhSymbol;
              return c.symbol;
            });

            return (
              <div
                key={prog.id}
                className={`p-4 bg-[#FFFFFF] border rounded-2xl flex flex-col justify-between transition shadow-2xs ${
                  isPlaying ? 'border-[#1C1917] ring-2 ring-[#1C1917]' : 'border-[#E5E4DE]'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div>
                      <h4 className="text-sm font-bold text-[#1C1917]">
                        {prog.title}
                      </h4>
                      <span className="text-[11px] font-mono font-semibold text-[#78716C]">
                        {prog.roman}
                      </span>
                    </div>

                    <span className="text-[10px] font-mono text-[#57534E] bg-[#FAF9F5] px-2 py-0.5 rounded border border-[#E5E4DE]">
                      {prog.genreMood.split(',')[0]}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 my-2.5 flex-wrap">
                    {chordsInKey.map((chordName, idx) => (
                      <React.Fragment key={idx}>
                        <span className="px-2.5 py-1 bg-[#FAF9F5] border border-[#D6D3D1] rounded-lg font-mono text-xs sm:text-sm font-extrabold text-[#1C1917] shadow-2xs">
                          {chordName}
                        </span>
                        {idx < chordsInKey.length - 1 && (
                          <ChevronRight className="w-3.5 h-3.5 text-[#A8A29E]" />
                        )}
                      </React.Fragment>
                    ))}
                  </div>

                  <p className="text-xs text-[#57534E] leading-relaxed">
                    {prog.description}
                  </p>
                </div>

                <div className="flex items-center justify-between gap-2 mt-3 pt-2.5 border-t border-[#E5E4DE]">
                  <button
                    onClick={() => handlePlayProgression(prog)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF9F5] hover:bg-[#F0EFEA] border border-[#E5E4DE] text-[#1C1917] rounded-lg text-xs font-semibold transition cursor-pointer shadow-2xs"
                  >
                    {isPlaying ? (
                      <>
                        <Square className="w-3 h-3 text-rose-600 fill-rose-600 animate-pulse" />
                        <span className="text-rose-600">Berhenti</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3 h-3 text-[#1C1917] fill-[#1C1917]" />
                        <span>Dengarkan</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleCopyProgression(prog)}
                      className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-[#57534E] hover:text-[#1C1917] hover:bg-[#FAF9F5] rounded-lg transition cursor-pointer"
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-600 font-semibold">Tersalin</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Salin</span>
                        </>
                      )}
                    </button>

                    {onSendToLyric && (
                      <button
                        onClick={() => handleSendProgression(prog)}
                        className="flex items-center gap-1 px-2.5 py-1.5 bg-[#1C1917] text-[#FAF9F5] rounded-lg text-xs font-semibold hover:bg-[#292524] transition cursor-pointer shadow-xs"
                      >
                        <Send className="w-3 h-3" />
                        <span>Kirim ke Lirik</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 9. MODAL FULLSCREEN POP-UP (Vertical Instrument Facing Left + Fixed Right Control Strip) */}
      {isFullscreenOpen && (
        <div className="fixed inset-0 bg-[#0C0A09]/95 backdrop-blur-md z-50 p-2 sm:p-4 flex flex-row items-center justify-between overflow-hidden animate-fade-in text-[#FAF9F5]">
          {/* Main Visualizer Area (Facing Left: Nut at Top, Senar 6 on Left, Fret labels on Right) */}
          <div className="flex-1 h-full overflow-y-auto flex items-center justify-center p-1 sm:p-3">
            {instrumentView === 'fretboard' ? (
              <InteractiveFretboard
                highlightNotes={scaleNotes}
                rootNote={selectedRoot}
                maxFret={15}
                orientation="vertical"
              />
            ) : (
              <InteractivePiano
                highlightNotes={scaleNotes}
                rootNote={selectedRoot}
                orientation="vertical"
                octaveBase={popupOctave}
              />
            )}
          </div>

          {/* Right-Side Control Strip (Spacious w-16, Fixed Tabs at Top, Octave Slot, Bunyi at Bottom) */}
          <div className="h-full flex flex-col items-center justify-between py-3 px-1.5 bg-[#1C1917]/95 border-l border-[#292524] rounded-2xl shrink-0 w-16 sm:w-20 shadow-2xl z-20">
            {/* Top: Close Button X + Fixed Instrument Tabs */}
            <div className="w-full flex flex-col items-center gap-3">
              {/* Close Button X */}
              <button
                onClick={() => setIsFullscreenOpen(false)}
                className="w-11 h-11 rounded-xl bg-[#292524] hover:bg-[#44403C] border border-[#44403C] text-white flex items-center justify-center transition cursor-pointer shadow-md shrink-0 active:scale-95"
                title="Tutup Layar Penuh"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Fixed Instrument Tab Selector (Gitar / Piano) */}
              <div className="flex flex-col gap-1.5 bg-[#292524] p-1.5 rounded-2xl border border-[#44403C] shadow-inner w-full">
                <button
                  onClick={() => setInstrumentView('fretboard')}
                  className={`w-full h-16 rounded-xl font-bold text-xs transition cursor-pointer flex items-center justify-center ${
                    instrumentView === 'fretboard'
                      ? 'bg-[#FAF9F5] text-[#1C1917] shadow-sm'
                      : 'text-[#A8A29E] hover:text-white'
                  }`}
                  title="Pilih Fretboard Gitar"
                >
                  <span className="rotate-90 inline-block font-mono tracking-wider font-extrabold text-[11px]">Gitar</span>
                </button>
                <button
                  onClick={() => setInstrumentView('piano')}
                  className={`w-full h-16 rounded-xl font-bold text-xs transition cursor-pointer flex items-center justify-center ${
                    instrumentView === 'piano'
                      ? 'bg-[#FAF9F5] text-[#1C1917] shadow-sm'
                      : 'text-[#A8A29E] hover:text-white'
                  }`}
                  title="Pilih Keyboard Piano"
                >
                  <span className="rotate-90 inline-block font-mono tracking-wider font-extrabold text-[11px]">Piano</span>
                </button>
              </div>
            </div>

            {/* Middle Section: Octave Controls (Dedicated slot, doesn't shift tabs) */}
            <div className="w-full flex flex-col items-center my-auto py-2">
              {instrumentView === 'piano' && (
                <div className="flex flex-col items-center gap-1.5 bg-[#292524] p-1.5 rounded-xl border border-[#44403C] w-full animate-fade-in shadow-inner">
                  <button
                    onClick={() => setPopupOctave(prev => Math.min(5, prev + 1))}
                    disabled={popupOctave >= 5}
                    className="w-full h-7 rounded-lg bg-[#1C1917] hover:bg-[#383533] text-white flex items-center justify-center font-bold text-sm disabled:opacity-30 cursor-pointer"
                    title="Oktav Naik"
                  >
                    <span className="rotate-90 inline-block">+</span>
                  </button>
                  <div className="py-1 flex items-center justify-center font-mono font-bold text-xs text-amber-400">
                    <span className="rotate-90 inline-block">Okt {popupOctave}</span>
                  </div>
                  <button
                    onClick={() => setPopupOctave(prev => Math.max(2, prev - 1))}
                    disabled={popupOctave <= 2}
                    className="w-full h-7 rounded-lg bg-[#1C1917] hover:bg-[#383533] text-white flex items-center justify-center font-bold text-sm disabled:opacity-30 cursor-pointer"
                    title="Oktav Turun"
                  >
                    <span className="rotate-90 inline-block">-</span>
                  </button>
                </div>
              )}
            </div>

            {/* Bottom: Play/Strum Button */}
            <button
              onClick={() => {
                if (instrumentView === 'fretboard') {
                  GUITAR_STRINGS.forEach((str, idx) => {
                    sound.playGuitarNote(str.openNote, str.openOctave, 2.0, idx * 0.04);
                  });
                } else {
                  handlePlayFullScaleAudio();
                }
              }}
              className="w-full h-24 bg-[#FAF9F5] hover:bg-white text-[#1C1917] rounded-2xl font-bold text-xs transition cursor-pointer shadow-lg border border-[#E5E4DE] active:scale-95 flex items-center justify-center shrink-0"
              title="Bunyikan Suara"
            >
              <div className="rotate-90 flex items-center justify-center gap-2 whitespace-nowrap">
                <Volume2 className="w-4 h-4 text-[#1C1917] shrink-0" />
                <span className="font-mono font-extrabold text-[11px] tracking-wide">Bunyikan</span>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
