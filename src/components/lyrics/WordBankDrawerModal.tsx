import React, { useState, useMemo, useRef } from 'react';
import { X, Search, Sparkles, Send, Plus, BookOpen, Layers } from 'lucide-react';
import { BarItem } from '../../types';

export interface WordBankDrawerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertText: (text: string) => void;
  barItems?: BarItem[];
}

interface WordItem {
  id: string;
  category: 'bank' | 'rhyme' | 'diction' | 'phrase' | 'alliteration';
  categoryLabel: string;
  text: string;
  tag?: string;
}

const DEFAULT_WORD_ITEMS: WordItem[] = [
  // 1. RIMA AKHIR (-ang, -an, -at, -ih, -i, -a, dll)
  { id: 'r1', category: 'rhyme', categoryLabel: 'Rima -ang', text: 'terbayang', tag: 'AABB' },
  { id: 'r2', category: 'rhyme', categoryLabel: 'Rima -ang', text: 'tenang', tag: 'AABB' },
  { id: 'r3', category: 'rhyme', categoryLabel: 'Rima -ang', text: 'menyangkal', tag: 'ABAB' },
  { id: 'r4', category: 'rhyme', categoryLabel: 'Rima -ang', text: 'terkembang', tag: 'AABB' },
  { id: 'r5', category: 'rhyme', categoryLabel: 'Rima -an', text: 'harapan', tag: 'AABB' },
  { id: 'r6', category: 'rhyme', categoryLabel: 'Rima -an', text: 'keheningan', tag: 'AABB' },
  { id: 'r7', category: 'rhyme', categoryLabel: 'Rima -an', text: 'jawaban', tag: 'ABAB' },
  { id: 'r8', category: 'rhyme', categoryLabel: 'Rima -ih', text: 'perih', tag: 'AABB' },
  { id: 'r9', category: 'rhyme', categoryLabel: 'Rima -ih', text: 'memilih', tag: 'ABAB' },
  { id: 'r10', category: 'rhyme', categoryLabel: 'Rima -ih', text: 'jernih', tag: 'AABB' },

  // 2. DIKSI & SINONIM PUITIS
  { id: 'd1', category: 'diction', categoryLabel: 'Diksi Puitis', text: 'saujana', tag: 'Luas' },
  { id: 'd2', category: 'diction', categoryLabel: 'Diksi Puitis', text: 'kalbu', tag: 'Hati' },
  { id: 'd3', category: 'diction', categoryLabel: 'Diksi Puitis', text: 'relung', tag: 'Dalam' },
  { id: 'd4', category: 'diction', categoryLabel: 'Diksi Puitis', text: 'laksana', tag: 'Seperti' },
  { id: 'd5', category: 'diction', categoryLabel: 'Diksi Puitis', text: 'gelora', tag: 'Semangat' },
  { id: 'd6', category: 'diction', categoryLabel: 'Diksi Puitis', text: 'nestapa', tag: 'Duka' },
  { id: 'd7', category: 'diction', categoryLabel: 'Diksi Puitis', text: 'senandika', tag: 'Bicara Sendiri' },
  { id: 'd8', category: 'diction', categoryLabel: 'Diksi Puitis', text: 'anila', tag: 'Angin' },
  { id: 'd9', category: 'diction', categoryLabel: 'Diksi Puitis', text: 'purnama', tag: 'Bulan' },
  { id: 'd10', category: 'diction', categoryLabel: 'Diksi Puitis', text: 'nirwana', tag: 'Surga' },

  // 3. FRASA LIRIK INSPIRATIF
  { id: 'f1', category: 'phrase', categoryLabel: 'Frasa Lirik', text: 'Di balik tirai malam yang hening', tag: 'Pembuka' },
  { id: 'f2', category: 'phrase', categoryLabel: 'Frasa Lirik', text: 'Langkah kaki yang tak lagi ragu', tag: 'Transisi' },
  { id: 'f3', category: 'phrase', categoryLabel: 'Frasa Lirik', text: 'Menyimpan rindu yang tak kunjung padam', tag: 'Punchline' },
  { id: 'f4', category: 'phrase', categoryLabel: 'Frasa Lirik', text: 'Harmoni tercipta tanpa batas lagi', tag: 'Chorus' },
  { id: 'f5', category: 'phrase', categoryLabel: 'Frasa Lirik', text: 'Mencari kata di antara sunyi', tag: 'Metafora' },
  { id: 'f6', category: 'phrase', categoryLabel: 'Frasa Lirik', text: 'Jejak waktu yang terhapus hujan', tag: 'Penutup' },

  // 4. ALITERASI (PENGULANGAN BUNYI)
  { id: 'a1', category: 'alliteration', categoryLabel: 'Aliterasi S', text: 'Suara sunyi menyapa kalbu', tag: 'Bunyi S' },
  { id: 'a2', category: 'alliteration', categoryLabel: 'Aliterasi B', text: 'Bayang-bayang berbisik pelan', tag: 'Bunyi B' },
  { id: 'a3', category: 'alliteration', categoryLabel: 'Aliterasi D', text: 'Desir angin dingin menerpa', tag: 'Bunyi D' },
  { id: 'a4', category: 'alliteration', categoryLabel: 'Aliterasi M', text: 'Malam makin membisu dingin', tag: 'Bunyi M' },
];

