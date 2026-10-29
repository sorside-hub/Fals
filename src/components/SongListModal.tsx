import React, { useState } from 'react';
import { SongDraft } from '../types';
import { Plus, X, Music, Trash2, Calendar, FileText } from 'lucide-react';

interface SongListModalProps {
  isOpen: boolean;
  onClose: () => void;
  songs: SongDraft[];
  currentSongId: string;
  onSelectSong: (song: SongDraft) => void;
  onCreateSong: (title: string, key: string) => void;
  onDeleteSong: (id: string) => void;
}

export const SongListModal: React.FC<SongListModalProps> = ({
  isOpen,
  onClose,
  songs,
  currentSongId,
  onSelectSong,
  onCreateSong,
  onDeleteSong,
}) => {
  const [newTitle, setNewTitle] = useState('');
  const [newKey, setNewKey] = useState('C');
  const [isCreating, setIsCreating] = useState(false);

  if (!isOpen) return null;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onCreateSong(newTitle.trim(), newKey);
    setNewTitle('');
    setIsCreating(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fade-in">
      <div className="w-full max-w-md bg-[#FAF9F5] border border-[#E5E4DE] rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-[#FFFFFF] border-b border-[#E5E4DE]">
          <div>
            <h3 className="text-base font-bold text-[#1C1917]">Draf Lagu & Lirik</h3>
            <p className="text-xs text-[#78716C]">Pilih atau buat dokumen lirik baru</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-[#78716C] hover:bg-[#F5F4EE] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {songs.map(song => {
            const isSelected = song.id === currentSongId;
            const finalVersion = song.versions?.find(v => v.isFinal) || song.versions?.[0];
            const displayKey = finalVersion?.key || song.key || 'C';
            const displayBpm = finalVersion?.bpm ?? song.bpm ?? 95;

            const updatedDate = new Date(song.updatedAt).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'short',
              hour: '2-digit',
              minute: '2-digit'
            });

            return (
              <div
                key={song.id}
                onClick={() => {
                  onSelectSong(song);
                  onClose();
                }}
                className={`p-3.5 rounded-xl border transition cursor-pointer flex items-center justify-between group ${
                  isSelected
                    ? 'bg-[#FFFFFF] border-[#1C1917] shadow-xs ring-1 ring-[#1C1917]'
                    : 'bg-[#FFFFFF] border-[#E5E4DE] hover:border-[#D6D3D1]'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                    isSelected ? 'bg-[#1C1917] text-[#FAF9F5]' : 'bg-[#F5F4EE] text-[#78716C]'
                  }`}>
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-[#1C1917]">
                      {song.title || 'Tanpa Judul'}
                    </h4>
                    <div className="flex items-center gap-2 text-[11px] text-[#78716C] mt-0.5 font-mono">
                      <span>Nada {displayKey}</span>
                      <span aria-hidden="true">·</span>
                      <span>{displayBpm} BPM</span>
                      <span aria-hidden="true">·</span>
                      <span>{updatedDate}</span>
                    </div>
                  </div>
                </div>

                {songs.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteSong(song.id);
                    }}
                    className="p-1.5 rounded-md text-[#A8A29E] hover:text-rose-600 hover:bg-[#FAF9F5] opacity-0 group-hover:opacity-100 transition cursor-pointer"
                    title="Hapus draf ini"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer / Create New */}
        <div className="p-4 bg-[#FFFFFF] border-t border-[#E5E4DE]">
          {isCreating ? (
            <form onSubmit={handleCreate} className="space-y-3">
              <input
                type="text"
                placeholder="Judul lagu baru..."
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full p-2.5 bg-[#FAF9F5] border border-[#E5E4DE] rounded-lg text-sm text-[#1C1917] focus:outline-hidden focus:border-[#1C1917]"
                autoFocus
              />
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-xs font-mono">
                  <span className="text-[#78716C]">Nada Dasar:</span>
                  <select
                    value={newKey}
                    onChange={(e) => setNewKey(e.target.value)}
                    className="p-1 bg-[#FAF9F5] border border-[#E5E4DE] rounded font-bold"
                  >
                    {['C', 'D', 'E', 'F', 'G', 'A', 'B'].map(k => (
                      <option key={k} value={k}>{k}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsCreating(false)}
                    className="px-3 py-1.5 text-xs text-[#78716C] hover:text-[#1C1917] cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-3.5 py-1.5 text-xs font-medium bg-[#1C1917] text-[#FAF9F5] rounded-lg hover:bg-[#292524] cursor-pointer"
                  >
                    Buat Draf
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <button
              onClick={() => setIsCreating(true)}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#1C1917] text-[#FAF9F5] rounded-xl text-xs font-semibold hover:bg-[#292524] transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tulis Proyek Lagu Baru</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
