import React, { useState } from 'react';
import { BarItem } from '../types';
import { X, Search, Plus, Send, BookOpen } from 'lucide-react';

interface BankBarPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  barItems: BarItem[];
  onInsertBar: (text: string) => void;
}

export const BankBarPickerModal: React.FC<BankBarPickerModalProps> = ({
  isOpen,
  onClose,
  barItems,
  onInsertBar,
}) => {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  if (!isOpen) return null;

  const filtered = barItems.filter(item => {
    let matchCat = categoryFilter === 'all';
    if (!matchCat) {
      if (categoryFilter === 'diksi') matchCat = item.category === 'diksi';
      else if (categoryFilter === 'metafor') matchCat = item.category === 'metafor' || (item.category as string) === 'metaphor';
      else if (categoryFilter === 'bar') matchCat = item.category === 'bar' || item.category === 'punchline' || item.category === 'rhyme';
      else if (categoryFilter === 'hook') matchCat = item.category === 'hook';
      else matchCat = item.category === categoryFilter;
    }
    const q = search.toLowerCase();
    const matchSearch =
      search.trim() === '' ||
      item.text.toLowerCase().includes(q) ||
      (item.meaning && item.meaning.toLowerCase().includes(q)) ||
      item.tags.some(t => t.toLowerCase().includes(q));
    return matchCat && matchSearch;
  });

  const getCatLabel = (cat: string) => {
    switch (cat) {
      case 'all': return 'Semua';
      case 'diksi': return 'Diksi';
      case 'metafor': return 'Metafor';
      case 'bar': return 'Bar';
      case 'hook': return 'Hook';
      default: return cat;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-xs p-0 sm:p-4 animate-fade-in">
      <div className="w-full sm:max-w-lg bg-[#FAF9F5] border-t sm:border border-[#E5E4DE] rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[85vh] flex flex-col overflow-hidden">
        {/* Grab handle for mobile */}
        <div className="w-10 h-1 bg-[#D6D3D1] rounded-full mx-auto my-2.5 sm:hidden" />

        {/* Modal Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#FFFFFF] border-b border-[#E5E4DE]">
          <div>
            <h3 className="text-sm font-bold text-[#1C1917]">Sisipkan Amunisi ke Lirik</h3>
            <p className="text-[11px] text-[#78716C]">Pilih kata, metafor, atau bar dari Amunisi</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-[#78716C] hover:bg-[#F5F4EE] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search & Category Filter */}
        <div className="p-3 bg-[#FAF9F5] border-b border-[#E5E4DE] space-y-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#78716C] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari kata, metafor, makna, atau bar..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#FFFFFF] border border-[#E5E4DE] rounded-lg text-[#1C1917] outline-hidden focus:border-[#1C1917]"
            />
          </div>

          <div className="flex items-center gap-1 overflow-x-auto scrollbar-none text-[11px]">
            {['all', 'diksi', 'metafor', 'bar', 'hook'].map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-2.5 py-1 rounded-md capitalize transition cursor-pointer ${
                  categoryFilter === cat
                    ? 'bg-[#1C1917] text-[#FAF9F5] font-semibold'
                    : 'bg-[#FFFFFF] text-[#78716C] border border-[#E5E4DE]'
                }`}
              >
                {getCatLabel(cat)}
              </button>
            ))}
          </div>
        </div>

        {/* List of Bars */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
          {filtered.length === 0 ? (
            <div className="p-6 text-center text-xs text-[#78716C]">
              Tidak ada amunisi yang cocok dengan pencarian.
            </div>
          ) : (
            filtered.map(item => (
              <div
                key={item.id}
                onClick={() => {
                  onInsertBar(item.text);
                  onClose();
                }}
                className="p-3 bg-[#FFFFFF] border border-[#E5E4DE] hover:border-[#1C1917] rounded-xl transition cursor-pointer group flex flex-col justify-between"
              >
                <div className="flex items-center justify-between text-[10px] text-[#78716C] font-mono mb-1.5">
                  <span className="uppercase font-semibold text-[#1C1917] bg-[#F5F4EE] px-1.5 py-0.2 rounded">
                    {item.category}
                  </span>
                  {item.rhymeScheme && item.rhymeScheme !== 'Free' && (
                    <span>{item.rhymeScheme}</span>
                  )}
                </div>
                <div className="text-xs text-[#1C1917] font-semibold leading-relaxed whitespace-pre-wrap pl-2 border-l-2 border-[#E5E4DE] group-hover:border-[#1C1917]">
                  {item.text}
                </div>
                {item.meaning && (
                  <div className="mt-2 text-[11px] text-[#78716C] bg-[#FAF9F5] p-2 rounded-lg border border-[#E5E4DE] leading-snug">
                    <span className="font-semibold text-[#57534E] block text-[9.5px] uppercase font-mono mb-0.5">
                      Makna:
                    </span>
                    {item.meaning}
                  </div>
                )}
                <div className="flex justify-end mt-2 pt-2 border-t border-[#F5F4EE]">
                  <span className="text-[11px] font-semibold text-[#1C1917] group-hover:underline flex items-center gap-1">
                    <Send className="w-3 h-3" />
                    Sisipkan Amunisi Ini
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
