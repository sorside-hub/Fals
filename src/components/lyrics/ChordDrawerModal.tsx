import React, { useState, useMemo } from 'react';
import { X, Search, Volume2, Plus, Sparkles, Music } from 'lucide-react';
import { getFamilyChordGroups } from '../../utils/familyChords';
import { sound } from '../../utils/audioEngine';
import { CHROMATIC_NOTES } from '../../data/constants';

export interface ChordDrawerModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeKey: string;
  onInsertChord: (chordName: string) => void;
}

export const ChordDrawerModal: React.FC<ChordDrawerModalProps> = ({
  isOpen,
  onClose,
  activeKey,
  onInsertChord,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'family' | 'variations' | 'dictionary'>('all');
  const [dictRoot, setDictRoot] = useState('C');

  // Compute family chords and variations based on active key
  const chordGroup = useMemo(() => {
    return getFamilyChordGroups(activeKey);
  }, [activeKey]);

  if (!isOpen) return null;

  const handlePlaySound = (e: React.MouseEvent, keyName: string, intervals: number[]) => {
    e.stopPropagation();
    sound.playChord(keyName, intervals);
  };

  const handleSelectChord = (chordName: string) => {
    onInsertChord(chordName);
    onClose();
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = search.trim();
    if (trimmed) {
      onInsertChord(trimmed);
      onClose();
    }
  };

  // Filtered family chords & variations based on search query
  const query = search.trim().toLowerCase();
  const matchedFamily = chordGroup.familyChords.filter(
    (c) => c.name.toLowerCase().includes(query) || c.degree.toLowerCase().includes(query)
  );
  const matchedVariations = chordGroup.variations.filter(
    (v) => v.name.toLowerCase().includes(query) || v.type.toLowerCase().includes(query)
  );

  const DICT_QUALITIES = [
    { suffix: '', label: 'Mayor', intervals: [0, 4, 7] },
    { suffix: 'm', label: 'Minor', intervals: [0, 3, 7] },
    { suffix: '7', label: '7th Dominan', intervals: [0, 4, 7, 10] },
    { suffix: 'maj7', label: 'Major 7th', intervals: [0, 4, 7, 11] },
    { suffix: 'm7', label: 'Minor 7th', intervals: [0, 3, 7, 10] },
    { suffix: 'sus4', label: 'Sus4', intervals: [0, 5, 7] },
    { suffix: 'sus2', label: 'Sus2', intervals: [0, 2, 7] },
    { suffix: 'add9', label: 'Add9', intervals: [0, 4, 7, 14] },
    { suffix: 'dim', label: 'Diminished', intervals: [0, 3, 6] },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-xs p-0 sm:p-4 animate-fade-in">
      {/* Backdrop */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Drawer Container */}
      <div className="relative w-full sm:max-w-xl bg-[#FAF9F5] border-t sm:border border-[#E5E4DE] rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[85vh] sm:max-h-[80vh] flex flex-col overflow-hidden z-10 select-none">
        {/* Mobile grab handle */}
        <div className="w-10 h-1 bg-[#D6D3D1] rounded-full mx-auto my-2.5 sm:hidden" />

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#FFFFFF] border-b border-[#E5E4DE]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#F5F4EE] border border-[#E5E4DE] flex items-center justify-center">
              <Music className="w-4 h-4 text-[#1C1917]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-[#1C1917]">Sisipkan Akor / Harmoni</h3>
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#1C1917] text-[#FFFFFF]">
                  Key: {activeKey}
                </span>
              </div>
              <p className="text-[11px] text-[#78716C]">
                {chordGroup.isMinor ? 'Tangga Nada Minor' : 'Tangga Nada Mayor'} · Diatonik & Ekstensi
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-md text-[#78716C] hover:text-[#1C1917] hover:bg-[#F5F4EE] transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search & Category Filter */}
        <div className="p-3 bg-[#FAF9F5] border-b border-[#E5E4DE] space-y-2.5">
          <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-[#78716C] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari akor (misal: Bm7, G/B, F#, Cmaj7)..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#FFFFFF] border border-[#E5E4DE] rounded-lg text-[#1C1917] outline-hidden focus:border-[#1C1917] placeholder:text-[#A8A29E]"
              />
            </div>
            {search.trim() && (
              <button
                type="submit"
                className="px-3 py-1.5 text-xs font-mono font-bold bg-[#1C1917] text-[#FFFFFF] rounded-lg transition hover:bg-[#292524] cursor-pointer shrink-0"
              >
                + [{search.trim()}]
              </button>
            )}
          </form>

          {/* Category Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-none text-[11px] font-mono">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-2.5 py-1 rounded-md transition cursor-pointer shrink-0 ${
                selectedCategory === 'all'
                  ? 'bg-[#1C1917] text-[#FAF9F5] font-bold shadow-2xs'
                  : 'bg-[#FFFFFF] text-[#78716C] border border-[#E5E4DE] hover:text-[#1C1917]'
              }`}
            >
              Semua Harmoni
            </button>
            <button
              onClick={() => setSelectedCategory('family')}
              className={`px-2.5 py-1 rounded-md transition cursor-pointer shrink-0 ${
                selectedCategory === 'family'
                  ? 'bg-[#1C1917] text-[#FAF9F5] font-bold shadow-2xs'
                  : 'bg-[#FFFFFF] text-[#78716C] border border-[#E5E4DE] hover:text-[#1C1917]'
              }`}
            >
              Family Diatonik (I-vi)
            </button>
            <button
              onClick={() => setSelectedCategory('variations')}
              className={`px-2.5 py-1 rounded-md transition cursor-pointer shrink-0 ${
                selectedCategory === 'variations'
                  ? 'bg-[#1C1917] text-[#FAF9F5] font-bold shadow-2xs'
                  : 'bg-[#FFFFFF] text-[#78716C] border border-[#E5E4DE] hover:text-[#1C1917]'
              }`}
            >
              Variasi & Ekstensi
            </button>
            <button
              onClick={() => setSelectedCategory('dictionary')}
              className={`px-2.5 py-1 rounded-md transition cursor-pointer shrink-0 ${
                selectedCategory === 'dictionary'
                  ? 'bg-[#1C1917] text-[#FAF9F5] font-bold shadow-2xs'
                  : 'bg-[#FFFFFF] text-[#78716C] border border-[#E5E4DE] hover:text-[#1C1917]'
              }`}
            >
              Kamus Kromatik
            </button>
          </div>
        </div>

        {/* Scrollable Chord Content */}
        <div className="flex-1 overflow-y-auto p-3.5 space-y-4">
          {/* 1. FAMILY CHORDS SECTION */}
          {(selectedCategory === 'all' || selectedCategory === 'family') && matchedFamily.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#78716C] font-bold">
                  Family Chord Utama (Tingkat I - vi)
                </span>
                <span className="text-[10px] font-mono text-[#A8A29E]">
                  Nada Dasar: {activeKey}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {matchedFamily.map((c) => (
                  <div
                    key={c.degree}
                    onClick={() => handleSelectChord(c.name)}
                    className="p-2.5 bg-[#FFFFFF] border border-[#E5E4DE] hover:border-[#1C1917] rounded-xl transition cursor-pointer group flex items-center justify-between shadow-2xs active:scale-[0.98]"
                  >
                    <div>
                      <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#78716C]">
                        <span className="font-bold text-[#1C1917] px-1 py-0.2 bg-[#F5F4EE] rounded border border-[#E5E4DE]">
                          {c.degree}
                        </span>
                        <span className="truncate max-w-[80px]">{c.role}</span>
                      </div>
                      <div className="text-base font-mono font-bold text-[#1C1917] mt-0.5">
                        [{c.name}]
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => handlePlaySound(e, c.rootNote, c.intervals)}
                      className="w-7 h-7 flex items-center justify-center rounded-lg bg-[#FAF9F5] hover:bg-[#F5F4EE] border border-[#E5E4DE] text-[#78716C] group-hover:text-[#1C1917] transition cursor-pointer shrink-0"
                      title={`Dengarkan nada [${c.name}]`}
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2. VARIATIONS & EXTENSIONS SECTION */}
          {(selectedCategory === 'all' || selectedCategory === 'variations') && matchedVariations.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#78716C] font-bold">
                  Variasi & Ekstensi Populer
                </span>
                <span className="text-[10px] font-mono text-[#A8A29E]">
                  7th, Sus, Add9 & Slash
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {matchedVariations.map((v) => (
                  <button
                    key={v.name}
                    type="button"
                    onClick={() => handleSelectChord(v.name)}
                    className="p-2 bg-[#FFFFFF] border border-[#E5E4DE] hover:border-[#1C1917] hover:bg-[#FAF9F5] rounded-xl transition cursor-pointer text-left flex flex-col justify-between shadow-2xs active:scale-[0.98]"
                  >
                    <span className="text-[9px] font-mono text-[#78716C] truncate w-full">
                      {v.type}
                    </span>
                    <span className="text-sm font-mono font-bold text-[#1C1917] mt-1">
                      [{v.name}]
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 3. CHROMATIC DICTIONARY SECTION */}
          {(selectedCategory === 'all' || selectedCategory === 'dictionary') && (
            <div className="space-y-2.5 pt-2 border-t border-[#E5E4DE]">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#78716C] font-bold">
                  Kamus Akor Lengkap
                </span>
                <span className="text-[10px] font-mono text-[#A8A29E]">
                  Pilih Nada Pokok & Tipe
                </span>
              </div>

              {/* Root Row */}
              <div className="flex items-center gap-1 overflow-x-auto scrollbar-none pb-1">
                {CHROMATIC_NOTES.map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setDictRoot(n)}
                    className={`px-2.5 py-1 text-xs font-mono font-bold rounded-lg transition cursor-pointer shrink-0 ${
                      dictRoot === n
                        ? 'bg-[#1C1917] text-[#FFFFFF] shadow-2xs'
                        : 'bg-[#FFFFFF] text-[#1C1917] border border-[#E5E4DE] hover:bg-[#F5F4EE]'
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>

              {/* Qualities Grid */}
              <div className="grid grid-cols-3 gap-1.5">
                {DICT_QUALITIES.map((q) => {
                  const chordName = `${dictRoot}${q.suffix}`;
                  return (
                    <button
                      key={q.suffix}
                      type="button"
                      onClick={() => handleSelectChord(chordName)}
                      className="p-2 bg-[#FFFFFF] border border-[#E5E4DE] hover:border-[#1C1917] hover:bg-[#FAF9F5] rounded-xl transition cursor-pointer text-left flex items-center justify-between shadow-2xs group"
                    >
                      <div>
                        <div className="text-xs font-mono font-bold text-[#1C1917]">
                          [{chordName}]
                        </div>
                        <div className="text-[9px] font-mono text-[#78716C]">
                          {q.label}
                        </div>
                      </div>
                      <Plus className="w-3.5 h-3.5 text-[#A8A29E] group-hover:text-[#1C1917]" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Empty search state */}
          {matchedFamily.length === 0 && matchedVariations.length === 0 && selectedCategory !== 'dictionary' && (
            <div className="p-8 text-center space-y-2">
              <p className="text-xs text-[#78716C]">
                Tidak ada akor yang cocok dengan &quot;{search}&quot;.
              </p>
              <button
                type="button"
                onClick={() => handleSelectChord(search.trim())}
                className="px-3.5 py-1.5 bg-[#1C1917] text-white rounded-lg text-xs font-mono font-bold cursor-pointer"
              >
                Tetap Sisipkan [{search.trim()}]
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
