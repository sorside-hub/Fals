import React, { useState } from 'react';
import { CHROMATIC_NOTES } from '../utils/musicTheory';
import { sound } from '../utils/audioEngine';
import { Volume2 } from 'lucide-react';

interface InteractivePianoProps {
  highlightNotes?: string[]; // Note names to highlight, e.g. ['C', 'E', 'G']
  rootNote?: string;
  onNoteClick?: (note: string, octave: number) => void;
  title?: string;
  subtitle?: string;
}

export const InteractivePiano: React.FC<InteractivePianoProps> = ({
  highlightNotes = [],
  rootNote = 'C',
  onNoteClick,
  title,
  subtitle,
}) => {
  const [octaveBase, setOctaveBase] = useState<number>(4);
  const [activeKey, setActiveKey] = useState<string | null>(null);

  // Generate 2 octaves of keys
  const octaves = [octaveBase, octaveBase + 1];

  const handleKeyPress = (note: string, octave: number) => {
    setActiveKey(`${note}${octave}`);
    sound.playNote(note, octave);
    if (onNoteClick) {
      onNoteClick(note, octave);
    }
    setTimeout(() => {
      setActiveKey(null);
    }, 200);
  };

  const isHighlighted = (note: string) => {
    return highlightNotes.some(n => n.toUpperCase() === note.toUpperCase());
  };

  const isRoot = (note: string) => {
    return rootNote && rootNote.toUpperCase() === note.toUpperCase();
  };

  // Play all highlighted notes as an arpeggiated chord
  const handlePlayArpeggio = () => {
    if (highlightNotes.length === 0) return;
    highlightNotes.forEach((note, idx) => {
      sound.playNote(note, octaveBase, 1.2, idx * 0.12);
    });
  };

  return (
    <div className="w-full bg-[#FAF9F5] border border-[#E5E4DE] rounded-xl p-3 sm:p-4 shadow-2xs">
      {/* Header controls */}
      <div className="flex items-center justify-between pb-3 mb-2 border-b border-[#F0EFEA] text-xs">
        <div>
          <h4 className="font-semibold text-sm text-[#1C1917] tracking-tight">
            {title || 'Piano Roll Virtual'}
          </h4>
          <p className="text-[11px] text-[#78716C]">
            {subtitle || 'Sentuh tuts untuk membunyikan nada secara instan'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {highlightNotes.length > 0 && (
            <button
              onClick={handlePlayArpeggio}
              className="flex items-center gap-1 px-2.5 py-1 bg-[#F5F4EE] hover:bg-[#EAE8DF] border border-[#E5E4DE] rounded-md text-[#1C1917] font-medium transition cursor-pointer"
              title="Bunyikan semua nada terpilih bersamaan"
            >
              <Volume2 className="w-3.5 h-3.5 text-[#57534E]" />
              <span>Dengar Nada</span>
            </button>
          )}

          <div className="flex items-center bg-[#F5F4EE] border border-[#E5E4DE] rounded-md p-0.5 font-mono text-[11px]">
            <button
              onClick={() => setOctaveBase(prev => Math.max(2, prev - 1))}
              disabled={octaveBase <= 2}
              className="px-2 py-0.5 text-[#44403C] hover:text-[#1C1917] disabled:opacity-30 cursor-pointer"
            >
              -
            </button>
            <span className="px-1.5 text-[#78716C]">Oktav {octaveBase}</span>
            <button
              onClick={() => setOctaveBase(prev => Math.min(5, prev + 1))}
              disabled={octaveBase >= 5}
              className="px-2 py-0.5 text-[#44403C] hover:text-[#1C1917] disabled:opacity-30 cursor-pointer"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Keyboard visual container */}
      <div className="relative w-full overflow-x-auto pb-2 scrollbar-thin select-none">
        <div className="relative inline-flex min-w-[560px] sm:min-w-full h-36 bg-[#F5F4EE] p-1.5 rounded-lg border border-[#E5E4DE]">
          {octaves.map(octave => (
            <div key={octave} className="relative flex-1 flex h-full">
              {/* White keys */}
              {['C', 'D', 'E', 'F', 'G', 'A', 'B'].map((note) => {
                const keyId = `${note}${octave}`;
                const highlighted = isHighlighted(note);
                const root = isRoot(note);
                const isPressed = activeKey === keyId;

                return (
                  <button
                    key={keyId}
                    onClick={() => handleKeyPress(note, octave)}
                    className={`relative flex-1 h-full rounded-b-md border-r last:border-r-0 border-[#E2DFD7] transition-all cursor-pointer flex flex-col justify-end items-center pb-2 ${
                      isPressed
                        ? 'bg-[#E5E2D9] scale-y-[0.98]'
                        : highlighted
                        ? root
                          ? 'bg-[#EAE8DF] shadow-inner'
                          : 'bg-[#F2EFE8]'
                        : 'bg-[#FFFFFF] hover:bg-[#FAF9F5]'
                    }`}
                  >
                    {highlighted && (
                      <span
                        className={`w-2.5 h-2.5 rounded-full mb-1.5 ${
                          root ? 'bg-[#1C1917]' : 'bg-[#78716C]'
                        }`}
                      />
                    )}
                    <span
                      className={`text-[11px] font-mono font-medium ${
                        highlighted
                          ? root
                            ? 'text-[#1C1917] font-bold'
                            : 'text-[#44403C]'
                          : 'text-[#A8A29E]'
                      }`}
                    >
                      {note}
                      <span className="text-[9px] text-[#A8A29E] ml-0.5">{octave}</span>
                    </span>
                  </button>
                );
              })}

              {/* Black keys overlay */}
              <div className="absolute top-0 left-0 right-0 h-[62%] pointer-events-none flex">
                {/* Octave black key positions based on 7 white keys */}
                {[
                  { note: 'C#', left: '10.5%' },
                  { note: 'D#', left: '25%' },
                  { note: 'F#', left: '53.5%' },
                  { note: 'G#', left: '68%' },
                  { note: 'A#', left: '82.5%' },
                ].map(({ note, left }) => {
                  const keyId = `${note}${octave}`;
                  const highlighted = isHighlighted(note);
                  const root = isRoot(note);
                  const isPressed = activeKey === keyId;

                  return (
                    <button
                      key={keyId}
                      onClick={() => handleKeyPress(note, octave)}
                      style={{ left }}
                      className={`pointer-events-auto absolute -translate-x-1/2 w-[9.5%] h-full rounded-b-sm shadow-md transition-all cursor-pointer flex flex-col justify-end items-center pb-1.5 z-10 ${
                        isPressed
                          ? 'bg-[#44403C] scale-y-[0.97]'
                          : highlighted
                          ? root
                            ? 'bg-[#1C1917] ring-2 ring-[#78716C]'
                            : 'bg-[#292524] ring-1 ring-[#A8A29E]'
                          : 'bg-[#1C1917] hover:bg-[#292524]'
                      }`}
                    >
                      {highlighted && (
                        <span
                          className={`w-1.5 h-1.5 rounded-full mb-1 ${
                            root ? 'bg-[#FAF9F5]' : 'bg-[#D6D3D1]'
                          }`}
                        />
                      )}
                      <span className="text-[8.5px] font-mono text-[#D6D3D1]">
                        {note}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Legend & quick note labels */}
      {highlightNotes.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mt-2 pt-2 border-t border-[#F0EFEA] text-[11px] text-[#78716C]">
          <span className="font-medium text-[#1C1917]">Nada Aktif:</span>
          {highlightNotes.map(note => {
            const root = isRoot(note);
            return (
              <button
                key={note}
                onClick={() => sound.playNote(note, octaveBase)}
                className={`px-2 py-0.5 rounded font-mono border cursor-pointer transition ${
                  root
                    ? 'bg-[#1C1917] text-[#FAF9F5] border-[#1C1917]'
                    : 'bg-[#F5F4EE] text-[#44403C] border-[#E5E4DE] hover:bg-[#EAE8DF]'
                }`}
              >
                {note} {root && '(Root)'}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
