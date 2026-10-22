import React from 'react';
import { ChordDictionaryItem } from '../../types';
import { Volume2 } from 'lucide-react';

interface ChordDictionaryCardProps {
  chord: ChordDictionaryItem;
  isSelected: boolean;
  onSelect: (chord: ChordDictionaryItem) => void;
}

export const ChordDictionaryCard: React.FC<ChordDictionaryCardProps> = ({
  chord,
  isSelected,
  onSelect,
}) => {
  return (
    <button
      onClick={() => onSelect(chord)}
      className={`p-3 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between group ${
        isSelected
          ? 'bg-[#1C1917] text-[#FAF9F5] border-[#1C1917] shadow-xs'
          : 'bg-[#FAF9F5] border-[#E5E4DE] hover:bg-[#F5F4EE] text-[#1C1917]'
      }`}
    >
      <div className="flex items-center justify-between w-full">
        <span className="text-base font-bold font-mono tracking-tight">
          {chord.symbol}
        </span>
        <Volume2 className={`w-3.5 h-3.5 ${isSelected ? 'text-[#D6D3D1]' : 'text-[#78716C]'}`} />
      </div>
      <div className={`text-[10px] font-mono mt-1 ${isSelected ? 'text-[#A8A29E]' : 'text-[#78716C]'}`}>
        {chord.formula}
      </div>
      <div className="text-[11px] font-medium truncate mt-2">
        {chord.name}
      </div>
    </button>
  );
};

interface ChordFingeringDetailProps {
  chord: ChordDictionaryItem;
  onPlay: () => void;
}

export const ChordFingeringDetail: React.FC<ChordFingeringDetailProps> = ({ chord, onPlay }) => {
  return (
    <div className="p-4 bg-[#FAF9F5] border border-[#E5E4DE] rounded-xl space-y-3 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#E5E4DE]">
        <div className="flex items-baseline gap-2">
          <span className="text-xl font-bold font-mono text-[#1C1917]">
            {chord.name} ({chord.symbol})
          </span>
          <span className="text-xs text-[#78716C] font-mono">
            Formula: {chord.formula}
          </span>
        </div>
        <button
          onClick={onPlay}
          className="flex items-center gap-1.5 px-3 py-1 bg-[#FFFFFF] border border-[#E5E4DE] hover:bg-[#F5F4EE] rounded-md text-xs font-semibold text-[#1C1917] transition cursor-pointer self-start sm:self-auto"
        >
          <Volume2 className="w-3.5 h-3.5 text-[#57534E]" />
          <span>Dengar Ulang</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div>
          <div className="text-[11px] font-semibold text-[#78716C] uppercase font-mono">
            Karakter Rasa & Nada Penyusun
          </div>
          <p className="text-sm font-medium text-[#1C1917] mt-0.5">
            "{chord.feeling}"
          </p>
          <div className="flex items-center gap-1.5 mt-2 font-mono">
            <span className="text-[#78716C]">Nada:</span>
            <span className="font-bold text-[#1C1917] bg-[#FFFFFF] px-2 py-0.5 rounded border border-[#E5E4DE]">
              {chord.notesExample}
            </span>
          </div>
        </div>

        {chord.fingering && (
          <div className="p-3 bg-[#FFFFFF] border border-[#E5E4DE] rounded-lg space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="font-semibold text-[#1C1917]">POSISI SENAR GITAR</span>
              <span className="text-[#78716C]">Senar 6 ➔ 1</span>
            </div>

            <div className="flex items-center gap-1 font-mono text-center">
              {chord.fingering.frets.map((fret, sIdx) => (
                <div key={sIdx} className="flex-1 py-1 px-0.5 rounded bg-[#FAF9F5] border border-[#E5E4DE]">
                  <div className="text-[9px] text-[#A8A29E]">S{6 - sIdx}</div>
                  <div className={`text-xs font-bold ${fret === 'x' ? 'text-rose-600' : 'text-[#1C1917]'}`}>
                    {fret}
                  </div>
                </div>
              ))}
            </div>

            <p className="text-[11px] text-[#57534E] leading-normal pt-1">
              {chord.fingering.description}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
