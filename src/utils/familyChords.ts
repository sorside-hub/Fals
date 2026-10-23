// Music Theory: Family Chord & Harmonic Palette Generator
export interface FamilyChordItem {
  degree: string;     // e.g. "I", "ii", "iii", "IV", "V", "vi", "vii°"
  name: string;       // e.g. "D", "Em", "F#m", "G", "A", "Bm", "C#dim"
  rootNote: string;   // e.g. "D"
  role: string;       // e.g. "Tonik", "Supertonik", "Median", "Subdominan", "Dominan", "Submedian"
  intervals: number[];// for audio playback: [0, 4, 7] etc.
}

export interface ChordVariationItem {
  name: string;
  type: string;
  intervals: number[];
}

export interface FamilyChordGroup {
  key: string;
  isMinor: boolean;
  tonicName: string;
  familyChords: FamilyChordItem[];
  variations: ChordVariationItem[];
}

// Preset mapping for all 12 Major Keys (Diatonic I - vii°)
const MAJOR_FAMILY_PRESETS: Record<string, { chords: [string, string, string, string, string, string, string], roots: [string, string, string, string, string, string, string] }> = {
  'C':  { chords: ['C', 'Dm', 'Em', 'F', 'G', 'Am', 'Bdim'], roots: ['C', 'D', 'E', 'F', 'G', 'A', 'B'] },
  'G':  { chords: ['G', 'Am', 'Bm', 'C', 'D', 'Em', 'F#dim'], roots: ['G', 'A', 'B', 'C', 'D', 'E', 'F#'] },
  'D':  { chords: ['D', 'Em', 'F#m', 'G', 'A', 'Bm', 'C#dim'], roots: ['D', 'E', 'F#', 'G', 'A', 'B', 'C#'] },
  'A':  { chords: ['A', 'Bm', 'C#m', 'D', 'E', 'F#m', 'G#dim'], roots: ['A', 'B', 'C#', 'D', 'E', 'F#', 'G#'] },
  'E':  { chords: ['E', 'F#m', 'G#m', 'A', 'B', 'C#m', 'D#dim'], roots: ['E', 'F#', 'G#', 'A', 'B', 'C#', 'D#'] },
  'B':  { chords: ['B', 'C#m', 'D#m', 'E', 'F#', 'G#m', 'A#dim'], roots: ['B', 'C#', 'D#', 'E', 'F#', 'G#', 'A#'] },
  'F#': { chords: ['F#', 'G#m', 'A#m', 'B', 'C#', 'D#m', 'E#dim'], roots: ['F#', 'G#', 'A#', 'B', 'C#', 'D#', 'F'] },
  'Gb': { chords: ['Gb', 'Abm', 'Bbm', 'Cb', 'Db', 'Ebm', 'Fdim'], roots: ['Gb', 'Ab', 'Bb', 'B', 'Db', 'Eb', 'F'] },
  'Db': { chords: ['Db', 'Ebm', 'Fm', 'Gb', 'Ab', 'Bbm', 'Cdim'], roots: ['Db', 'Eb', 'F', 'Gb', 'Ab', 'Bb', 'C'] },
  'C#': { chords: ['Db', 'Ebm', 'Fm', 'Gb', 'Ab', 'Bbm', 'Cdim'], roots: ['Db', 'Eb', 'F', 'Gb', 'Ab', 'Bb', 'C'] },
  'Ab': { chords: ['Ab', 'Bbm', 'Cm', 'Db', 'Eb', 'Fm', 'Gdim'], roots: ['Ab', 'Bb', 'C', 'Db', 'Eb', 'F', 'G'] },
  'Eb': { chords: ['Eb', 'Fm', 'Gm', 'Ab', 'Bb', 'Cm', 'Ddim'], roots: ['Eb', 'F', 'G', 'Ab', 'Bb', 'C', 'D'] },
  'Bb': { chords: ['Bb', 'Cm', 'Dm', 'Eb', 'F', 'Gm', 'Adim'], roots: ['Bb', 'C', 'D', 'Eb', 'F', 'G', 'A'] },
  'F':  { chords: ['F', 'Gm', 'Am', 'Bb', 'C', 'Dm', 'Edim'], roots: ['F', 'G', 'A', 'Bb', 'C', 'D', 'E'] },
};

