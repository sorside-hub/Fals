import { CHROMATIC_NOTES } from '../utils/musicTheory';

export interface DiatonicChord {
  degreeRoman: string;
  degreeNumber: number;
  role: 'Tonic' | 'Subdominant' | 'Dominant';
  name: string; // e.g. "C", "Dm"
  symbol: string; // e.g. "C", "Dm", "Em", "F", "G", "Am", "Bdim"
  chordType: 'major' | 'minor' | 'diminished' | 'maj7' | 'min7' | 'dom7' | 'm7b5';
  root: string;
  intervals: number[];
  notes: string[];
  seventhSymbol: string; // e.g. "Cmaj7", "Dm7"
  seventhIntervals: number[];
  variationSymbol: string; // e.g. "Cadd9", "Dsus2"
  variationIntervals: number[];
  functionDescription: string;
}

export interface ScalePattern {
  id: string;
  name: string;
  category: 'all' | '3nps' | 'caged' | 'pentatonic';
  categoryLabel: string;
  description: string;
  startDegree: number;
  relativeFretOffset: number; // offset relative to Root fret on 6th string
  fretSpan: number; // how many frets wide (e.g. 4 or 5 frets)
  tips: string;
}

export interface ScaleProgression {
  id: string;
  title: string;
  roman: string;
  genreMood: string;
  description: string;
  degrees: number[]; // e.g. [1, 5, 6, 4] for I - V - vi - IV
}

// Major Scale Formulas: Root + [2, 4, 5, 7, 9, 11] semitones
const MAJOR_INTERVALS = [0, 2, 4, 5, 7, 9, 11];

// Degree formulas
const DEGREE_DATA = [
  { roman: 'I', role: 'Tonic' as const, type: 'major' as const, triadInt: [0, 4, 7], sevSym: 'maj7', sevInt: [0, 4, 7, 11], varSym: 'add9', varInt: [0, 4, 7, 14], desc: 'Pusat harmoni, stabil, tuntas, cerah' },
  { roman: 'ii', role: 'Subdominant' as const, type: 'minor' as const, triadInt: [0, 3, 7], sevSym: 'm7', sevInt: [0, 3, 7, 10], varSym: 'sus2', varInt: [0, 2, 7], desc: 'Jembatan transisi lembut menuju Dominan (V)' },
  { roman: 'iii', role: 'Tonic' as const, type: 'minor' as const, triadInt: [0, 3, 7], sevSym: 'm7', sevInt: [0, 3, 7, 10], varSym: 'm7', varInt: [0, 3, 7, 10], desc: 'Nuansa hangat, emosional, pengganti alternatif I' },
  { roman: 'IV', role: 'Subdominant' as const, type: 'major' as const, triadInt: [0, 4, 7], sevSym: 'maj7', sevInt: [0, 4, 7, 11], varSym: 'sus4', varInt: [0, 5, 7], desc: 'Mengangkat suasana, membuka ruang gerak melodi' },
  { roman: 'V', role: 'Dominant' as const, type: 'major' as const, triadInt: [0, 4, 7], sevSym: '7', sevInt: [0, 4, 7, 10], varSym: '7sus4', varInt: [0, 5, 7, 10], desc: 'Tensi klimaks yang mendesak untuk pulang ke Tonic (I)' },
  { roman: 'vi', role: 'Tonic' as const, type: 'minor' as const, triadInt: [0, 3, 7], sevSym: 'm7', sevInt: [0, 3, 7, 10], varSym: 'm(add9)', varInt: [0, 3, 7, 14], desc: 'Relatif minor, melankolis, emosional, pembuka pop hits' },
  { roman: 'vii°', role: 'Dominant' as const, type: 'diminished' as const, triadInt: [0, 3, 6], sevSym: 'm7b5', sevInt: [0, 3, 6, 10], varSym: 'dim', varInt: [0, 3, 6], desc: 'Disonan tajam, tensi maksimal yang memimpin ke I' },
];

