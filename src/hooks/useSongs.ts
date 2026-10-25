import { useState, useEffect } from 'react';
import { SongDraft, LyricVersion, AudioMemo } from '../types';
import { saveAudioBlob, deleteAudioBlob } from '../utils/audioStorage';

const INITIAL_SONGS: SongDraft[] = [
  {
    id: 'song-1',
    title: 'Harmoni yang Tertinggal',
    key: 'C',
    bpm: 96,
    timeSignature: '4/4',
    status: 'proses',
    updatedAt: Date.now() - 3600000,
    content: `<h3>[Verse 1]</h3>
<p>Di sudut kamar yang beralas dingin [C]</p>
<p>Kucoba petik senar gitar yang hening [Am]</p>
<p>Ada melodi yang belum terpikirkan [F]</p>
<p>Tertahan ragu di ujung pengharapan [G]</p>
<p></p>
<h3>[Chorus]</h3>
<p>FALS mengalun di dada yang sunyi [Cmaj7]</p>
<p>Mencari akor yang mengerti arti [Am7]</p>
<p>Jika nada ini tak lagi seirama [Fadd9]</p>
<p>Biar lagu ini tetap bercerita [G7]</p>`,
    versions: [
      {
        id: 'v-1',
        name: 'Versi 1',
        content: `<h3>[Verse 1]</h3>
<p>Di sudut kamar yang beralas dingin [C]</p>
<p>Kucoba petik senar gitar yang hening [Am]</p>
<p>Ada melodi yang belum terpikirkan [F]</p>
<p>Tertahan ragu di ujung pengharapan [G]</p>
<p></p>
<h3>[Chorus]</h3>
<p>FALS mengalun di dada yang sunyi [Cmaj7]</p>
<p>Mencari akor yang mengerti arti [Am7]</p>
<p>Jika nada ini tak lagi seirama [Fadd9]</p>
<p>Biar lagu ini tetap bercerita [G7]</p>`,
        isFinal: true,
        createdAt: Date.now() - 3600000,
      }
    ],
    activeVersionId: 'v-1',
  },
  {
    id: 'song-2',
    title: 'Sketsa Sore di Kota',
    key: 'G',
    bpm: 110,
    timeSignature: '4/4',
    status: 'draft',
    updatedAt: Date.now() - 86400000,
    content: `<h3>[Verse 1]</h3>
<p>Lampu jalan mulai menyala perlahan [G]</p>
<p>Menyapa langkah kaki yang kelelahan [Em]</p>
<p>Segelas kopi di warung pojokan [C]</p>
<p>Menemani selembar kertas coretan [D]</p>`,
    versions: [
      {
        id: 'v-2',
        name: 'Versi 1',
        content: `<h3>[Verse 1]</h3>
<p>Lampu jalan mulai menyala perlahan [G]</p>
<p>Menyapa langkah kaki yang kelelahan [Em]</p>
<p>Segelas kopi di warung pojokan [C]</p>
<p>Menemani selembar kertas coretan [D]</p>`,
        isFinal: true,
        createdAt: Date.now() - 86400000,
      }
    ],
    activeVersionId: 'v-2',
  }
];

function ensureSongVersions(song: SongDraft): SongDraft {
  if (song.versions && song.versions.length > 0) {
    const activeVersionId = song.activeVersionId || song.versions.find(v => v.isFinal)?.id || song.versions[0].id;
    return { ...song, activeVersionId };
  }
  const defaultVersion: LyricVersion = {
    id: `v-${song.id}-1`,
    name: 'Versi 1',
    content: song.content || '',
    isFinal: true,
    createdAt: song.updatedAt || Date.now(),
  };
  return {
    ...song,
    versions: [defaultVersion],
    activeVersionId: defaultVersion.id,
  };
}

