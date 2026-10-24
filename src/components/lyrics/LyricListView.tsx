import React, { useState } from 'react';
import { SongDraft } from '../../types';
import { Plus, Search, Trash2, FileText } from 'lucide-react';

interface LyricListViewProps {
  songs: SongDraft[];
  onSelectSong: (song: SongDraft) => void;
  onCreateSong: (title: string, key: string, status?: 'draft' | 'proses' | 'release') => void;
  onDeleteSong: (id: string) => void;
}

export const LyricListView: React.FC<LyricListViewProps> = ({
  songs,
  onSelectSong,
  onCreateSong,
  onDeleteSong,
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'proses' | 'release'>('all');
  const [showNewModal, setShowNewModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newKey, setNewKey] = useState('C');
  const [newStatus, setNewStatus] = useState<'draft' | 'proses' | 'release'>('draft');

  const filteredSongs = songs.filter(song => {
    const matchStatus = statusFilter === 'all' || (song.status || 'draft') === statusFilter;
    const matchSearch =
      search.trim() === '' ||
      song.title.toLowerCase().includes(search.toLowerCase()) ||
      song.content.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onCreateSong(newTitle.trim(), newKey, newStatus);
    setNewTitle('');
    setShowNewModal(false);
  };

  // Helper to extract clean plain text preview from TipTap HTML
  const getExcerpt = (html: string) => {
    const text = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    if (!text) return 'Belum ada lirik yang ditulis...';
    return text.length > 110 ? text.slice(0, 110) + '...' : text;
  };

  const getStatusBadge = (status: 'draft' | 'proses' | 'release') => {
    if (status === 'release') {
      return (
        <span className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/60">
          RELEASE
        </span>
      );
    }
    if (status === 'proses') {
      return (
        <span className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider rounded-md bg-amber-50 text-amber-700 border border-amber-200/60">
          PROSES
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider rounded-md bg-[#F5F4EE] text-[#78716C] border border-[#E5E4DE]">
        DRAFT
      </span>
    );
  };

  return (
    <div className="w-full space-y-4 animate-fade-in">
      {/* Top Banner & Main Action */}
      <div className="p-4 sm:p-5 bg-[#FFFFFF] border border-[#E5E4DE] rounded-2xl shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-[#1C1917] tracking-tight flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#1C1917]" />
            <span>Studio Lirik Lagu</span>
            <span className="text-xs font-mono font-normal text-[#78716C] px-2 py-0.5 rounded-full bg-[#F5F4EE] border border-[#E5E4DE]">
              {songs.length} Proyek
            </span>
          </h2>
          <p className="text-xs text-[#78716C] mt-0.5">
            Pilih lagu untuk masuk ke editor TipTap penuh berpenghitung suku kata.
          </p>
        </div>

        <button
          onClick={() => setShowNewModal(true)}
          className="flex items-center justify-center gap-1.5 px-3.5 py-2 bg-[#1C1917] text-[#FAF9F5] rounded-xl text-xs font-semibold hover:bg-[#292524] transition cursor-pointer self-start sm:self-auto shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Tulis Lirik Baru</span>
        </button>
      </div>

      {/* Filter Status Progres & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Status Filter Tabs (Zero-Pill Discipline) */}
        <div className="flex items-center gap-1 p-1 bg-[#F5F4EE] border border-[#E5E4DE] rounded-xl overflow-x-auto scrollbar-none text-xs">
          {[
            { key: 'all', label: 'Semua Status' },
            { key: 'draft', label: 'Draft' },
            { key: 'proses', label: 'Proses' },
            { key: 'release', label: 'Release' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key as any)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                statusFilter === tab.key
                  ? 'bg-[#FFFFFF] text-[#1C1917] shadow-2xs font-semibold'
                  : 'text-[#78716C] hover:text-[#1C1917]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-[#78716C] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari judul atau lirik..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#FFFFFF] border border-[#E5E4DE] rounded-xl text-[#1C1917] outline-hidden focus:border-[#1C1917]"
          />
        </div>
      </div>

      {/* Grid of Lyric Cards */}
      {filteredSongs.length === 0 ? (
        <div className="p-8 text-center bg-[#FFFFFF] border border-[#E5E4DE] rounded-2xl text-[#78716C] space-y-2">
          <p className="text-sm font-semibold text-[#1C1917]">Tidak ada lirik di kategori ini</p>
          <p className="text-xs">Klik tombol "Tulis Lirik Baru" untuk membuat lembar karya barumu.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {filteredSongs.map(song => {
            const updatedDate = new Date(song.updatedAt).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            }).toUpperCase();

            return (
              <div
                key={song.id}
                onClick={() => onSelectSong(song)}
                className="p-4 bg-[#FFFFFF] border border-[#E5E4DE] hover:border-[#1C1917] rounded-2xl transition-all cursor-pointer shadow-2xs group flex flex-col justify-between gap-3"
              >
                {/* Top Row: Title & Delete button */}
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-base font-bold text-[#1C1917] group-hover:underline line-clamp-1">
                    {song.title || 'Tanpa Judul'}
                  </h3>

                  {songs.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteSong(song.id);
                      }}
                      className="p-1.5 rounded-lg text-[#A8A29E] hover:text-rose-600 hover:bg-[#FAF9F5] transition cursor-pointer shrink-0"
                      title="Hapus proyek lagu ini"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Bottom Row: status • key • bpm • date */}
                <div className="flex items-center flex-wrap gap-2 text-xs text-[#78716C]">
                  {getStatusBadge(song.status || 'draft')}
                  <span className="text-[#D6D3D1]" aria-hidden="true">•</span>
                  <span className="font-medium text-[#44403C]">Key {song.key}</span>
                  <span className="text-[#D6D3D1]" aria-hidden="true">•</span>
                  <span className="font-medium text-[#44403C]">{song.bpm} BPM</span>
                  <span className="text-[#D6D3D1]" aria-hidden="true">•</span>
                  <span className="font-mono text-[11px] text-[#78716C]">{updatedDate}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal: Tulis Lirik Baru */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-sm bg-[#FAF9F5] border border-[#E5E4DE] rounded-2xl shadow-xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-[#1C1917]">Mulai Proyek Lagu Baru</h3>

            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#78716C] mb-1">Judul Lagu</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Contoh: Senja di Pelataran"
                  className="w-full p-2.5 text-xs bg-[#FFFFFF] border border-[#E5E4DE] rounded-lg text-[#1C1917] outline-hidden focus:border-[#1C1917]"
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-xs font-semibold text-[#78716C] mb-1">Nada Dasar</label>
                  <select
                    value={newKey}
                    onChange={(e) => setNewKey(e.target.value)}
                    className="w-full p-2 bg-[#FFFFFF] border border-[#E5E4DE] rounded-lg font-mono font-bold text-[#1C1917] outline-hidden"
                  >
                    {['C', 'D', 'E', 'F', 'G', 'A', 'B'].map(k => (
                      <option key={k} value={k}>{k}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#78716C] mb-1">Status Progres</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as any)}
                    className="w-full p-2 bg-[#FFFFFF] border border-[#E5E4DE] rounded-lg text-[#1C1917] outline-hidden"
                  >
                    <option value="draft">Draft (Awal)</option>
                    <option value="proses">Proses (Revisi)</option>
                    <option value="release">Release (Final)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E5E4DE]">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-3 py-1.5 text-xs text-[#78716C] hover:text-[#1C1917] cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold bg-[#1C1917] text-[#FAF9F5] rounded-lg hover:bg-[#292524] cursor-pointer"
                >
                  Buka Editor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