export function getDiatonicChords(rootNote: string): DiatonicChord[] {
  const rootIndex = CHROMATIC_NOTES.indexOf(rootNote);
  if (rootIndex === -1) return [];

  return DEGREE_DATA.map((deg, i) => {
    const semitone = MAJOR_INTERVALS[i];
    const chordRoot = CHROMATIC_NOTES[(rootIndex + semitone) % 12];

    const triadSuffix = deg.type === 'minor' ? 'm' : deg.type === 'diminished' ? 'dim' : '';
    const symbol = `${chordRoot}${triadSuffix}`;
    const seventhSymbol = `${chordRoot}${deg.sevSym}`;
    const variationSymbol = `${chordRoot}${deg.varSym}`;

    const notes = deg.triadInt.map(interval => {
      const noteIdx = (CHROMATIC_NOTES.indexOf(chordRoot) + interval) % 12;
      return CHROMATIC_NOTES[noteIdx];
    });

    return {
      degreeRoman: deg.roman,
      degreeNumber: i + 1,
      role: deg.role,
      name: symbol,
      symbol,
      chordType: deg.type,
      root: chordRoot,
      intervals: deg.triadInt,
      notes,
      seventhSymbol,
      seventhIntervals: deg.sevInt,
      variationSymbol,
      variationIntervals: deg.varInt,
      functionDescription: deg.desc,
    };
  });
}

// 7 Pola 3-Note Per String (3NPS)
export const THREE_NOTE_PER_STRING_PATTERNS: ScalePattern[] = [
  {
    id: '3nps-1',
    name: 'Pola 1 - Ionian (Root Senar 6)',
    category: '3nps',
    categoryLabel: '3-Note Per String',
    description: 'Dimulai dari nada Root (derajat 1) pada senar 6. Pola dasar paling penting untuk soloing cepat.',
    startDegree: 1,
    relativeFretOffset: 0,
    fretSpan: 4,
    tips: 'Jari 1-2-4 pada senar 6 & 5, lalu 1-2-4 pada senar 4 & 3, lalu 1-3-4 pada senar 2 & 1.',
  },
  {
    id: '3nps-2',
    name: 'Pola 2 - Dorian Shape',
    category: '3nps',
    categoryLabel: '3-Note Per String',
    description: 'Dimulai dari nada ke-2 skala. Memiliki rentang legato yang sangat halus untuk lick rock & jazz.',
    startDegree: 2,
    relativeFretOffset: 2,
    fretSpan: 4,
    tips: 'Gunakan metronom bertahap dari 70 BPM. Fokus pada kejernihan tiap nada.',
  },
  {
    id: '3nps-3',
    name: 'Pola 3 - Phrygian Shape',
    category: '3nps',
    categoryLabel: '3-Note Per String',
    description: 'Dimulai dari nada ke-3 skala. Memiliki jarak semitone rapat di senar 6.',
    startDegree: 3,
    relativeFretOffset: 4,
    fretSpan: 4,
    tips: 'Sangat cocok untuk transisi arpeggio cepat dari senar bawah ke atas.',
  },
  {
    id: '3nps-4',
    name: 'Pola 4 - Lydian Shape',
    category: '3nps',
    categoryLabel: '3-Note Per String',
    description: 'Dimulai dari nada ke-4 skala. Pola simetris yang mudah dihafal di bagian tengah fretboard.',
    startDegree: 4,
    relativeFretOffset: 5,
    fretSpan: 4,
    tips: 'Pola favorit gitaris virtuoso (Steve Vai, Joe Satriani) untuk sweep & legato.',
  },
  {
    id: '3nps-5',
    name: 'Pola 5 - Mixolydian Shape',
    category: '3nps',
    categoryLabel: '3-Note Per String',
    description: 'Dimulai dari nada ke-5 (Dominan). Memberikan rasa bluesy mayor yang cerah.',
    startDegree: 5,
    relativeFretOffset: 7,
    fretSpan: 4,
    tips: 'Bagus untuk soloing di atas akor Dominan V7 sebelum kembali pulang ke I.',
  },
  {
    id: '3nps-6',
    name: 'Pola 6 - Aeolian Shape',
    category: '3nps',
    categoryLabel: '3-Note Per String',
    description: 'Dimulai dari nada ke-6 (relatif minor). Posisi alami untuk feel melodi ballad & emosional.',
    startDegree: 6,
    relativeFretOffset: 9,
    fretSpan: 4,
    tips: 'Pola kunci yang menghubungkan mayor cerah dengan minor sendu.',
  },
  {
    id: '3nps-7',
    name: 'Pola 7 - Locrian Shape',
    category: '3nps',
    categoryLabel: '3-Note Per String',
    description: 'Dimulai dari nada ke-7. Menutup siklus oktaf tepat 1 fret sebelum kembali ke Pola 1.',
    startDegree: 7,
    relativeFretOffset: 11,
    fretSpan: 4,
    tips: 'Perhatikan nada ke-7 (Leading Tone) yang memiliki daya tarik magnetis kuat kembali ke Root.',
  },
];