export const WordBankDrawerModal: React.FC<WordBankDrawerModalProps> = ({
  isOpen,
  onClose,
  onInsertText,
  barItems,
}) => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<'all' | 'bank' | 'rhyme' | 'diction' | 'phrase' | 'alliteration'>('all');

  // Swipe-down drag-to-dismiss state
  const [dragOffset, setDragOffset] = useState(0);
  const isDraggingRef = useRef(false);
  const startYRef = useRef(0);

  // Map user saved Bank Bar items from useBarBank
  const userBankItems: WordItem[] = useMemo(() => {
    if (!barItems || barItems.length === 0) return [];
    return barItems.map((b) => ({
      id: `saved-${b.id}`,
      category: 'bank',
      categoryLabel: `Bar ${b.category ? `(${b.category})` : 'Tersimpan'}`,
      text: b.text,
      tag: b.rhymeScheme || 'Bar',
    }));
  }, [barItems]);

  const allItems = useMemo(() => {
    return [...userBankItems, ...DEFAULT_WORD_ITEMS];
  }, [userBankItems]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    isDraggingRef.current = true;
    startYRef.current = e.clientY;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    const dy = e.clientY - startYRef.current;
    if (dy > 0) {
      setDragOffset(dy);
    } else {
      setDragOffset(0);
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    if (dragOffset > 60) {
      onClose();
    }
    setDragOffset(0);
  };

  const handlePointerCancel = () => {
    isDraggingRef.current = false;
    setDragOffset(0);
  };

  if (!isOpen) return null;

  const handleSelectWord = (text: string) => {
    onInsertText(text);
    onClose();
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = search.trim();
    if (trimmed) {
      onInsertText(trimmed);
      onClose();
    }
  };

  const filteredItems = allItems.filter((item) => {
    const matchCat = category === 'all' || item.category === category;
    const matchSearch =
      search.trim() === '' ||
      item.text.toLowerCase().includes(search.toLowerCase()) ||
      item.categoryLabel.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-xs p-0 sm:p-4 animate-fade-in">
      {/* Backdrop */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Drawer Container */}
      <div
        style={{
          transform: dragOffset > 0 ? `translateY(${dragOffset}px)` : undefined,
          transition: isDraggingRef.current ? 'none' : 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        className="relative w-full sm:max-w-xl bg-[#FAF9F5] border-t sm:border border-[#E5E4DE] rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[85vh] sm:max-h-[80vh] flex flex-col overflow-hidden z-10 select-none"
      >
        {/* Mobile grab handle container with touch/pointer drag listener */}
        <div
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerCancel}
          className="w-full py-2.5 flex items-center justify-center cursor-grab active:cursor-grabbing touch-none select-none sm:hidden"
          title="Geser ke bawah untuk menutup"
        >
          <div className="w-12 h-1.5 bg-[#D6D3D1] rounded-full hover:bg-[#A8A29E] active:bg-[#78716C] transition-colors" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#FFFFFF] border-b border-[#E5E4DE]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#F5F4EE] border border-[#E5E4DE] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-[#1C1917]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#1C1917]">Word Bank (Bank Kata & Bar)</h3>
              <p className="text-[11px] text-[#78716C]">
                {userBankItems.length > 0 ? `${userBankItems.length} Bar Tersimpan · ` : ''}Rima, Diksi, Frasa & Aliterasi
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

        {/* Search & Filter Bar */}
        <div className="p-3 bg-[#FAF9F5] border-b border-[#E5E4DE] space-y-2.5">
          <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-[#78716C] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari bar tersimpan, rima, atau diksi..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#FFFFFF] border border-[#E5E4DE] rounded-lg text-[#1C1917] outline-hidden focus:border-[#1C1917] placeholder:text-[#A8A29E]"
              />
            </div>
            {search.trim() && (
              <button
                type="submit"
                className="px-3 py-1.5 text-xs font-mono font-bold bg-[#1C1917] text-[#FFFFFF] rounded-lg transition hover:bg-[#292524] cursor-pointer shrink-0 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Sisipkan</span>
              </button>
            )}
          </form>

          {/* Category Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-none text-[11px] font-mono">
            {[
              { id: 'all', label: 'Semua' },
              ...(userBankItems.length > 0 ? [{ id: 'bank', label: `Bar Tersimpan (${userBankItems.length})` }] : []),
              { id: 'rhyme', label: 'Rima Akhir' },
              { id: 'diction', label: 'Diksi & Sinonim' },
              { id: 'phrase', label: 'Frasa Lirik' },
              { id: 'alliteration', label: 'Aliterasi' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setCategory(tab.id as any)}
                className={`px-2.5 py-1 rounded-md transition cursor-pointer shrink-0 ${
                  category === tab.id
                    ? 'bg-[#1C1917] text-[#FAF9F5] font-bold shadow-2xs'
                    : 'bg-[#FFFFFF] text-[#78716C] border border-[#E5E4DE] hover:text-[#1C1917]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Word Items Grid / List */}
        <div className="flex-1 overflow-y-auto p-3.5 space-y-2">
          {filteredItems.length === 0 ? (
            <div className="p-8 text-center space-y-2">
              <p className="text-xs text-[#78716C]">
                Tidak ada kata atau frasa yang cocok dengan &quot;{search}&quot;.
              </p>
              <button
                type="button"
                onClick={() => handleSelectWord(search.trim())}
                className="px-3.5 py-1.5 bg-[#1C1917] text-white rounded-lg text-xs font-mono font-bold cursor-pointer inline-flex items-center gap-1"
              >
                <Send className="w-3 h-3" />
                <span>Tetap Sisipkan &quot;{search.trim()}&quot;</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleSelectWord(item.text)}
                  className="p-2.5 bg-[#FFFFFF] border border-[#E5E4DE] hover:border-[#1C1917] rounded-xl transition cursor-pointer group flex items-center justify-between shadow-2xs active:scale-[0.98]"
                >
                  <div className="flex-1 min-w-0 pr-2">
                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#78716C]">
                      <span className="font-bold text-[#1C1917] px-1 py-0.2 bg-[#F5F4EE] rounded border border-[#E5E4DE]">
                        {item.categoryLabel}
                      </span>
                      {item.tag && <span className="truncate">{item.tag}</span>}
                    </div>
                    <div className="text-xs font-semibold text-[#1C1917] mt-1 leading-snug truncate">
                      {item.text}
                    </div>
                  </div>

                  <div className="w-7 h-7 flex items-center justify-center rounded-lg bg-[#FAF9F5] group-hover:bg-[#1C1917] group-hover:text-[#FFFFFF] border border-[#E5E4DE] text-[#78716C] transition cursor-pointer shrink-0">
                    <Send className="w-3 h-3" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