export function useSongs() {
  const [songs, setSongs] = useState<SongDraft[]>(() => {
    try {
      const saved = localStorage.getItem('fals_songs');
      if (saved) {
        const parsed: SongDraft[] = JSON.parse(saved);
        return parsed.map(ensureSongVersions);
      }
      return INITIAL_SONGS.map(ensureSongVersions);
    } catch {
      return INITIAL_SONGS.map(ensureSongVersions);
    }
  });

  const [currentSongId, setCurrentSongId] = useState<string>(() => {
    return songs[0]?.id || 'song-1';
  });

  // Save to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('fals_songs', JSON.stringify(songs));
    } catch (e) {
      console.error('Failed to save songs to localStorage', e);
    }
  }, [songs]);

  const currentSong = ensureSongVersions(songs.find(s => s.id === currentSongId) || songs[0] || INITIAL_SONGS[0]);

  const updateSong = (updatedSong: SongDraft) => {
    setSongs(prev => prev.map(s => s.id === updatedSong.id ? ensureSongVersions(updatedSong) : s));
  };

  const createSong = (title: string, key: string, status: 'draft' | 'proses' | 'release' = 'draft') => {
    const initialContent = `<h3>[Verse 1]</h3><p></p><h3>[Chorus]</h3><p></p>`;
    const timestamp = Date.now();
    const defaultVersion: LyricVersion = {
      id: `v-${timestamp}`,
      name: 'Versi 1',
      content: initialContent,
      isFinal: true,
      createdAt: timestamp,
    };
    const newSong: SongDraft = {
      id: `song-${timestamp}`,
      title,
      key,
      bpm: 95,
      timeSignature: '4/4',
      status,
      updatedAt: timestamp,
      content: initialContent,
      versions: [defaultVersion],
      activeVersionId: defaultVersion.id,
    };
    setSongs(prev => [newSong, ...prev]);
    setCurrentSongId(newSong.id);
    return newSong;
  };

  const deleteSong = (id: string) => {
    if (songs.length <= 1) return;
    const target = songs.find(s => s.id === id);
    if (target?.audioMemos) {
      target.audioMemos.forEach(m => {
        deleteAudioBlob(m.id).catch(console.error);
      });
    }
    const remaining = songs.filter(s => s.id !== id);
    setSongs(remaining);
    if (currentSongId === id) {
      setCurrentSongId(remaining[0].id);
    }
  };

  const selectSong = (song: SongDraft) => {
    setCurrentSongId(song.id);
    const ensured = ensureSongVersions(song);
    // Auto-select Final Version when opening song from list
    const finalVersion = ensured.versions?.find(v => v.isFinal) || ensured.versions?.[0];
    if (finalVersion) {
      const updated = {
        ...ensured,
        activeVersionId: finalVersion.id,
        content: finalVersion.content,
      };
      updateSong(updated);
    }
  };

  // Version management actions
  const addVersion = (songId: string, duplicateFromActive = true) => {
    setSongs(prev => prev.map(song => {
      if (song.id !== songId) return song;
      const ensured = ensureSongVersions(song);
      const versionCount = (ensured.versions?.length || 0) + 1;
      const timestamp = Date.now();
      const activeVer = ensured.versions?.find(v => v.id === ensured.activeVersionId);
      const newVersion: LyricVersion = {
        id: `v-${timestamp}`,
        name: `Versi ${versionCount}`,
        content: duplicateFromActive && activeVer ? activeVer.content : `<h3>[Verse 1]</h3><p></p>`,
        isFinal: false,
        createdAt: timestamp,
      };
      const updatedVersions = [...(ensured.versions || []), newVersion];
      return {
        ...ensured,
        versions: updatedVersions,
        activeVersionId: newVersion.id,
        content: newVersion.content,
        updatedAt: timestamp,
      };
    }));
  };

  const setFinalVersion = (songId: string, versionId: string) => {
    setSongs(prev => prev.map(song => {
      if (song.id !== songId) return song;
      const ensured = ensureSongVersions(song);
      const updatedVersions = (ensured.versions || []).map(v => ({
        ...v,
        isFinal: v.id === versionId,
      }));
      return {
        ...ensured,
        versions: updatedVersions,
        updatedAt: Date.now(),
      };
    }));
  };

  const switchVersion = (songId: string, versionId: string) => {
    setSongs(prev => prev.map(song => {
      if (song.id !== songId) return song;
      const ensured = ensureSongVersions(song);
      const targetVer = ensured.versions?.find(v => v.id === versionId);
      if (!targetVer) return song;
      return {
        ...ensured,
        activeVersionId: versionId,
        content: targetVer.content,
        updatedAt: Date.now(),
      };
    }));
  };

  const renameVersion = (songId: string, versionId: string, newName: string) => {
    setSongs(prev => prev.map(song => {
      if (song.id !== songId) return song;
      const ensured = ensureSongVersions(song);
      const updatedVersions = (ensured.versions || []).map(v => v.id === versionId ? { ...v, name: newName } : v);
      return {
        ...ensured,
        versions: updatedVersions,
        updatedAt: Date.now(),
      };
    }));
  };

  const deleteVersion = (songId: string, versionId: string) => {
    setSongs(prev => prev.map(song => {
      if (song.id !== songId) return song;
      const ensured = ensureSongVersions(song);
      if (!ensured.versions || ensured.versions.length <= 1) return song;

      const remainingVersions = ensured.versions.filter(v => v.id !== versionId);
      // If deleted version was final, make first remaining version final
      const hasFinal = remainingVersions.some(v => v.isFinal);
      const finalVersions = hasFinal
        ? remainingVersions
        : remainingVersions.map((v, i) => i === 0 ? { ...v, isFinal: true } : v);

      const nextActive = finalVersions.find(v => v.id === ensured.activeVersionId) || finalVersions[0];

      return {
        ...ensured,
        versions: finalVersions,
        activeVersionId: nextActive.id,
        content: nextActive.content,
        updatedAt: Date.now(),
      };
    }));
  };

  // Audio Memo management
  const addAudioMemo = async (songId: string, memo: AudioMemo, blob: Blob) => {
    await saveAudioBlob(memo.id, blob);
    setSongs(prev => prev.map(song => {
      if (song.id !== songId) return song;
      const updatedMemos = [...(song.audioMemos || []), memo];
      return {
        ...song,
        audioMemos: updatedMemos,
        updatedAt: Date.now(),
      };
    }));
  };

  const renameAudioMemo = (songId: string, memoId: string, newName: string) => {
    setSongs(prev => prev.map(song => {
      if (song.id !== songId) return song;
      const updatedMemos = (song.audioMemos || []).map(m => m.id === memoId ? { ...m, name: newName } : m);
      return {
        ...song,
        audioMemos: updatedMemos,
        updatedAt: Date.now(),
      };
    }));
  };

  const deleteAudioMemo = async (songId: string, memoId: string) => {
    await deleteAudioBlob(memoId);
    setSongs(prev => prev.map(song => {
      if (song.id !== songId) return song;
      const updatedMemos = (song.audioMemos || []).filter(m => m.id !== memoId);
      return {
        ...song,
        audioMemos: updatedMemos,
        updatedAt: Date.now(),
      };
    }));
  };

  return {
    songs,
    currentSong,
    currentSongId,
    updateSong,
    createSong,
    deleteSong,
    selectSong,
    addVersion,
    setFinalVersion,
    switchVersion,
    renameVersion,
    deleteVersion,
    addAudioMemo,
    renameAudioMemo,
    deleteAudioMemo,
  };
}