// 5 Pola Box / CAGED
export const CAGED_BOX_PATTERNS: ScalePattern[] = [
  {
    id: 'caged-pos1',
    name: 'Box 1 (E-Shape / Posisi Root Senar 6)',
    category: 'caged',
    categoryLabel: 'CAGED Box',
    description: 'Pola kotak standar paling sering digunakan. Root berada di senar 6 dan senar 1.',
    startDegree: 1,
    relativeFretOffset: 0,
    fretSpan: 4,
    tips: 'Hafalkan titik root note di senar 6, 4, dan 1 sebagai penunjuk arah.',
  },
  {
    id: 'caged-pos2',
    name: 'Box 2 (D-Shape)',
    category: 'caged',
    categoryLabel: 'CAGED Box',
    description: 'Menyambung langsung di sebelah kanan Box 1. Root berada di senar 4 dan senar 2.',
    startDegree: 2,
    relativeFretOffset: 2,
    fretSpan: 4,
    tips: 'Ideal untuk melodi manis di senar 1, 2, dan 3.',
  },
  {
    id: 'caged-pos3',
    name: 'Box 3 (C-Shape / Posisi Root Senar 5)',
    category: 'caged',
    categoryLabel: 'CAGED Box',
    description: 'Root berada di senar 5 dan senar 2. Pola favorit untuk lick gitar pop akustik.',
    startDegree: 4,
    relativeFretOffset: 5,
    fretSpan: 4,
    tips: 'Sangat mudah dipadukan dengan triad C mayor standar.',
  },
  {
    id: 'caged-pos4',
    name: 'Box 4 (A-Shape)',
    category: 'caged',
    categoryLabel: 'CAGED Box',
    description: 'Root berada di senar 5 dan senar 3. Nyaman untuk bending senar 3.',
    startDegree: 5,
    relativeFretOffset: 7,
    fretSpan: 4,
    tips: 'Sering digunakan untuk solo rock klasik dan country.',
  },
  {
    id: 'caged-pos5',
    name: 'Box 5 (G-Shape)',
    category: 'caged',
    categoryLabel: 'CAGED Box',
    description: 'Root berada di senar 6 dan senar 3. Menyambung kembali ke Box 1 di oktaf atas.',
    startDegree: 6,
    relativeFretOffset: 9,
    fretSpan: 4,
    tips: 'Latih pergeseran posisi telunjuk saat berpindah ke senar 2.',
  },
];

// 5 Pola Pentatonik Mayor
export const PENTATONIC_BOX_PATTERNS: ScalePattern[] = [
  {
    id: 'penta-pos1',
    name: 'Pentatonik Box 1 (Mayor)',
    category: 'pentatonic',
    categoryLabel: 'Pentatonik Mayor',
    description: '5 nada tanpa nada fals (1 - 2 - 3 - 5 - 6). Bersih, manis, dan anti-bentrok.',
    startDegree: 1,
    relativeFretOffset: 0,
    fretSpan: 4,
    tips: 'Nada 4 dan 7 dihilangkan sehingga tidak ada semitone tajam.',
  },
  {
    id: 'penta-pos2',
    name: 'Pentatonik Box 2',
    category: 'pentatonic',
    categoryLabel: 'Pentatonik Mayor',
    description: 'Lick melodi vokal yang sangat catchy dan bernyanyi.',
    startDegree: 2,
    relativeFretOffset: 2,
    fretSpan: 4,
    tips: 'Bagus untuk soloing ballad dan lagu santai.',
  },
  {
    id: 'penta-pos3',
    name: 'Pentatonik Box 3',
    category: 'pentatonic',
    categoryLabel: 'Pentatonik Mayor',
    description: 'Posisi tengah fretboard dengan artikulasi slide yang mudah.',
    startDegree: 3,
    relativeFretOffset: 4,
    fretSpan: 4,
    tips: 'Gunakan teknik hammer-on dan pull-off.',
  },
  {
    id: 'penta-pos4',
    name: 'Pentatonik Box 4',
    category: 'pentatonic',
    categoryLabel: 'Pentatonik Mayor',
    description: 'Pola yang identik dengan Box 1 Pentatonik Minor di relatif minor.',
    startDegree: 5,
    relativeFretOffset: 7,
    fretSpan: 4,
    tips: 'Pola paling familiar bagi gitaris rock/blues.',
  },
  {
    id: 'penta-pos5',
    name: 'Pentatonik Box 5',
    category: 'pentatonic',
    categoryLabel: 'Pentatonik Mayor',
    description: 'Menutup rantai 5 posisi sebelum kembali ke Box 1 di fret atas.',
    startDegree: 6,
    relativeFretOffset: 9,
    fretSpan: 4,
    tips: 'Transisi sempurna untuk solo naik oktaf.',
  },
];

