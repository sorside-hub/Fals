import { useState, useEffect } from 'react';
import { SongDraft, LyricVersion, AudioMemo, ProjectType, SongStatus } from '../types';
import { saveAudioBlob, deleteAudioBlob } from '../utils/audioStorage';

const INITIAL_SONGS: SongDraft[] = [
  {
    id: 'song-1',
    title: 'Harmoni yang Tertinggal',
    projectType: 'single',
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
        key: 'C',
        bpm: 96,
        isFinal: true,
        createdAt: Date.now() - 3600000,
      }
    ],
    activeVersionId: 'v-1',
  },
  {
    id: 'song-2',
    title: 'Sketsa Sore di Kota',
    projectType: 'single',
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
        key: 'G',
        bpm: 110,
        isFinal: true,
        createdAt: Date.now() - 86400000,
      }
    ],
    activeVersionId: 'v-2',
  },
  {
    id: 'project-ep-1',
    title: 'Epilog Kota Dingin',
    projectType: 'ep',
    concept: 'Sebuah narasi 3 bagian tentang kerinduan, penyesalan, dan penerimaan di tengah hiruk-pikuk kota malam.',
    key: 'D',
    bpm: 88,
    timeSignature: '4/4',
    status: 'progress',
    updatedAt: Date.now() - 7200000,
    content: '',
    tracks: [
      {
        id: 'track-ep-1',
        title: '01. Lampu Mercusuar',
        projectType: 'single',
        key: 'D',
        bpm: 88,
        timeSignature: '4/4',
        status: 'final',
        updatedAt: Date.now() - 7200000,
        content: `<h3>[Verse 1]</h3><p>Cahaya berputar di kejauhan [D]</p><p>Menembus pekatnya halimun lautan [Bm]</p>`,
        versions: [
          {
            id: 'v-track-1-1',
            name: 'Versi 1',
            content: `<h3>[Verse 1]</h3><p>Cahaya berputar di kejauhan [D]</p><p>Menembus pekatnya halimun lautan [Bm]</p>`,
            key: 'D',
            bpm: 88,
            isFinal: true,
            createdAt: Date.now() - 7200000,
          }
        ],
        activeVersionId: 'v-track-1-1',
      },
      {
        id: 'track-ep-2',
        title: '02. Lorong Tanpa Suara',
        projectType: 'single',
        key: 'Bm',
        bpm: 92,
        timeSignature: '4/4',
        status: 'progress',
        updatedAt: Date.now() - 3600000,
        content: `<h3>[Verse 1]</h3><p>Gema langkah membentur dinding [Bm]</p><p>Hati yang sunyi mulai bergeming [G]</p>`,
        versions: [
          {
            id: 'v-track-2-1',
            name: 'Versi 1',
            content: `<h3>[Verse 1]</h3><p>Gema langkah membentur dinding [Bm]</p><p>Hati yang sunyi mulai bergeming [G]</p>`,
            key: 'Bm',
            bpm: 92,
            isFinal: true,
            createdAt: Date.now() - 3600000,
          }
        ],
        activeVersionId: 'v-track-2-1',
      },
      {
        id: 'track-ep-3',
        title: '03. Hujan di Halte Terakhir',
        projectType: 'single',
        key: 'G',
        bpm: 80,
        timeSignature: '4/4',
        status: 'draft',
        updatedAt: Date.now() - 1800000,
        content: `<h3>[Verse 1]</h3><p>Air menitik dari atap seng [G]</p><p>Bus terakhir tak kunjung datang [Em]</p>`,
        versions: [
          {
            id: 'v-track-3-1',
            name: 'Versi 1',
            content: `<h3>[Verse 1]</h3><p>Air menitik dari atap seng [G]</p><p>Bus terakhir tak kunjung datang [Em]</p>`,
            key: 'G',
            bpm: 80,
            isFinal: true,
            createdAt: Date.now() - 1800000,
          }
        ],
        activeVersionId: 'v-track-3-1',
      }
    ]
  }
];

