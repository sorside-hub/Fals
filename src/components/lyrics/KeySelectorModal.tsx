import React, { useState, useEffect } from 'react';
import { X, ChevronDown } from 'lucide-react';

export interface KeySelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentKey: string;
  onSelectKey: (key: string) => void;
}

// 4x3 Circle of Fifths layout
// Row 1: C, G, D, A
// Row 2: E, B, F#, Db
// Row 3: Ab, Eb, Bb, F
const MAJOR_KEYS_GRID = [
  ['C', 'G', 'D', 'A'],
  ['E', 'B', 'F#', 'Db'],
  ['Ab', 'Eb', 'Bb', 'F'],
];

// Standard musical enharmonics for minor keys
// Db in major -> C#m in minor (as explicitly requested: "kalo mayor itu Db tapi kalo minor itu jadi C#m bukan Dbm")
// Ab in major -> G#m in minor (5 sharps standard instead of 7 flats Abm)
const MINOR_KEYS_GRID = [
  ['Cm', 'Gm', 'Dm', 'Am'],
  ['Em', 'Bm', 'F#m', 'C#m'],
  ['G#m', 'Ebm', 'Bbm', 'Fm'],
];

export const KeySelectorModal: React.FC<KeySelectorModalProps> = ({
  isOpen,
  onClose,
  currentKey,
  onSelectKey,
}) => {
  // Determine if initial key is minor
  const isInitialMinor = (key: string) => {
    if (!key) return false;
    const trimmed = key.trim();
    return trimmed.endsWith('m') && !trimmed.endsWith('maj') && !trimmed.endsWith('dim');
  };

  const [mode, setMode] = useState<'major' | 'minor'>(isInitialMinor(currentKey) ? 'minor' : 'major');
  const [customInput, setCustomInput] = useState('');

  // Sync mode whenever modal opens or currentKey changes
  useEffect(() => {
    if (isOpen) {
      setMode(isInitialMinor(currentKey) ? 'minor' : 'major');
      setCustomInput('');
    }
  }, [isOpen, currentKey]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const currentGrid = mode === 'major' ? MAJOR_KEYS_GRID : MINOR_KEYS_GRID;

  const handleKeyClick = (key: string) => {
    onSelectKey(key);
    onClose();
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = customInput.trim();
    if (trimmed) {
      onSelectKey(trimmed);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
      {/* Click outside backdrop overlay */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-[340px] bg-[#FFFFFF] border border-[#E5E4DE] rounded-2xl shadow-2xl p-4 z-10 flex flex-col gap-3.5 select-none">
        {/* Header: Title on left, Segmented Mayor/Minor on right, and Close button */}
        <div className="flex items-center justify-between gap-2 border-b border-[#F0EFEA] pb-3">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-mono font-bold tracking-wider uppercase text-[#78716C]">
              Pilih Nada Dasar
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Segmented Mayor / Minor Tabs */}
            <div className="flex items-center p-0.5 bg-[#F5F4EE] border border-[#E5E4DE] rounded-lg">
              <button
                type="button"
                onClick={() => setMode('major')}
                className={`px-2.5 py-1 text-xs font-mono font-bold rounded-md transition cursor-pointer ${
                  mode === 'major'
                    ? 'bg-[#1C1917] text-[#FFFFFF] shadow-2xs'
                    : 'text-[#78716C] hover:text-[#1C1917]'
                }`}
              >
                Mayor
              </button>
              <button
                type="button"
                onClick={() => setMode('minor')}
                className={`px-2.5 py-1 text-xs font-mono font-bold rounded-md transition cursor-pointer ${
                  mode === 'minor'
                    ? 'bg-[#1C1917] text-[#FFFFFF] shadow-2xs'
                    : 'text-[#78716C] hover:text-[#1C1917]'
                }`}
              >
                Minor
              </button>
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="w-6 h-6 flex items-center justify-center rounded-md text-[#78716C] hover:text-[#1C1917] hover:bg-[#F5F4EE] transition cursor-pointer"
              title="Tutup (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Custom Input Form: "Ketik key lain..." + "OK" button */}
        <form onSubmit={handleCustomSubmit} className="flex items-center gap-2">
          <input
            type="text"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            placeholder="Ketik key lain..."
            className="flex-1 px-3 py-2 text-xs font-mono font-medium text-[#1C1917] bg-[#FAF9F5] border border-[#E5E4DE] rounded-xl outline-hidden focus:border-[#1C1917] focus:bg-[#FFFFFF] placeholder:text-[#A8A29E] transition"
          />
          <button
            type="submit"
            disabled={!customInput.trim()}
            className="px-4 py-2 bg-[#1C1917] hover:bg-[#292524] disabled:opacity-40 disabled:cursor-not-allowed text-[#FFFFFF] rounded-xl text-xs font-mono font-bold transition shadow-2xs cursor-pointer shrink-0"
          >
            OK
          </button>
        </form>

        {/* 4x3 Circle of Fifths Key Grid */}
        <div className="grid grid-cols-4 gap-2">
          {currentGrid.flat().map((keyName) => {
            const isSelected = currentKey.trim().toLowerCase() === keyName.toLowerCase();
            return (
              <button
                key={keyName}
                type="button"
                onClick={() => handleKeyClick(keyName)}
                className={`h-11 rounded-xl text-sm font-mono font-bold flex items-center justify-center transition cursor-pointer select-none ${
                  isSelected
                    ? 'bg-[#1C1917] text-[#FFFFFF] shadow-sm scale-[1.02]'
                    : 'bg-[#FAF9F5] hover:bg-[#F5F4EE] active:bg-[#EAE8DF] text-[#1C1917] border border-[#E5E4DE] shadow-2xs hover:border-[#D6D3D1]'
                }`}
              >
                {keyName}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