// Progresi Akor Populer di Skala Mayor
export const POPULAR_MAJOR_PROGRESSIONS: ScaleProgression[] = [
  {
    id: 'prog-pop-anthem',
    title: 'Pop Anthem / Radio Hit',
    roman: 'I - V - vi - IV',
    genreMood: 'Cerah, megah, epik, mudah diingat',
    description: 'Progresi terpopuler di dunia musik modern. Digunakan di ribuan lagu hit dunia (Let It Be, Someone Like You, Don\'t Stop Believin\').',
    degrees: [1, 5, 6, 4],
  },
  {
    id: 'prog-ballad-doowop',
    title: 'Classic Ballad / Doo-Wop',
    roman: 'I - vi - IV - V',
    genreMood: 'Nostalgia, manis, romantis, hangat',
    description: 'Fondasi lagu cinta retro hingga pop ballad modern (Stand By Me, Perfect - Ed Sheeran, D’Masiv).',
    degrees: [1, 6, 4, 5],
  },
  {
    id: 'prog-melancholic',
    title: 'Melankolis Emosional',
    roman: 'vi - IV - I - V',
    genreMood: 'Sendu, haru, dramatis, introspektif',
    description: 'Dimulai dari relatif minor sehingga memberikan rasa haru mendalam sebelum terbit ke mayor (Faded - Alan Walker, Numb).',
    degrees: [6, 4, 1, 5],
  },
  {
    id: 'prog-storytelling',
    title: 'Storytelling / Perjalanan',
    roman: 'I - IV - vi - V',
    genreMood: 'Mengalir, naratif, puitis, bertumbuh',
    description: 'Sangat cocok untuk bait lirik (verse) yang menceritakan perjalanan atau transisi rasa.',
    degrees: [1, 4, 6, 5],
  },
  {
    id: 'prog-jazz-turnaround',
    title: 'Jazz & Neo-Soul Turnaround',
    roman: 'ii - V - I',
    genreMood: 'Elegan, berkelas, groovy, dinamis',
    description: 'Rumus emas harmoni jazz dan R&B modern. Memberikan resolusi akor yang sangat memuaskan telinga.',
    degrees: [2, 5, 1],
  },
  {
    id: 'prog-acoustic-warm',
    title: 'Akustik Hangat Senja',
    roman: 'I - iii - IV - V',
    genreMood: 'Hangat, teduh, damai, tenang',
    description: 'Menyisipkan akor iii minor yang lembut sebelum melangkah ke IV dan V. Sangat pas untuk petikan gitar folk akustik.',
    degrees: [1, 3, 4, 5],
  },
];

// Open string pitches (C=0, C#=1, D=2, D#=3, E=4, F=5, F#=6, G=7, G#=8, A=9, A#=10, B=11)
const OPEN_STRING_PITCHES: Record<number, number> = {
  6: 4,  // E
  5: 9,  // A
  4: 2,  // D
  3: 7,  // G
  2: 11, // B
  1: 4,  // E
};

export interface PatternPosition {
  stringNum: number;
  fret: number;
  note: string;
  degree: number;
}

const CAGED_DEGREES: Record<number, Record<number, number[]>> = {
  0: { // Box 1 (E-shape)
    6: [0, 1],
    5: [2, 3, 4],
    4: [5, 6, 0],
    3: [1, 2, 3],
    2: [4, 5],
    1: [6, 0, 1],
  },
  1: { // Box 2 (D-shape)
    6: [1, 2],
    5: [4, 5],
    4: [6, 0, 1],
    3: [2, 3, 4],
    2: [5, 6, 0],
    1: [1, 2],
  },
  2: { // Box 3 (C-shape)
    6: [2, 3, 4],
    5: [5, 6, 0],
    4: [1, 2, 3],
    3: [4, 5],
    2: [6, 0, 1],
    1: [2, 3, 4],
  },
  3: { // Box 4 (A-shape)
    6: [4, 5],
    5: [6, 0, 1],
    4: [2, 3, 4],
    3: [5, 6, 0],
    2: [1, 2, 3],
    1: [4, 5],
  },
  4: { // Box 5 (G-shape)
    6: [5, 6, 0],
    5: [1, 2],
    4: [4, 5],
    3: [6, 0, 1],
    2: [2, 3, 4],
    1: [5, 6, 0],
  },
};

