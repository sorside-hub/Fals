import { useState, useEffect } from 'react';
import { SongDraft } from '../types';

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
  }
];

export function useSongs() {
  const [songs, setSongs] = useState<SongDraft[]>(() => {
    try {
      const saved = localStorage.getItem('fals_songs');
      return saved ? JSON.parse(saved) : INITIAL_SONGS;
    } catch {
      return INITIAL_SONGS;
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

  const currentSong = songs.find(s => s.id === currentSongId) || songs[0] || INITIAL_SONGS[0];

  const updateSong = (updatedSong: SongDraft) => {
    setSongs(prev => prev.map(s => s.id === updatedSong.id ? updatedSong : s));
  };

  const createSong = (title: string, key: string, status: 'draft' | 'proses' | 'release' = 'draft') => {
    const newSong: SongDraft = {
      id: `song-${Date.now()}`,
      title,
      key,
      bpm: 95,
      timeSignature: '4/4',
      status,
      updatedAt: Date.now(),
      content: `<h3>[Verse 1]</h3><p></p><h3>[Chorus]</h3><p></p>`,
    };
    setSongs(prev => [newSong, ...prev]);
    setCurrentSongId(newSong.id);
    return newSong;
  };

  const deleteSong = (id: string) => {
    if (songs.length <= 1) return;
    const remaining = songs.filter(s => s.id !== id);
    setSongs(remaining);
    if (currentSongId === id) {
      setCurrentSongId(remaining[0].id);
    }
  };

  const selectSong = (song: SongDraft) => {
    setCurrentSongId(song.id);
  };

  return {
    songs,
    currentSong,
    currentSongId,
    updateSong,
    createSong,
    deleteSong,
    selectSong,
  };
}
