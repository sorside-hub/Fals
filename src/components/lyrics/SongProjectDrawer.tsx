import React, { useRef, useEffect, useState } from 'react';
import {
  X,
  ChevronRight,
  SlidersHorizontal,
  Plus,
  Star,
  Check,
  Edit2,
  Trash2,
  Copy,
  FileText,
  Mic,
  Upload,
  FileAudio,
} from 'lucide-react';
import { SongDraft, LyricVersion, AudioMemo } from '../../types';
import { AudioPill } from './AudioPill';
import { AudioRecorderModal } from './AudioRecorderModal';

interface SongProjectDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  song: SongDraft;
  onOpenConceptEditor: () => void;
  onAddVersion: (duplicateFromActive: boolean) => void;
  onSetFinalVersion: (versionId: string) => void;
  onSwitchVersion: (versionId: string) => void;
  onRenameVersion: (versionId: string, newName: string) => void;
  onDeleteVersion: (versionId: string) => void;
  onAddAudioMemo?: (name: string, duration: number, blob: Blob) => void;
  onRenameAudioMemo?: (memoId: string, newName: string) => void;
  onDeleteAudioMemo?: (memoId: string) => void;
}

export const SongProjectDrawer: React.FC<SongProjectDrawerProps> = ({
  isOpen,
  onClose,
  song,
  onOpenConceptEditor,
  onAddVersion,
  onSetFinalVersion,
  onSwitchVersion,
  onRenameVersion,
  onDeleteVersion,
  onAddAudioMemo,
  onRenameAudioMemo,
  onDeleteAudioMemo,
}) => {
  const drawerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [showAddMenu, setShowAddMenu] = useState(false);
  const [showAddAudioMenu, setShowAddAudioMenu] = useState(false);
  const [editingVersionId, setEditingVersionId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [versionToDelete, setVersionToDelete] = useState<LyricVersion | null>(null);

  // Audio state
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [playingMemoId, setPlayingMemoId] = useState<string | null>(null);
  const [memoToDelete, setMemoToDelete] = useState<AudioMemo | null>(null);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (memoToDelete) {
          setMemoToDelete(null);
        } else if (versionToDelete) {
          setVersionToDelete(null);
        } else if (isRecordModalOpen) {
          setIsRecordModalOpen(false);
        } else {
          onClose();
        }
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, memoToDelete, versionToDelete, isRecordModalOpen]);

  if (!isOpen) return null;

  // Extract clean snippet from TipTap HTML or plain text concept
  const getConceptExcerpt = (htmlOrText?: string) => {
    if (!htmlOrText) return 'Belum ada konsep/premis yang ditulis...';
    const clean = htmlOrText.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    if (!clean) return 'Belum ada konsep/premis yang ditulis...';
    return clean.length > 90 ? clean.slice(0, 90) + '...' : clean;
  };

  const handleStartRename = (e: React.MouseEvent, v: LyricVersion) => {
    e.stopPropagation();
    setEditingVersionId(v.id);
    setEditingName(v.name);
  };

  const handleSaveRename = (e: React.MouseEvent | React.KeyboardEvent, versionId: string) => {
    e.stopPropagation();
    if (editingName.trim()) {
      onRenameVersion(versionId, editingName.trim());
    }
    setEditingVersionId(null);
  };

  // Handle Audio File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];

    // Determine clean name without extension
    const cleanName = file.name.replace(/\.[^/.]+$/, '').trim() || 'File Audio';

    // Measure duration using Audio element
    const tempUrl = URL.createObjectURL(file);
    const tempAudio = new Audio(tempUrl);

    tempAudio.onloadedmetadata = () => {
      const duration = Math.round(tempAudio.duration) || 0;
      URL.revokeObjectURL(tempUrl);
      if (onAddAudioMemo) {
        onAddAudioMemo(cleanName, duration, file);
      }
    };

    tempAudio.onerror = () => {
      URL.revokeObjectURL(tempUrl);
      // Fallback save with default 0 duration
      if (onAddAudioMemo) {
        onAddAudioMemo(cleanName, 0, file);
      }
    };

    // Reset input
    e.target.value = '';
  };

  const versions = song.versions && song.versions.length > 0 ? song.versions : [
    {
      id: song.activeVersionId || 'v-1',
      name: 'Versi 1',
      content: song.content,
      isFinal: true,
      createdAt: song.updatedAt,
    }
  ];

  const audioMemos = song.audioMemos || [];

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex justify-end animate-fade-in cursor-pointer"
      onClick={onClose}
    >
      <div
        ref={drawerRef}
        className="w-full max-w-sm sm:max-w-md h-full bg-[#FAF9F5] border-l border-[#E5E4DE] shadow-2xl flex flex-col p-4 sm:p-5 space-y-5 animate-slide-in-right cursor-default overflow-y-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E5E4DE] pb-3 shrink-0">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-[#1C1917]" />
            <div>
              <h3 className="text-sm font-bold text-[#1C1917] line-clamp-1">Hub Proyek</h3>
              <p className="text-[11px] text-[#78716C] line-clamp-1">{song.title || 'Tanpa Judul'}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#78716C] hover:text-[#1C1917] hover:bg-[#EAE8DF] rounded-lg transition cursor-pointer"
            title="Tutup Panel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Section 1: Konsep & Premis */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono font-bold uppercase tracking-wider text-[#78716C]">
            <span>1. Konsep & Premis</span>
          </div>

          <div
            onClick={() => {
              onClose();
              onOpenConceptEditor();
            }}
            className="p-4 bg-[#FFFFFF] border border-[#E5E4DE] hover:border-[#1C1917] rounded-xl transition cursor-pointer shadow-2xs group space-y-2.5"
          >
            <p className="text-xs text-[#78716C] italic leading-relaxed line-clamp-3">
              "{getConceptExcerpt(song.concept)}"
            </p>

            <div className="pt-1 flex items-center justify-between border-t border-[#E5E4DE]/60">
              <span className="text-[11px] font-bold text-[#1C1917] group-hover:underline flex items-center gap-1">
                Buka Editor Konsep
              </span>
              <ChevronRight className="w-4 h-4 text-[#78716C] group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </div>

        {/* Section 2: Versi Lirik */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#78716C]">
              <span>2. Versi Lirik ({versions.length})</span>
            </div>

            {/* Add Version Button & Popover */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowAddMenu(!showAddMenu)}
                className="flex items-center gap-1 px-2.5 py-1 bg-[#1C1917] hover:bg-[#292524] text-[#FAF9F5] rounded-lg text-xs font-semibold transition cursor-pointer shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Versi Baru</span>
              </button>

              {showAddMenu && (
                <div className="absolute right-0 top-full mt-1.5 w-48 bg-[#FFFFFF] border border-[#E5E4DE] rounded-xl shadow-lg p-1.5 z-50 space-y-1 animate-scale-up">
                  <button
                    type="button"
                    onClick={() => {
                      onAddVersion(true);
                      setShowAddMenu(false);
                      onClose();
                    }}
                    className="w-full flex items-center gap-2 p-2 rounded-lg text-left text-xs font-medium text-[#1C1917] hover:bg-[#F5F4EE] transition cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5 text-[#78716C]" />
                    <span>Salin dari Versi Aktif</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onAddVersion(false);
                      setShowAddMenu(false);
                      onClose();
                    }}
                    className="w-full flex items-center gap-2 p-2 rounded-lg text-left text-xs font-medium text-[#1C1917] hover:bg-[#F5F4EE] transition cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5 text-[#78716C]" />
                    <span>Kanvas Kosong</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* List of Versions */}
          <div className="space-y-2">
            {versions.map((ver) => {
              const isActive = ver.id === song.activeVersionId;
              const isEditing = editingVersionId === ver.id;

              return (
                <div
                  key={ver.id}
                  onClick={() => {
                    if (!isEditing) {
                      onSwitchVersion(ver.id);
                      onClose(); // Automatically close drawer when selecting a version card
                    }
                  }}
                  className={`p-3 rounded-xl border transition flex flex-col space-y-2 cursor-pointer ${
                    isActive
                      ? 'bg-[#FFFFFF] border-[#1C1917] shadow-xs ring-1 ring-[#1C1917]/10'
                      : 'bg-[#FFFFFF] border-[#E5E4DE] hover:border-[#1C1917]'
                  }`}
                >
                  {/* Top Row: Name & Badges */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      {/* Active Indicator Dot */}
                      <span
                        className={`w-2 h-2 rounded-full shrink-0 ${
                          isActive ? 'bg-amber-500 ring-2 ring-amber-500/20' : 'bg-[#D6D3D1]'
                        }`}
                      />

                      {/* Name input or text */}
                      {isEditing ? (
                        <div
                          className="flex items-center gap-1 flex-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <input
                            type="text"
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSaveRename(e, ver.id);
                            }}
                            className="w-full px-2 py-0.5 text-xs bg-[#FAF9F5] border border-[#1C1917] rounded outline-hidden font-bold"
                            autoFocus
                          />
                          <button
                            type="button"
                            onClick={(e) => handleSaveRename(e, ver.id)}
                            className="p-1 bg-[#1C1917] text-white rounded cursor-pointer"
                          >
                            <Check className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <span className="font-bold text-xs text-[#1C1917] truncate">
                          {ver.name}
                        </span>
                      )}

                      {/* Final Version Badge */}
                      {ver.isFinal && (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-mono font-bold shrink-0">
                          <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                          <span>Final</span>
                        </span>
                      )}
                    </div>

                    {/* Action icons */}
                    <div className="flex items-center gap-1 shrink-0">
                      {!isEditing && (
                        <button
                          type="button"
                          onClick={(e) => handleStartRename(e, ver)}
                          className="p-1 text-[#A8A29E] hover:text-[#1C1917] hover:bg-[#F5F4EE] rounded transition cursor-pointer"
                          title="Ubah Nama Versi"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {versions.length > 1 && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setVersionToDelete(ver);
                          }}
                          className="p-1 text-[#A8A29E] hover:text-rose-600 hover:bg-[#FAF9F5] rounded transition cursor-pointer"
                          title="Hapus Versi Ini"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Bottom Row: Active Status / Set Final Action */}
                  <div className="flex items-center justify-between pt-1 border-t border-[#E5E4DE]/60 text-[11px]">
                    <span className="font-mono text-[#78716C]">
                      {isActive ? (
                        <span className="font-bold text-[#1C1917]">▶ Sedang Dibuka</span>
                      ) : (
                        <span>Klik untuk buka versi ini</span>
                      )}
                    </span>

                    {!ver.isFinal && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSetFinalVersion(ver.id);
                        }}
                        className="flex items-center gap-1 px-2 py-0.5 rounded bg-[#F5F4EE] hover:bg-[#EAE8DF] text-[#44403C] font-medium border border-[#E5E4DE] transition cursor-pointer"
                        title="Jadikan versi ini sebagai Versi Final yang terbuka otomatis saat lagu dipilih"
                      >
                        <Star className="w-3 h-3 text-[#78716C]" />
                        <span>Set Final</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 3: Rekaman Audio */}
        <div className="space-y-2.5 pt-1">
          <div className="flex items-center justify-between">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#78716C]">
              <span>3. Rekaman Audio ({audioMemos.length})</span>
            </div>

            {/* Add Audio Button & Popover */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowAddAudioMenu(!showAddAudioMenu)}
                className="flex items-center gap-1 px-2.5 py-1 bg-[#1C1917] hover:bg-[#292524] text-[#FAF9F5] rounded-lg text-xs font-semibold transition cursor-pointer shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Audio</span>
              </button>

              {showAddAudioMenu && (
                <div className="absolute right-0 top-full mt-1.5 w-52 bg-[#FFFFFF] border border-[#E5E4DE] rounded-xl shadow-lg p-1.5 z-50 space-y-1 animate-scale-up">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddAudioMenu(false);
                      setIsRecordModalOpen(true);
                    }}
                    className="w-full flex items-center gap-2 p-2 rounded-lg text-left text-xs font-medium text-[#1C1917] hover:bg-[#F5F4EE] transition cursor-pointer"
                  >
                    <Mic className="w-4 h-4 text-rose-600" />
                    <span>Rekam Suara Langsung</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddAudioMenu(false);
                      fileInputRef.current?.click();
                    }}
                    className="w-full flex items-center gap-2 p-2 rounded-lg text-left text-xs font-medium text-[#1C1917] hover:bg-[#F5F4EE] transition cursor-pointer"
                  >
                    <Upload className="w-4 h-4 text-amber-600" />
                    <span>Unggah File Audio</span>
                  </button>
                </div>
              )}

              {/* Hidden File Picker */}
              <input
                ref={fileInputRef}
                type="file"
                accept="audio/*,.mp3,.wav,.m4a,.aac,.ogg"
                className="hidden"
                onChange={handleFileUpload}
              />
            </div>
          </div>

          {/* List of Audio Pills or Empty State */}
          {audioMemos.length === 0 ? (
            <div
              onClick={() => setIsRecordModalOpen(true)}
              className="p-4 bg-[#FFFFFF] border border-dashed border-[#E5E4DE] hover:border-[#1C1917] rounded-xl transition cursor-pointer text-center space-y-2 group"
            >
              <div className="w-8 h-8 rounded-full bg-[#FAF9F5] border border-[#E5E4DE] flex items-center justify-center mx-auto text-[#78716C] group-hover:text-[#1C1917] group-hover:scale-105 transition">
                <FileAudio className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-[#1C1917]">Belum ada rekaman audio</p>
                <p className="text-[11px] text-[#78716C]">
                  Rekam melodi vokal langsung atau unggah file rekaman untuk referensi lagu ini.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {audioMemos.map((memo) => (
                <AudioPill
                  key={memo.id}
                  memo={memo}
                  isPlaying={playingMemoId === memo.id}
                  onPlayToggle={() => {
                    setPlayingMemoId((prev) => (prev === memo.id ? null : memo.id));
                  }}
                  onEnded={() => setPlayingMemoId(null)}
                  onRename={(newName) => {
                    if (onRenameAudioMemo) onRenameAudioMemo(memo.id, newName);
                  }}
                  onDeleteRequest={() => setMemoToDelete(memo)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Modal Konfirmasi Hapus Versi Lirik */}
        {versionToDelete && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fade-in cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              setVersionToDelete(null);
            }}
          >
            <div
              className="w-full max-w-xs bg-[#FAF9F5] border border-[#E5E4DE] rounded-2xl shadow-xl p-5 space-y-3 animate-scale-up cursor-default"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-sm font-bold text-[#1C1917]">Hapus Versi Lirik?</h3>
              <p className="text-xs text-[#78716C] leading-relaxed">
                Versi <span className="font-bold text-[#1C1917]">"{versionToDelete.name}"</span> akan dihapus secara permanen.
              </p>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E5E4DE]">
                <button
                  type="button"
                  onClick={() => setVersionToDelete(null)}
                  className="px-3.5 py-1.5 text-xs font-medium text-[#78716C] hover:text-[#1C1917] hover:bg-[#EAE8DF] rounded-lg transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onDeleteVersion(versionToDelete.id);
                    setVersionToDelete(null);
                  }}
                  className="px-3.5 py-1.5 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition cursor-pointer shadow-2xs"
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Konfirmasi Hapus Memo Audio */}
        {memoToDelete && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fade-in cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              setMemoToDelete(null);
            }}
          >
            <div
              className="w-full max-w-xs bg-[#FAF9F5] border border-[#E5E4DE] rounded-2xl shadow-xl p-5 space-y-3 animate-scale-up cursor-default"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-sm font-bold text-[#1C1917]">Hapus Rekaman Audio?</h3>
              <p className="text-xs text-[#78716C] leading-relaxed">
                Rekaman <span className="font-bold text-[#1C1917]">"{memoToDelete.name}"</span> akan dihapus dari proyek ini.
              </p>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E5E4DE]">
                <button
                  type="button"
                  onClick={() => setMemoToDelete(null)}
                  className="px-3.5 py-1.5 text-xs font-medium text-[#78716C] hover:text-[#1C1917] hover:bg-[#EAE8DF] rounded-lg transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (playingMemoId === memoToDelete.id) {
                      setPlayingMemoId(null);
                    }
                    if (onDeleteAudioMemo) {
                      onDeleteAudioMemo(memoToDelete.id);
                    }
                    setMemoToDelete(null);
                  }}
                  className="px-3.5 py-1.5 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition cursor-pointer shadow-2xs"
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Perekam Suara Langsung */}
        <AudioRecorderModal
          isOpen={isRecordModalOpen}
          onClose={() => setIsRecordModalOpen(false)}
          defaultTakeNumber={(audioMemos.length || 0) + 1}
          onSaveRecord={(name, duration, blob) => {
            if (onAddAudioMemo) {
              onAddAudioMemo(name, duration, blob);
            }
          }}
        />
      </div>
    </div>
  );
};