const PENTA_DEGREES: Record<number, Record<number, number[]>> = {
  0: { // Box 1
    6: [0, 1],
    5: [2, 4],
    4: [5, 0],
    3: [1, 2],
    2: [4, 5],
    1: [0, 1],
  },
  1: { // Box 2
    6: [1, 2],
    5: [4, 5],
    4: [0, 1],
    3: [2, 4],
    2: [5, 0],
    1: [1, 2],
  },
  2: { // Box 3
    6: [2, 4],
    5: [5, 0],
    4: [1, 2],
    3: [4, 5],
    2: [0, 1],
    1: [2, 4],
  },
  3: { // Box 4
    6: [4, 5],
    5: [0, 1],
    4: [2, 4],
    3: [5, 0],
    2: [1, 2],
    1: [4, 5],
  },
  4: { // Box 5
    6: [5, 0],
    5: [1, 2],
    4: [4, 5],
    3: [0, 1],
    2: [2, 4],
    1: [5, 0],
  },
};

export function getPatternExplicitPositions(
  category: '3nps' | 'caged' | 'pentatonic',
  patternIndex: number,
  rootNote: string,
  maxFret: number = 15
): PatternPosition[] {
  const rootPitch = CHROMATIC_NOTES.indexOf(rootNote);
  if (rootPitch === -1) return [];

  // Diatonic major degree intervals: 0, 2, 4, 5, 7, 9, 11
  const majorIntervals = [0, 2, 4, 5, 7, 9, 11];

  let stringDegrees: Record<number, number[]>;

  if (category === '3nps') {
    const p = patternIndex % 7;
    stringDegrees = {
      6: [p % 7, (p + 1) % 7, (p + 2) % 7],
      5: [(p + 3) % 7, (p + 4) % 7, (p + 5) % 7],
      4: [(p + 6) % 7, (p + 7) % 7, (p + 8) % 7],
      3: [(p + 2) % 7, (p + 3) % 7, (p + 4) % 7],
      2: [(p + 5) % 7, (p + 6) % 7, (p + 7) % 7],
      1: [(p + 1) % 7, (p + 2) % 7, (p + 3) % 7],
    };
  } else if (category === 'caged') {
    stringDegrees = CAGED_DEGREES[patternIndex % 5] || CAGED_DEGREES[0];
  } else {
    stringDegrees = PENTA_DEGREES[patternIndex % 5] || PENTA_DEGREES[0];
  }

  // Find base anchor on string 6
  const firstDeg6 = stringDegrees[6][0];
  const firstPitch6 = (rootPitch + majorIntervals[firstDeg6]) % 12;
  let anchorFret = (firstPitch6 - OPEN_STRING_PITCHES[6] + 12) % 12;

  let rawPositions: PatternPosition[] = [];
  let prevStartFret = anchorFret;

  const stringOrder = [6, 5, 4, 3, 2, 1];
  for (const sNum of stringOrder) {
    const degrees = stringDegrees[sNum];
    const openPitch = OPEN_STRING_PITCHES[sNum];

    // Find the fret for degrees[0] closest to prevStartFret
    const firstDeg = degrees[0];
    const firstPitch = (rootPitch + majorIntervals[firstDeg]) % 12;
    let baseFret = (firstPitch - openPitch + 12) % 12;

    while (baseFret - prevStartFret > 4) {
      baseFret -= 12;
    }
    while (prevStartFret - baseFret > 4) {
      baseFret += 12;
    }

    prevStartFret = baseFret;

    let currFret = baseFret;
    for (let i = 0; i < degrees.length; i++) {
      const d = degrees[i];
      if (i > 0) {
        const prevD = degrees[i - 1];
        const step = (majorIntervals[d] - majorIntervals[prevD] + 12) % 12;
        currFret += step;
      }
      const notePitch = (openPitch + currFret) % 12;
      rawPositions.push({
        stringNum: sNum,
        fret: currFret,
        note: CHROMATIC_NOTES[(notePitch + 12) % 12],
        degree: d + 1,
      });
    }
  }

  // Adjust octaves if pattern is out of bounds
  let maxPosFret = Math.max(...rawPositions.map((p) => p.fret));
  let minPosFret = Math.min(...rawPositions.map((p) => p.fret));

  while (maxPosFret > maxFret && minPosFret - 12 >= 0) {
    rawPositions = rawPositions.map((p) => ({ ...p, fret: p.fret - 12 }));
    maxPosFret -= 12;
    minPosFret -= 12;
  }

  while (minPosFret < 0) {
    rawPositions = rawPositions.map((p) => ({ ...p, fret: p.fret + 12 }));
    maxPosFret += 12;
    minPosFret += 12;
  }

  return rawPositions;
}