// Preset mapping for all 12 Minor Keys (Natural / Harmonic Diatonic i - VII)
const MINOR_FAMILY_PRESETS: Record<string, { chords: [string, string, string, string, string, string, string], roots: [string, string, string, string, string, string, string] }> = {
  'Am':  { chords: ['Am', 'Bdim', 'C', 'Dm', 'Em', 'F', 'G'], roots: ['A', 'B', 'C', 'D', 'E', 'F', 'G'] },
  'Em':  { chords: ['Em', 'F#dim', 'G', 'Am', 'Bm', 'C', 'D'], roots: ['E', 'F#', 'G', 'A', 'B', 'C', 'D'] },
  'Bm':  { chords: ['Bm', 'C#dim', 'D', 'Em', 'F#m', 'G', 'A'], roots: ['B', 'C#', 'D', 'E', 'F#', 'G', 'A'] },
  'F#m': { chords: ['F#m', 'G#dim', 'A', 'Bm', 'C#m', 'D', 'E'], roots: ['F#', 'G#', 'A', 'B', 'C#', 'D', 'E'] },
  'C#m': { chords: ['C#m', 'D#dim', 'E', 'F#m', 'G#m', 'A', 'B'], roots: ['C#', 'D#', 'E', 'F#', 'G#', 'A', 'B'] },
  'G#m': { chords: ['G#m', 'A#dim', 'B', 'C#m', 'D#m', 'E', 'F#'], roots: ['G#', 'A#', 'B', 'C#', 'D#', 'E', 'F#'] },
  'D#m': { chords: ['D#m', 'E#dim', 'F#', 'G#m', 'A#m', 'B', 'C#'], roots: ['D#', 'F', 'F#', 'G#', 'A#', 'B', 'C#'] },
  'Ebm': { chords: ['Ebm', 'Fdim', 'Gb', 'Abm', 'Bbm', 'B', 'Db'], roots: ['Eb', 'F', 'Gb', 'Ab', 'Bb', 'B', 'Db'] },
  'Bbm': { chords: ['Bbm', 'Cdim', 'Db', 'Ebm', 'Fm', 'Gb', 'Ab'], roots: ['Bb', 'C', 'Db', 'Eb', 'F', 'Gb', 'Ab'] },
  'Fm':  { chords: ['Fm', 'Gdim', 'Ab', 'Bbm', 'Cm', 'Db', 'Eb'], roots: ['F', 'G', 'Ab', 'Bb', 'C', 'Db', 'Eb'] },
  'Cm':  { chords: ['Cm', 'Ddim', 'Eb', 'Fm', 'Gm', 'Ab', 'Bb'], roots: ['C', 'D', 'Eb', 'F', 'G', 'Ab', 'Bb'] },
  'Gm':  { chords: ['Gm', 'Adim', 'Bb', 'Cm', 'Dm', 'Eb', 'F'], roots: ['G', 'A', 'Bb', 'C', 'D', 'Eb', 'F'] },
  'Dm':  { chords: ['Dm', 'Edim', 'F', 'Gm', 'Am', 'Bb', 'C'], roots: ['D', 'E', 'F', 'G', 'A', 'Bb', 'C'] },
};

const MAJOR_ROLES = ['Tonik', 'Supertonik', 'Median', 'Subdominan', 'Dominan', 'Submedian', 'Leading Tone'];
const MAJOR_DEGREES = ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°'];

const MINOR_ROLES = ['Tonik Minor', 'Supertonik', 'Median', 'Subdominan', 'Dominan', 'Submedian', 'Subtonik'];
const MINOR_DEGREES = ['i', 'ii°', 'III', 'iv', 'v', 'VI', 'VII'];

