import React, { useState } from 'react';
import { CIRCLE_OF_FIFTHS, CHROMATIC_NOTES } from '../utils/musicTheory';
import { sound } from '../utils/audioEngine';
import { Play, Volume2 } from 'lucide-react';

interface CircleOfFifthsProps {
  onSelectKey?: (majorKey: string, minorKey: string) => void;
}

export const CircleOfFifths: React.FC<CircleOfFifthsProps> = ({ onSelectKey }) => {
  const [selectedIdx, setSelectedIdx] = useState<number>(0); // 0 is C Major / A Minor

  const current = CIRCLE_OF_FIFTHS[selectedIdx];
  const prevIdx = (selectedIdx - 1 + CIRCLE_OF_FIFTHS.length) % CIRCLE_OF_FIFTHS.length;
  const nextIdx = (selectedIdx + 1) % CIRCLE_OF_FIFTHS.length;

  const ivChord = CIRCLE_OF_FIFTHS[prevIdx].major; // Subdominant (IV)
  const vChord = CIRCLE_OF_FIFTHS[nextIdx].major;  // Dominant (V)
  const iiChord = CIRCLE_OF_FIFTHS[prevIdx].minor; // Supertonic minor (ii)
  const viChord = current.minor;                   // Relative minor (vi)
  const iiiChord = CIRCLE_OF_FIFTHS[nextIdx].minor;// Mediant minor (iii)

  const handleSelect = (idx: number) => {
    setSelectedIdx(idx);
    const item = CIRCLE_OF_FIFTHS[idx];
    sound.playChord(item.major, [0, 4, 7], 4);
    if (onSelectKey) {
      onSelectKey(item.major, item.minor);
    }
  };

  // Play family progression I - IV - V - vi
  const handlePlayFamily = () => {
    sound.playChord(current.major, [0, 4, 7], 4, true);
    setTimeout(() => sound.playChord(ivChord, [0, 4, 7], 4, true), 500);
    setTimeout(() => sound.playChord(vChord, [0, 4, 7], 4, true), 1000);
    setTimeout(() => sound.playChord(viChord.replace('m', ''), [0, 3, 7], 4, true), 1500);
  };

  const cx = 160;
  const cy = 160;
  const outerR = 120;
  const innerR = 76;

  return (
    <div className="w-full bg-[#FAF9F5] border border-[#E5E4DE] rounded-xl p-4 shadow-2xs">
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#F0EFEA]">
        <div>
          <h4 className="font-semibold text-sm text-[#1C1917] tracking-tight">
            Circle of Fifths (Lingkaran Kuint)
          </h4>
          <p className="text-[11px] text-[#78716C]">
            Pilih nada dasar untuk melihat keluarga akor harmonis & relative minornya.
          </p>
        </div>

        <button
          onClick={handlePlayFamily}
          className="flex items-center gap-1 px-2.5 py-1 text-xs bg-[#F5F4EE] hover:bg-[#EAE8DF] border border-[#E5E4DE] rounded-md text-[#1C1917] font-medium transition cursor-pointer"
          title="Dengarkan progresi akor keluarga I - IV - V - vi"
        >
          <Play className="w-3.5 h-3.5 text-[#57534E]" />
          <span>Bunyikan Progresi</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        {/* SVG Interactive Wheel */}
        <div className="flex justify-center select-none py-2">
          <svg viewBox="0 0 320 320" className="w-64 h-64 sm:w-72 sm:h-72">
            {/* Background rings */}
            <circle cx={cx} cy={cy} r={outerR + 25} fill="#FBFBF9" stroke="#E5E4DE" strokeWidth="1.5" />
            <circle cx={cx} cy={cy} r={outerR} fill="#FAF9F5" stroke="#E2DFD7" strokeWidth="1" strokeDasharray="3 3" />
            <circle cx={cx} cy={cy} r={innerR} fill="#F5F3EC" stroke="#D6D3D1" strokeWidth="1" />
            <circle cx={cx} cy={cy} r="38" fill="#FAF9F5" stroke="#E5E4DE" strokeWidth="1" />

            {/* Center label */}
            <text x={cx} y={cy - 4} textAnchor="middle" className="text-[10px] font-mono fill-[#78716C] font-semibold">
              KUNCI
            </text>
            <text x={cx} y={cy + 12} textAnchor="middle" className="text-[14px] font-mono font-bold fill-[#1C1917]">
              {current.major}
            </text>

            {/* 12 Sectors */}
            {CIRCLE_OF_FIFTHS.map((item, idx) => {
              // 12 positions on circle (starting at top = -90 deg)
              const angle = (idx * 30 - 90) * (Math.PI / 180);
              const outerX = cx + Math.cos(angle) * outerR;
              const outerY = cy + Math.sin(angle) * outerR;
              const innerX = cx + Math.cos(angle) * innerR;
              const innerY = cy + Math.sin(angle) * innerR;

              const isSelected = idx === selectedIdx;
              const isNeighbor = idx === prevIdx || idx === nextIdx;

              return (
                <g key={item.major} className="cursor-pointer" onClick={() => handleSelect(idx)}>
                  {/* Outer Major Key Button */}
                  <circle
                    cx={outerX}
                    cy={outerY}
                    r={isSelected ? 16 : isNeighbor ? 14 : 13}
                    className={`transition-all ${
                      isSelected
                        ? 'fill-[#1C1917] stroke-[#1C1917]'
                        : isNeighbor
                        ? 'fill-[#EAE8DF] stroke-[#A8A29E]'
                        : 'fill-[#FFFFFF] stroke-[#E5E4DE] hover:fill-[#FAF9F5]'
                    }`}
                    strokeWidth={isSelected ? 2 : 1}
                  />
                  <text
                    x={outerX}
                    y={outerY + 4}
                    textAnchor="middle"
                    className={`text-[11px] font-mono font-bold pointer-events-none ${
                      isSelected ? 'fill-[#FAF9F5]' : isNeighbor ? 'fill-[#1C1917]' : 'fill-[#44403C]'
                    }`}
                  >
                    {item.major}
                  </text>

                  {/* Inner Minor Key */}
                  <circle
                    cx={innerX}
                    cy={innerY}
                    r={isSelected ? 13 : isNeighbor ? 12 : 11}
                    className={`transition-all ${
                      isSelected
                        ? 'fill-[#44403C] stroke-[#1C1917]'
                        : isNeighbor
                        ? 'fill-[#E2DFD7] stroke-[#A8A29E]'
                        : 'fill-[#F5F4EE] stroke-[#E5E4DE] hover:fill-[#EAE8DF]'
                    }`}
                    strokeWidth="1"
                  />
                  <text
                    x={innerX}
                    y={innerY + 3.5}
                    textAnchor="middle"
                    className={`text-[9.5px] font-mono font-medium pointer-events-none ${
                      isSelected ? 'fill-[#FAF9F5]' : 'fill-[#57534E]'
                    }`}
                  >
                    {item.minor}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Family Chords Breakdown & Explanations */}
        <div className="space-y-3">
          <div className="p-3 bg-[#F5F4EE] rounded-lg border border-[#E5E4DE]">
            <div className="flex items-center justify-between text-xs text-[#78716C] mb-2 font-mono">
              <span>NADA DASAR AKTIF</span>
              <span>{current.accidentals}</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold font-mono text-[#1C1917]">{current.major} Mayor</span>
              <span className="text-xs text-[#78716C] font-mono">/ {current.minor} Relative Minor</span>
            </div>
          </div>

          <div>
            <h5 className="text-xs font-semibold text-[#1C1917] mb-1.5 uppercase tracking-wide">
              6 Akor Keluarga {current.major} (Dijamin Harmonis)
            </h5>
            <div className="grid grid-cols-3 gap-1.5 text-center font-mono">
              <div
                onClick={() => sound.playChord(current.major, [0, 4, 7])}
                className="p-2 bg-[#FFFFFF] border-2 border-[#1C1917] rounded-md cursor-pointer hover:bg-[#FAF9F5]"
              >
                <div className="text-[10px] text-[#78716C]">Tonic (I)</div>
                <div className="text-sm font-bold text-[#1C1917]">{current.major}</div>
              </div>

              <div
                onClick={() => sound.playChord(ivChord, [0, 4, 7])}
                className="p-2 bg-[#FFFFFF] border border-[#D6D3D1] rounded-md cursor-pointer hover:bg-[#FAF9F5]"
              >
                <div className="text-[10px] text-[#78716C]">Subdom (IV)</div>
                <div className="text-sm font-semibold text-[#1C1917]">{ivChord}</div>
              </div>

              <div
                onClick={() => sound.playChord(vChord, [0, 4, 7])}
                className="p-2 bg-[#FFFFFF] border border-[#D6D3D1] rounded-md cursor-pointer hover:bg-[#FAF9F5]"
              >
                <div className="text-[10px] text-[#78716C]">Dominant (V)</div>
                <div className="text-sm font-semibold text-[#1C1917]">{vChord}</div>
              </div>

              <div
                onClick={() => sound.playChord(iiChord.replace('m', ''), [0, 3, 7])}
                className="p-2 bg-[#FFFFFF] border border-[#E5E4DE] rounded-md cursor-pointer hover:bg-[#FAF9F5]"
              >
                <div className="text-[10px] text-[#78716C]">Supertonic (ii)</div>
                <div className="text-sm font-medium text-[#44403C]">{iiChord}</div>
              </div>

              <div
                onClick={() => sound.playChord(iiiChord.replace('m', ''), [0, 3, 7])}
                className="p-2 bg-[#FFFFFF] border border-[#E5E4DE] rounded-md cursor-pointer hover:bg-[#FAF9F5]"
              >
                <div className="text-[10px] text-[#78716C]">Mediant (iii)</div>
                <div className="text-sm font-medium text-[#44403C]">{iiiChord}</div>
              </div>

              <div
                onClick={() => sound.playChord(viChord.replace('m', ''), [0, 3, 7])}
                className="p-2 bg-[#FFFFFF] border border-[#1C1917]/50 rounded-md cursor-pointer hover:bg-[#FAF9F5]"
              >
                <div className="text-[10px] text-[#78716C]">Submed (vi)</div>
                <div className="text-sm font-semibold text-[#1C1917]">{viChord}</div>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-[#78716C] leading-relaxed">
            💡 <strong>Rumus Progresi Hits:</strong> Mainkan <code className="text-[#1C1917] font-semibold">{current.major} → {vChord} → {viChord} → {ivChord}</code> (I-V-vi-IV). Ini progresi yang dipakai di ratusan lagu pop dunia!
          </p>
        </div>
      </div>
    </div>
  );
};