export function ensureSongVersions(song: SongDraft): SongDraft {
  const projectType = song.projectType || 'single';
  const rawStatus = song.status || 'draft';
  const status = rawStatus === 'proses' ? 'progress' : rawStatus;

  // Recursively ensure tracks for EP and Album
  let tracks = song.tracks;
  if (tracks && tracks.length > 0) {
    tracks = tracks.map(t => ensureSongVersions({ ...t, projectType: 'single' }));
  }

  if (song.versions && song.versions.length > 0) {
    const activeVersionId = song.activeVersionId || song.versions.find(v => v.isFinal)?.id || song.versions[0].id;
    const versions = song.versions.map(v => ({
      ...v,
      key: v.key || song.key || 'C',
      bpm: v.bpm || song.bpm || 95,
    }));
    const finalVer = versions.find(v => v.isFinal) || versions[0];
    return {
      ...song,
      projectType,
      status,
      tracks,
      key: finalVer?.key || song.key || 'C',
      bpm: finalVer?.bpm ?? song.bpm ?? 95,
      versions,
      activeVersionId,
    };
  }

  const defaultVersion: LyricVersion = {
    id: `v-${song.id}-1`,
    name: 'Versi 1',
    content: song.content || '',
    key: song.key || 'C',
    bpm: song.bpm || 95,
    isFinal: true,
    createdAt: song.updatedAt || Date.now(),
  };

  return {
    ...song,
    projectType,
    status,
    tracks,
    versions: [defaultVersion],
    activeVersionId: defaultVersion.id,
  };
}