export function getFamilyChordGroups(keyInput: string = 'C'): FamilyChordGroup {
  const cleanKey = (keyInput || 'C').trim();
  const isMinor = cleanKey.endsWith('m') && !cleanKey.endsWith('dim') && !cleanKey.endsWith('maj');

  if (isMinor) {
    const data = MINOR_FAMILY_PRESETS[cleanKey] || MINOR_FAMILY_PRESETS['Am'];
    const familyChords: FamilyChordItem[] = data.chords.map((chordName, i) => {
      const root = data.roots[i];
      const isDim = chordName.endsWith('dim');
      const isMin = chordName.endsWith('m');
      const intervals = isDim ? [0, 3, 6] : isMin ? [0, 3, 7] : [0, 4, 7];
      return {
        degree: MINOR_DEGREES[i],
        name: chordName,
        rootNote: root,
        role: MINOR_ROLES[i],
        intervals,
      };
    });

    const root = cleanKey.replace(/m$/, '');
    // Common extensions for minor keys:
    // Root: m7, m9, sus2, sus4
    // Dominant: V7 (harmonic minor dominant, e.g. E7 in Am)
    // Slash chords: Root/b7, Relative Major
    const variations: ChordVariationItem[] = [
      { name: `${cleanKey}7`, type: 'Minor 7th', intervals: [0, 3, 7, 10] },
      { name: `${cleanKey}9`, type: 'Minor 9th', intervals: [0, 3, 7, 10, 14] },
      { name: `${root}sus2`, type: 'Suspended 2', intervals: [0, 2, 7] },
      { name: `${root}sus4`, type: 'Suspended 4', intervals: [0, 5, 7] },
      // Harmonic major dominant V7 (e.g., E7 for Am)
      { name: `${data.roots[4]}7`, type: 'Dominan V7', intervals: [0, 4, 7, 10] },
      // Major 7th on relative major (e.g. Cmaj7 for Am)
      { name: `${data.chords[2]}maj7`, type: 'Major 7th', intervals: [0, 4, 7, 11] },
      // Subdominant minor 7th (e.g. Dm7 for Am)
      { name: `${data.chords[3]}7`, type: 'Subdominan m7', intervals: [0, 3, 7, 10] },
      // Slash chord (e.g. Am/G)
      { name: `${cleanKey}/${data.roots[6]}`, type: 'Slash Bass', intervals: [0, 3, 7] },
    ];

    return {
      key: cleanKey,
      isMinor: true,
      tonicName: cleanKey,
      familyChords,
      variations,
    };
  } else {
    const data = MAJOR_FAMILY_PRESETS[cleanKey] || MAJOR_FAMILY_PRESETS['C'];
    const familyChords: FamilyChordItem[] = data.chords.map((chordName, i) => {
      const root = data.roots[i];
      const isDim = chordName.endsWith('dim');
      const isMin = chordName.endsWith('m');
      const intervals = isDim ? [0, 3, 6] : isMin ? [0, 3, 7] : [0, 4, 7];
      return {
        degree: MAJOR_DEGREES[i],
        name: chordName,
        rootNote: root,
        role: MAJOR_ROLES[i],
        intervals,
      };
    });

    const root = cleanKey;
    // Common extensions for major keys:
    // Root: maj7, add9, sus2, sus4
    // Dominant: V7 (e.g. G7 in C, A7 in D)
    // Relative minor: vi7 (e.g. Am7 in C, Bm7 in D)
    // Subdominant: IVmaj7 (e.g. Fmaj7 in C, Gmaj7 in D)
    // Slash chords: Root/3rd (D/F#, C/E), V/3rd (A/C#, G/B)
    const variations: ChordVariationItem[] = [
      { name: `${root}maj7`, type: 'Major 7th', intervals: [0, 4, 7, 11] },
      { name: `${root}add9`, type: 'Add 9', intervals: [0, 4, 7, 14] },
      { name: `${root}sus2`, type: 'Suspended 2', intervals: [0, 2, 7] },
      { name: `${root}sus4`, type: 'Suspended 4', intervals: [0, 5, 7] },
      // Dominant V7
      { name: `${data.roots[4]}7`, type: 'Dominan V7', intervals: [0, 4, 7, 10] },
      // Supertonic minor 7th (ii7)
      { name: `${data.chords[1]}7`, type: 'Supertonik ii7', intervals: [0, 3, 7, 10] },
      // Subdominant Major 7th (IVmaj7)
      { name: `${data.chords[3]}maj7`, type: 'Subdominan IVmaj7', intervals: [0, 4, 7, 11] },
      // Relative minor 7th (vi7)
      { name: `${data.chords[5]}7`, type: 'Relatif vi7', intervals: [0, 3, 7, 10] },
      // Slash chord (e.g. D/F# or C/E)
      { name: `${root}/${data.roots[2]}`, type: 'Inversi Bass 1', intervals: [0, 4, 7] },
      // Slash chord V/3rd (e.g. A/C# or G/B)
      { name: `${data.roots[4]}/${data.roots[6]}`, type: 'Inversi Dominan', intervals: [0, 4, 7] },
    ];

    return {
      key: cleanKey,
      isMinor: false,
      tonicName: cleanKey,
      familyChords,
      variations,
    };
  }
}
