import React, { useState } from 'react';
import { BarItem, BarCategory } from '../../types';
import { Plus, Send, Copy, Trash2, Check, Sparkles, Edit3 } from 'lucide-react';

interface BankBarListViewProps {
  barItems: BarItem[];
  onSelectBar: (bar: BarItem) => void;
  onCreateNewBar: () => void;
  onDeleteBar: (id: string) => void;
  onSendToLyric?: (text: string) => void;
}

export const BankBarListView: React.FC<BankBarListViewProps> = ({
  barItems,
  onSelectBar,
  onCreateNewBar,
  onDeleteBar,
  onSendToLyric,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories: { key: string; label: string }[] = [
    { key: 'all', label: 'Semua Bar' },
    { key: 'punchline', label: 'Punchline' },
    { key: 'rhyme', label: 'Rima & Flow' },
    { key: 'hook', label: 'Ide Hook' },
    { key: 'metaphor', label: 'Metafora & Kata' },
  ];

  const filteredBars = selectedCategory === 'all'
    ? barItems
    : barItems.filter(b => b.category === selectedCategory);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div className="w-full space-y-4 animate-fade-in">
      {/* Header & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-5 bg-[#FFFFFF] border border-[#E5E4DE] rounded-2xl shadow-2xs">
        <div>
          <h2 className="text-base font-bold text-[#1C1917] tracking-tight flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#1C1917]" />
            <span>Bank Bar & Gudang Rima</span>
            <span className="text-xs font-mono font-normal text-[#78716C] px-2 py-0.5 rounded-full bg-[#F5F4EE] border border-[#E5E4DE]">
              {barItems.length} Ide Tersimpan
            </span>
          </h2>
          <p className="text-xs text-[#78716C] mt-0.5">
            Klik kartu bar untuk membuka editor penuh dengan deteksi suku kata & rima live.
          </p>
        </div>

        <button
          onClick={onCreateNewBar}
          className="flex items-center justify-center gap-1.5 px-3.5 py-2 bg-[#1C1917] text-[#FAF9F5] rounded-xl text-xs font-semibold hover:bg-[#292524] transition cursor-pointer self-start sm:self-auto shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Catat Bar Baru</span>
        </button>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-1 p-1 bg-[#F5F4EE] border border-[#E5E4DE] rounded-xl overflow-x-auto scrollbar-none text-xs">
        {categories.map(cat => (
          <button
            key={cat.key}
            onClick={() => setSelectedCategory(cat.key)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              selectedCategory === cat.key
                ? 'bg-[#FFFFFF] text-[#1C1917] shadow-2xs font-semibold'
                : 'text-[#78716C] hover:text-[#1C1917]'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Bank Bar Items Grid */}
      {filteredBars.length === 0 ? (
        <div className="p-8 text-center bg-[#FFFFFF] border border-[#E5E4DE] rounded-2xl text-[#78716C] space-y-2">
          <p className="text-sm font-semibold text-[#1C1917]">Belum ada bar di kategori ini</p>
          <p className="text-xs">Klik tombol "Catat Bar Baru" untuk membuka editor bar penuh.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {filteredBars.map(bar => (
            <div
              key={bar.id}
              onClick={() => onSelectBar(bar)}
              className="p-4 sm:p-5 bg-[#FFFFFF] border border-[#E5E4DE] hover:border-[#1C1917] rounded-2xl flex flex-col justify-between transition-all shadow-2xs group cursor-pointer"
            >
              <div>
                {/* Metadata */}
                <div className="flex items-center justify-between text-[11px] text-[#78716C] mb-2 font-mono pb-2 border-b border-[#F5F4EE]">
                  <div className="flex items-center gap-2">
                    <span className="uppercase font-bold text-[#1C1917]">{bar.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>{bar.rhymeScheme}</span>
                    {bar.syllableCount ? (
                      <>
                        <span aria-hidden="true">·</span>
                        <span>~{bar.syllableCount} suku kata</span>
                      </>
                    ) : null}
                  </div>
                  <span className="text-[10px] text-[#A8A29E] flex items-center gap-1 group-hover:text-[#1C1917]">
                    <Edit3 className="w-3 h-3" />
                    <span>Edit</span>
                  </span>
                </div>

                {/* Bar text content */}
                <div className="text-xs sm:text-sm text-[#1C1917] font-normal leading-relaxed whitespace-pre-wrap pl-2.5 border-l-2 border-[#E5E4DE] group-hover:border-[#1C1917]">
                  {bar.text}
                </div>

                {/* Tags if any */}
                {bar.tags && bar.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3 pt-2">
                    {bar.tags.map(t => (
                      <span key={t} className="text-[10px] font-mono text-[#78716C] bg-[#FAF9F5] px-2 py-0.5 rounded border border-[#E5E4DE]">
                        #{t}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-[#F5F4EE]">
                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopy(bar.id, bar.text);
                    }}
                    className="p-1.5 rounded-md text-[#78716C] hover:text-[#1C1917] hover:bg-[#F5F4EE] transition cursor-pointer text-xs flex items-center gap-1"
                    title="Salin bar ke clipboard"
                  >
                    {copiedId === bar.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-[11px] text-emerald-600 font-semibold">Tersalin</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span className="text-[11px]">Salin</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteBar(bar.id);
                    }}
                    className="p-1.5 rounded-md text-[#A8A29E] hover:text-rose-600 hover:bg-[#FAF9F5] transition cursor-pointer"
                    title="Hapus bar"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {onSendToLyric && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSendToLyric(bar.text);
                    }}
                    className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-[#F5F4EE] hover:bg-[#EAE8DF] text-[#1C1917] border border-[#E5E4DE] rounded-md transition cursor-pointer"
                    title="Kirim dan sisipkan langsung ke draf lagu yang sedang dibuka"
                  >
                    <Send className="w-3 h-3 text-[#57534E]" />
                    <span>Kirim ke Lirik</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