// Helper to apply updates either to top-level song or a track inside an album
function applyToSongOrTrack(
  songs: SongDraft[],
  targetId: string,
  updater: (song: SongDraft) => SongDraft
): SongDraft[] {
  return songs.map(s => {
    if (s.id === targetId) {
      return ensureSongVersions(updater(ensureSongVersions(s)));
    }
    if (s.tracks && s.tracks.some(t => t.id === targetId)) {
      return {
        ...s,
        updatedAt: Date.now(),
        tracks: s.tracks.map(t =>
          t.id === targetId ? ensureSongVersions(updater(ensureSongVersions(t))) : t
        ),
      };
    }
    return s;
  });
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

  // Track parent album context if editing a track inside an album
  const [activeParentAlbumId, setActiveParentAlbumId] = useState<string | null>(null);

  // Save to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('fals_songs', JSON.stringify(songs));
    } catch (e) {
      console.error('Failed to save songs to localStorage', e);
    }
  }, [songs]);

  // Find song or nested track
  const findSong = (id: string): { song: SongDraft; parentAlbum?: SongDraft } | null => {
    for (const s of songs) {
      if (s.id === id) return { song: s };
      if (s.tracks) {
        const tr = s.tracks.find(t => t.id === id);
        if (tr) return { song: tr, parentAlbum: s };
      }
    }
    return null;
  };

  const lookup = findSong(currentSongId);
  const currentSong = lookup ? ensureSongVersions(lookup.song) : ensureSongVersions(songs[0] || INITIAL_SONGS[0]);
  const currentParentAlbum = lookup?.parentAlbum || (activeParentAlbumId ? songs.find(s => s.id === activeParentAlbumId) : undefined);

  const updateSong = (updatedSong: SongDraft) => {
    setSongs(prev => applyToSongOrTrack(prev, updatedSong.id, () => updatedSong));
  };

  // Create Project: Single, EP, or Album
  const createProject = (
    type: ProjectType,
    title: string,
    options?: {
      key?: string;
      concept?: string;
      trackCount?: number;
      status?: SongStatus;
    }
  ) => {
    const timestamp = Date.now();
    const status = options?.status || 'draft';
    const initialKey = options?.key || 'C';

    if (type === 'single') {
      const initialContent = `<h3>[Verse 1]</h3><p></p><h3>[Chorus]</h3><p></p>`;
      const defaultVersion: LyricVersion = {
        id: `v-${timestamp}`,
        name: 'Versi 1',
        content: initialContent,
        key: initialKey,
        bpm: 95,
        isFinal: true,
        createdAt: timestamp,
      };
      const newSong: SongDraft = {
        id: `song-${timestamp}`,
        title,
        projectType: 'single',
        key: initialKey,
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
      setActiveParentAlbumId(null);
      return newSong;
    }

    // EP or Album project
    const defaultTrackCount = options?.trackCount || (type === 'ep' ? 4 : 8);
    const generatedTracks: SongDraft[] = Array.from({ length: defaultTrackCount }).map((_, idx) => {
      const num = String(idx + 1).padStart(2, '0');
      const trackId = `track-${timestamp}-${idx + 1}`;
      const trackVerId = `v-track-${timestamp}-${idx + 1}`;
      return {
        id: trackId,
        title: `Track ${num}`,
        projectType: 'single',
        key: 'C',
        bpm: 95,
        timeSignature: '4/4',
        status: 'draft',
        updatedAt: timestamp,
        content: `<h3>[Verse 1]</h3><p></p><h3>[Chorus]</h3><p></p>`,
        versions: [
          {
            id: trackVerId,
            name: 'Versi 1',
            content: `<h3>[Verse 1]</h3><p></p><h3>[Chorus]</h3><p></p>`,
            key: 'C',
            bpm: 95,
            isFinal: true,
            createdAt: timestamp,
          }
        ],
        activeVersionId: trackVerId,
      };
    });

    const newProject: SongDraft = {
      id: `project-${timestamp}`,
      title,
      projectType: type,
      concept: options?.concept || '',
      key: 'C',
      bpm: 95,
      timeSignature: '4/4',
      status,
      updatedAt: timestamp,
      content: '',
      tracks: generatedTracks,
    };

    setSongs(prev => [newProject, ...prev]);
    setCurrentSongId(newProject.id);
    setActiveParentAlbumId(null);
    return newProject;
  };

  // Backwards compatibility alias for createSong
  const createSong = (title: string, key: string, status: 'draft' | 'proses' | 'release' = 'draft') => {
    return createProject('single', title, { key, status });
  };

  const deleteSong = (id: string) => {
    if (songs.length <= 1) return;
    const target = songs.find(s => s.id === id);
    if (target?.audioMemos) {
      target.audioMemos.forEach(m => {
        deleteAudioBlob(m.id).catch(console.error);
      });
    }
    // If target has tracks with audio
    if (target?.tracks) {
      target.tracks.forEach(tr => {
        tr.audioMemos?.forEach(m => deleteAudioBlob(m.id).catch(console.error));
      });
    }

    const remaining = songs.filter(s => s.id !== id);
    setSongs(remaining);
    if (currentSongId === id) {
      setCurrentSongId(remaining[0].id);
      setActiveParentAlbumId(null);
    }
  };

  const selectSong = (song: SongDraft, parentAlbum?: SongDraft) => {
    setCurrentSongId(song.id);
    setActiveParentAlbumId(parentAlbum ? parentAlbum.id : null);
    const ensured = ensureSongVersions(song);
    // Auto-select Final Version when opening song
    const finalVersion = ensured.versions?.find(v => v.isFinal) || ensured.versions?.[0];
    if (finalVersion && ensured.projectType === 'single') {
      const updated = {
        ...ensured,
        activeVersionId: finalVersion.id,
        content: finalVersion.content,
        key: finalVersion.key || ensured.key,
        bpm: finalVersion.bpm ?? ensured.bpm,
      };
      updateSong(updated);
    }
  };

  // EP / Album Track management
  const addTrackToProject = (projectId: string, title?: string) => {
    setSongs(prev => prev.map(proj => {
      if (proj.id !== projectId) return proj;
      const count = (proj.tracks?.length || 0) + 1;
      const num = String(count).padStart(2, '0');
      const timestamp = Date.now();
      const trackId = `track-${timestamp}`;
      const verId = `v-${timestamp}`;
      const newTrack: SongDraft = {
        id: trackId,
        title: title || `Track ${num}`,
        projectType: 'single',
        key: 'C',
        bpm: 95,
        timeSignature: '4/4',
        status: 'draft',
        updatedAt: timestamp,
        content: `<h3>[Verse 1]</h3><p></p><h3>[Chorus]</h3><p></p>`,
        versions: [
          {
            id: verId,
            name: 'Versi 1',
            content: `<h3>[Verse 1]</h3><p></p><h3>[Chorus]</h3><p></p>`,
            key: 'C',
            bpm: 95,
            isFinal: true,
            createdAt: timestamp,
          }
        ],
        activeVersionId: verId,
      };
      return {
        ...proj,
        tracks: [...(proj.tracks || []), newTrack],
        updatedAt: timestamp,
      };
    }));
  };

  const deleteTrackFromProject = (projectId: string, trackId: string) => {
    setSongs(prev => prev.map(proj => {
      if (proj.id !== projectId) return proj;
      if (!proj.tracks || proj.tracks.length <= 1) return proj;
      const targetTrack = proj.tracks.find(t => t.id === trackId);
      targetTrack?.audioMemos?.forEach(m => deleteAudioBlob(m.id).catch(console.error));
      return {
        ...proj,
        tracks: proj.tracks.filter(t => t.id !== trackId),
        updatedAt: Date.now(),
      };
    }));
  };

  const updateProjectConcept = (projectId: string, concept: string) => {
    setSongs(prev => prev.map(proj => {
      if (proj.id !== projectId) return proj;
      return {
        ...proj,
        concept,
        updatedAt: Date.now(),
      };
    }));
  };

  // Version management actions (works for both standalone single and album tracks)
  const addVersion = (songId: string, duplicateFromActive = true) => {
    setSongs(prev => applyToSongOrTrack(prev, songId, (song) => {
      const versionCount = (song.versions?.length || 0) + 1;
      const timestamp = Date.now();
      const activeVer = song.versions?.find(v => v.id === song.activeVersionId);
      const newKey = duplicateFromActive && activeVer?.key ? activeVer.key : song.key || 'C';
      const newBpm = duplicateFromActive && activeVer?.bpm ? activeVer.bpm : song.bpm || 95;
      const newVersion: LyricVersion = {
        id: `v-${timestamp}`,
        name: `Versi ${versionCount}`,
        content: duplicateFromActive && activeVer ? activeVer.content : `<h3>[Verse 1]</h3><p></p>`,
        key: newKey,
        bpm: newBpm,
        isFinal: false,
        createdAt: timestamp,
      };
      const updatedVersions = [...(song.versions || []), newVersion];
      return {
        ...song,
        versions: updatedVersions,
        activeVersionId: newVersion.id,
        content: newVersion.content,
        updatedAt: timestamp,
      };
    }));
  };

  const setFinalVersion = (songId: string, versionId: string) => {
    setSongs(prev => applyToSongOrTrack(prev, songId, (song) => {
      const updatedVersions = (song.versions || []).map(v => ({
        ...v,
        isFinal: v.id === versionId,
      }));
      const finalVer = updatedVersions.find(v => v.id === versionId);
      return {
        ...song,
        key: finalVer?.key || song.key,
        bpm: finalVer?.bpm ?? song.bpm,
        versions: updatedVersions,
        updatedAt: Date.now(),
      };
    }));
  };

  const switchVersion = (songId: string, versionId: string) => {
    setSongs(prev => applyToSongOrTrack(prev, songId, (song) => {
      const targetVer = song.versions?.find(v => v.id === versionId);
      if (!targetVer) return song;
      return {
        ...song,
        activeVersionId: versionId,
        content: targetVer.content,
        updatedAt: Date.now(),
      };
    }));
  };

  const renameVersion = (songId: string, versionId: string, newName: string) => {
    setSongs(prev => applyToSongOrTrack(prev, songId, (song) => {
      const updatedVersions = (song.versions || []).map(v => v.id === versionId ? { ...v, name: newName } : v);
      return {
        ...song,
        versions: updatedVersions,
        updatedAt: Date.now(),
      };
    }));
  };

  const deleteVersion = (songId: string, versionId: string) => {
    setSongs(prev => applyToSongOrTrack(prev, songId, (song) => {
      if (!song.versions || song.versions.length <= 1) return song;

      const remainingVersions = song.versions.filter(v => v.id !== versionId);
      const hasFinal = remainingVersions.some(v => v.isFinal);
      const finalVersions = hasFinal
        ? remainingVersions
        : remainingVersions.map((v, i) => i === 0 ? { ...v, isFinal: true } : v);

      const nextActive = finalVersions.find(v => v.id === song.activeVersionId) || finalVersions[0];

      return {
        ...song,
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
    setSongs(prev => applyToSongOrTrack(prev, songId, (song) => {
      const updatedMemos = [...(song.audioMemos || []), memo];
      return {
        ...song,
        audioMemos: updatedMemos,
        updatedAt: Date.now(),
      };
    }));
  };

  const renameAudioMemo = (songId: string, memoId: string, newName: string) => {
    setSongs(prev => applyToSongOrTrack(prev, songId, (song) => {
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
    setSongs(prev => applyToSongOrTrack(prev, songId, (song) => {
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
    currentParentAlbum,
    activeParentAlbumId,
    setActiveParentAlbumId,
    findSong,
    updateSong,
    createProject,
    createSong,
    deleteSong,
    selectSong,
    addTrackToProject,
    deleteTrackFromProject,
    updateProjectConcept,
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
