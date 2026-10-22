import React, { useState } from 'react';
import { GUITAR_STRINGS, getGuitarFretNote } from '../utils/musicTheory';
import { sound } from '../utils/audioEngine';
import { Volume2 } from 'lucide-react';

interface InteractiveFretboardProps {
  highlightNotes?: string[];
  rootNote?: string;
  onNoteClick?: (note: string, fret: number, stringNum: number) => void;
  title?: string;
}

export const InteractiveFretboard: React.FC<InteractiveFretboardProps> = ({
  highlightNotes = [],
  rootNote = 'C',
  onNoteClick,
  title
}) => {
  const frets = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const [activeFretPos, setActiveFretPos] = useState<string | null>(null);

  const isHighlighted = (note: string) => {
    return highlightNotes.some(n => n.toUpperCase() === note.toUpperCase());
  };

  const isRoot = (note: string) => {
    return rootNote && rootNote.toUpperCase() === note.toUpperCase();
  };

  const handleFretClick = (openNote: string, openOctave: number, fret: number, stringNum: number) => {
    const { note, octaveDiff } = getGuitarFretNote(openNote, fret);
    const finalOctave = openOctave + octaveDiff;
    const posId = `${stringNum}-${fret}`;

    setActiveFretPos(posId);
    sound.playNote(note, finalOctave);

    if (onNoteClick) {
      onNoteClick(note, fret, stringNum);
    }

    setTimeout(() => {
      setActiveFretPos(null);
    }, 200);
  };

  // Strum all 6 open strings
  const handleStrumOpen = () => {
    GUITAR_STRINGS.forEach((str, idx) => {
      sound.playNote(str.openNote, str.openOctave, 1.5, idx * 0.04);
    });
  };

  return (
    <div className="w-full bg-[#FAF9F5] border border-[#E5E4DE] rounded-xl p-3 sm:p-4 shadow-2xs">
      <div className="flex items-center justify-between pb-3 mb-2 border-b border-[#F0EFEA] text-xs">
        <div>
          <h4 className="font-semibold text-sm text-[#1C1917] tracking-tight">
            {title || 'Fretboard Gitar Interaktif (6 Senar x 12 Fret)'}
          </h4>
          <p className="text-[11px] text-[#78716C]">
            Tuning Standar (E A D G B E). Ketuk fret untuk membunyikan posisi jari.
          </p>
        </div>

        <button
          onClick={handleStrumOpen}
          className="flex items-center gap-1 px-2.5 py-1 bg-[#F5F4EE] hover:bg-[#EAE8DF] border border-[#E5E4DE] rounded-md text-[#1C1917] font-medium transition cursor-pointer text-xs"
          title="Strum senar gitar"
        >
          <Volume2 className="w-3.5 h-3.5 text-[#57534E]" />
          <span>Genjreng Senar</span>
        </button>
      </div>

      {/* Fretboard visual */}
      <div className="w-full overflow-x-auto pb-2 scrollbar-thin select-none">
        <div className="inline-block min-w-[700px] sm:min-w-full bg-[#FAF9F5] border border-[#E2DFD7] rounded-lg p-2">
          {/* Fret numbers header */}
          <div className="grid grid-cols-[50px_repeat(12,1fr)] text-center text-[10px] font-mono text-[#78716C] pb-1 border-b border-[#E5E4DE]">
            <span>Nut (0)</span>
            {frets.slice(1).map(f => (
              <span key={f} className={f === 3 || f === 5 || f === 7 || f === 9 || f === 12 ? 'font-bold text-[#1C1917]' : ''}>
                {f}
              </span>
            ))}
          </div>

          {/* Strings 1 to 6 */}
          <div className="relative mt-1">
            {GUITAR_STRINGS.map((guitarString) => {
              // String thickness styling: String 1 is 1px, String 6 is 3.5px
              const thickness = 1 + (guitarString.stringNumber - 1) * 0.5;

              return (
                <div
                  key={guitarString.stringNumber}
                  className="grid grid-cols-[50px_repeat(12,1fr)] h-8 sm:h-9 items-center relative group border-b border-[#F5F4EE] last:border-b-0"
                >
                  {/* Metal string line drawn through */}
                  <div
                    className="absolute left-[50px] right-0 bg-[#A8A29E]/60 pointer-events-none"
                    style={{ height: `${thickness}px`, top: '50%', transform: 'translateY(-50%)' }}
                  />

                  {/* Nut note (Fret 0) */}
                  {(() => {
                    const { note } = getGuitarFretNote(guitarString.openNote, 0);
                    const highlighted = isHighlighted(note);
                    const root = isRoot(note);
                    const isPressed = activeFretPos === `${guitarString.stringNumber}-0`;

                    return (
                      <button
                        onClick={() => handleFretClick(guitarString.openNote, guitarString.openOctave, 0, guitarString.stringNumber)}
                        className={`h-7 w-9 mx-auto rounded flex items-center justify-center font-mono text-[11px] font-medium border transition-transform cursor-pointer z-10 ${
                          isPressed
                            ? 'scale-90 bg-[#D6D3D1]'
                            : highlighted
                            ? root
                              ? 'bg-[#1C1917] text-[#FAF9F5] border-[#1C1917] font-bold'
                              : 'bg-[#44403C] text-[#FAF9F5] border-[#44403C]'
                            : 'bg-[#F5F4EE] text-[#57534E] border-[#E5E4DE] hover:bg-[#EAE8DF]'
                        }`}
                      >
                        {note}
                      </button>
                    );
                  })()}

                  {/* Frets 1 to 12 */}
                  {frets.slice(1).map(fret => {
                    const { note, octaveDiff } = getGuitarFretNote(guitarString.openNote, fret);
                    const highlighted = isHighlighted(note);
                    const root = isRoot(note);
                    const isPressed = activeFretPos === `${guitarString.stringNumber}-${fret}`;

                    return (
                      <div
                        key={fret}
                        className="relative h-full flex items-center justify-center border-r border-[#E2DFD7] last:border-r-0"
                      >
                        {/* Fret marker dots on string 3-4 gap for fret 3, 5, 7, 9, 12 */}
                        {guitarString.stringNumber === 3 && (fret === 3 || fret === 5 || fret === 7 || fret === 9) && (
                          <div className="absolute top-full -translate-y-1/2 w-2 h-2 rounded-full bg-[#E5E4DE] pointer-events-none z-0" />
                        )}
                        {guitarString.stringNumber === 3 && fret === 12 && (
                          <div className="absolute top-full -translate-y-1/2 flex gap-1 pointer-events-none z-0">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#D4D2C9]" />
                            <span className="w-1.5 h-1.5 rounded-full bg-[#D4D2C9]" />
                          </div>
                        )}

                        <button
                          onClick={() => handleFretClick(guitarString.openNote, guitarString.openOctave, fret, guitarString.stringNumber)}
                          className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center font-mono text-[10px] transition-all cursor-pointer z-10 ${
                            isPressed
                              ? 'scale-90 bg-[#D6D3D1]'
                              : highlighted
                              ? root
                                ? 'bg-[#1C1917] text-[#FAF9F5] shadow-xs ring-1 ring-[#1C1917] font-bold'
                                : 'bg-[#EAE8DF] text-[#1C1917] border border-[#A8A29E] font-medium'
                              : 'opacity-0 group-hover:opacity-40 hover:opacity-100 bg-[#FFFFFF] border border-[#E5E4DE] text-[#78716C]'
                          }`}
                          title={`Senar ${guitarString.stringNumber}, Fret ${fret}: Nada ${note} (Oktav ${guitarString.openOctave + octaveDiff})`}
                        >
                          {note}
                        </button>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 mt-2 pt-2 border-t border-[#F0EFEA] text-[11px] text-[#78716C]">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-[#1C1917] inline-block" />
            <span className="text-[#1C1917] font-medium">Root Note ({rootNote})</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-[#EAE8DF] border border-[#A8A29E] inline-block" />
            <span>Nada dalam Tangga Nada / Akor</span>
          </span>
        </div>
        <span>Titik penanda pada fret: 3, 5, 7, 9, 12 (oktav)</span>
      </div>
    </div>
  );
};
