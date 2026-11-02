import { CHROMATIC_NOTES, GUITAR_STRINGS } from '../data/constants';
import { getGuitarFretNote } from './musicCalculations';

export interface ChordStringPosition {
  stringNum: number;
  fret: number | 'x';
  note: string | null;
  degree: string | null;
  octave: number | null;
}

export interface BarreInfo {
  fret: number;
  fromString: number; // e.g. 6 (bottom string)
  toString: number;   // e.g. 1 (top string)
}

export interface ChordShapeVoicing {
  id: string;
  name: string;
  category: 'full' | 'triad';
  stringSet?: string;
  frets: (number | 'x')[]; // string 6, 5, 4, 3, 2, 1
  fretRange: [number, number]; // [minFret, maxFret] to display in box
  baseFret: number; // starting fret to display (e.g. 1, 5, 8)
  barreInfo?: BarreInfo;
  positions: ChordStringPosition[]; // strings 6 to 1
  notesSequence: {
    stringNum: number;
    fret: number;
    note: string;
    degree: string;
    octave: number;
  }[];
}

// Helper to get note degree label relative to root
function getDegreeLabel(root: string, note: string, intervals: number[]): string {
  const rootIdx = CHROMATIC_NOTES.indexOf(root);
  const noteIdx = CHROMATIC_NOTES.indexOf(note);
  if (rootIdx === -1 || noteIdx === -1) return '';
  const semitones = (noteIdx - rootIdx + 12) % 12;

  if (semitones === 0) return 'R';
  if (semitones === 3) return 'b3';
  if (semitones === 4) return '3';
  if (semitones === 7) return '5';
  if (semitones === 6) return 'b5';
  if (semitones === 8) return '#5';
  if (semitones === 10) return 'b7';
  if (semitones === 11) return '7';
  if (semitones === 2) return '2';
  if (semitones === 5) return '4';
  if (semitones === 9) return '6';
  return `${semitones}`;
}

// Generate full chord grips using CAGED system (C, A, G, E, D Shapes)
export function getFullChordShapes(
  root: string,
  chordType: string,
  chordNotes: string[],
  intervals: number[]
): ChordShapeVoicing[] {
  const rootPitch = CHROMATIC_NOTES.indexOf(root);
  if (rootPitch === -1) return [];

  const isMinor = chordType.includes('minor') || (chordType.includes('m') && !chordType.includes('maj'));
  const is7 = chordType === 'dom7' || chordType === '7';
  const isM7 = chordType === 'maj7';
  const isMin7 = chordType === 'm7' || chordType === 'min7';

  const shapes: ChordShapeVoicing[] = [];

  const buildVoicing = (
    id: string,
    name: string,
    fretList: (number | 'x')[]
  ): ChordShapeVoicing => {
    // fretList is in order string 6, 5, 4, 3, 2, 1
    const numericFrets = fretList.filter((f): f is number => typeof f === 'number' && f > 0);
    const minF = numericFrets.length > 0 ? Math.min(...numericFrets) : 0;
    const maxF = numericFrets.length > 0 ? Math.max(...numericFrets) : 3;

    // Base fret to display: if any string is open (0) or lowest fret is <= 3, always start at fret 1
    const hasOpenString = fretList.includes(0);
    const baseFret = (hasOpenString || minF <= 3) ? 1 : minF;
    const endFret = Math.max(baseFret + 3, maxF);

    // Auto-detect Barre info (if any positive fret spans across 2+ strings)
    let barreInfo: BarreInfo | undefined = undefined;
    if (minF > 0) {
      const stringsOnMinF: number[] = [];
      [6, 5, 4, 3, 2, 1].forEach((strNum, idx) => {
        if (fretList[idx] === minF) {
          stringsOnMinF.push(strNum);
        }
      });
      if (stringsOnMinF.length >= 2) {
        const maxStr = Math.max(...stringsOnMinF);
        const minStr = Math.min(...stringsOnMinF);
        if (maxStr - minStr >= 1) {
          barreInfo = {
            fret: minF,
            fromString: maxStr,
            toString: minStr,
          };
        }
      }
    }

    const positions: ChordStringPosition[] = [];
    const notesSeq: ChordShapeVoicing['notesSequence'] = [];

    // String numbers: 6 down to 1
    [6, 5, 4, 3, 2, 1].forEach((strNum, idx) => {
      const fret = fretList[idx];
      const gString = GUITAR_STRINGS.find((s) => s.stringNumber === strNum)!;

      if (fret === 'x') {
        positions.push({
          stringNum: strNum,
          fret: 'x',
          note: null,
          degree: null,
          octave: null,
        });
      } else {
        const { note, octaveDiff } = getGuitarFretNote(gString.openNote, fret);
        const octave = gString.openOctave + octaveDiff;
        const degree = getDegreeLabel(root, note, intervals);

        positions.push({
          stringNum: strNum,
          fret,
          note,
          degree,
          octave,
        });

        notesSeq.push({
          stringNum: strNum,
          fret,
          note,
          degree,
          octave,
        });
      }
    });

    return {
      id,
      name,
      category: 'full',
      frets: fretList,
      fretRange: [baseFret, endFret],
      baseFret,
      barreInfo,
      positions,
      notesSequence: notesSeq,
    };
  };

  // Common Open Shapes override dictionary
  const OPEN_CHORDS: Record<string, (number | 'x')[]> = {
    'C': ['x', 3, 2, 0, 1, 0],
    'A': ['x', 0, 2, 2, 2, 0],
    'G': [3, 2, 0, 0, 0, 3],
    'E': [0, 2, 2, 1, 0, 0],
    'D': ['x', 'x', 0, 2, 3, 2],
    'Am': ['x', 0, 2, 2, 1, 0],
    'Em': [0, 2, 2, 0, 0, 0],
    'Dm': ['x', 'x', 0, 2, 3, 1],
    'F': [1, 3, 3, 2, 1, 1],
    'C7': ['x', 3, 2, 3, 1, 0],
    'A7': ['x', 0, 2, 0, 2, 0],
    'E7': [0, 2, 0, 1, 0, 0],
    'D7': ['x', 'x', 0, 2, 1, 2],
    'G7': [3, 2, 0, 0, 0, 1],
    'B7': ['x', 2, 1, 2, 0, 2],
    'Am7': ['x', 0, 2, 0, 1, 0],
    'Em7': [0, 2, 0, 0, 0, 0],
    'Dm7': ['x', 'x', 0, 2, 1, 1],
    'Cmaj7': ['x', 3, 2, 0, 0, 0],
    'Amaj7': ['x', 0, 2, 1, 2, 0],
    'Gmaj7': [3, 2, 0, 0, 0, 2],
    'Emaj7': [0, 2, 1, 1, 0, 0],
    'Dmaj7': ['x', 'x', 0, 2, 2, 2],
    'Fmaj7': ['x', 3, 3, 2, 1, 0],
  };

  let suffix = '';
  if (isM7) suffix = 'maj7';
  else if (isMin7) suffix = 'm7';
  else if (is7) suffix = '7';
  else if (isMinor) suffix = 'm';

  const chordKey = `${root}${suffix}`;
  const openFretPattern = OPEN_CHORDS[chordKey];

  if (openFretPattern) {
    shapes.push(buildVoicing('open', 'Posisi Open', openFretPattern));
  }

  // 1. E Shape (Root on String 6)
  const eFret = (rootPitch - CHROMATIC_NOTES.indexOf('E') + 12) % 12;
  let s6Frets: (number | 'x')[] = [];
  if (isMinor) {
    s6Frets = [eFret, eFret + 2, eFret + 2, eFret, eFret, eFret];
  } else if (is7) {
    s6Frets = [eFret, eFret + 2, eFret, eFret + 1, eFret, eFret];
  } else if (isMin7) {
    s6Frets = [eFret, eFret + 2, eFret, eFret, eFret, eFret];
  } else if (isM7) {
    s6Frets = [eFret, 'x', eFret + 1, eFret + 1, eFret, 'x'];
  } else {
    s6Frets = [eFret, eFret + 2, eFret + 2, eFret + 1, eFret, eFret];
  }
  shapes.push(
    buildVoicing(
      'shape-e',
      eFret === 0 ? 'E-Shape (Open)' : `E-Shape (Fret ${eFret})`,
      s6Frets
    )
  );

  // 2. A Shape (Root on String 5)
  const aFret = (rootPitch - CHROMATIC_NOTES.indexOf('A') + 12) % 12;
  let s5Frets: (number | 'x')[] = [];
  if (isMinor) {
    s5Frets = ['x', aFret, aFret + 2, aFret + 2, aFret + 1, aFret];
  } else if (is7) {
    s5Frets = ['x', aFret, aFret + 2, aFret, aFret + 2, aFret];
  } else if (isMin7) {
    s5Frets = ['x', aFret, aFret + 2, aFret, aFret + 1, aFret];
  } else if (isM7) {
    s5Frets = ['x', aFret, aFret + 2, aFret + 1, aFret + 2, aFret];
  } else {
    s5Frets = ['x', aFret, aFret + 2, aFret + 2, aFret + 2, aFret];
  }
  shapes.push(
    buildVoicing(
      'shape-a',
      aFret === 0 ? 'A-Shape (Open)' : `A-Shape (Fret ${aFret})`,
      s5Frets
    )
  );

  // 3. C Shape (Root on String 5)
  const cBarre = (rootPitch - CHROMATIC_NOTES.indexOf('C') + 12) % 12;
  if (cBarre > 0 || isM7) {
    let cFrets: (number | 'x')[] = [];
    if (isMinor) {
      cFrets = ['x', cBarre + 3, cBarre + 1, cBarre, cBarre + 1, cBarre];
    } else if (isM7) {
      cFrets = ['x', cBarre + 3, cBarre + 2, cBarre, cBarre, cBarre];
    } else {
      cFrets = ['x', cBarre + 3, cBarre + 2, cBarre, cBarre + 1, cBarre];
    }
    shapes.push(
      buildVoicing('shape-c', cBarre === 0 ? 'C-Shape (Open)' : `C-Shape (Fret ${cBarre})`, cFrets)
    );
  }

  // 4. D Shape (Root on String 4)
  const dFret = (rootPitch - CHROMATIC_NOTES.indexOf('D') + 12) % 12;
  let dFrets: (number | 'x')[] = [];
  if (isMinor) {
    dFrets = ['x', 'x', dFret, dFret + 2, dFret + 3, dFret + 1];
  } else if (is7) {
    dFrets = ['x', 'x', dFret, dFret + 2, dFret + 1, dFret + 2];
  } else if (isM7) {
    dFrets = ['x', 'x', dFret, dFret + 2, dFret + 2, dFret + 2];
  } else {
    dFrets = ['x', 'x', dFret, dFret + 2, dFret + 3, dFret + 2];
  }
  shapes.push(
    buildVoicing('shape-d', `D-Shape (Fret ${dFret || 12})`, dFrets)
  );

  // Filter unique shapes (by frets pattern string representation) and sort by base fret
  const uniqueMap = new Map<string, ChordShapeVoicing>();
  shapes.forEach((s) => {
    const key = s.frets.join(',');
    if (!uniqueMap.has(key)) {
      uniqueMap.set(key, s);
    }
  });

  const uniqueShapes = Array.from(uniqueMap.values()).sort(
    (a, b) => a.baseFret - b.baseFret
  );

  return uniqueShapes;
}

// Generate 3-Note Triads & Arpeggios across contiguous 3-string groups
export function getTriadVoicings(
  root: string,
  chordNotes: string[],
  intervals: number[]
): ChordShapeVoicing[] {
  // We search the 3 primary triad string groups:
  // 1. Strings 1-2-3 (Treble / Solos / Melodic fills)
  // 2. Strings 2-3-4 (Mid / Acoustic fingerpicking)
  // 3. Strings 3-4-5 (Warm / Rhythm)

  const stringGroups: { label: string; strings: [number, number, number] }[] = [
    { label: 'Senar 1-2-3', strings: [3, 2, 1] },
    { label: 'Senar 2-3-4', strings: [4, 3, 2] },
    { label: 'Senar 3-4-5', strings: [5, 4, 3] },
  ];

  // We want pure 3 chord notes (Root, 3rd, 5th)
  const targetNotes = chordNotes.slice(0, 3).map((n) => n.toUpperCase());
  if (targetNotes.length < 3) return [];

  const voicings: ChordShapeVoicing[] = [];

  stringGroups.forEach((grp, grpIdx) => {
    const [sLow, sMid, sHigh] = grp.strings;
    const gLow = GUITAR_STRINGS.find((s) => s.stringNumber === sLow)!;
    const gMid = GUITAR_STRINGS.find((s) => s.stringNumber === sMid)!;
    const gHigh = GUITAR_STRINGS.find((s) => s.stringNumber === sHigh)!;

    // Search frets 0 to 14
    for (let fLow = 0; fLow <= 13; fLow++) {
      const noteLow = getGuitarFretNote(gLow.openNote, fLow).note.toUpperCase();
      if (!targetNotes.includes(noteLow)) continue;

      // Search matching fret on mid string within 3 frets
      for (let fMid = Math.max(0, fLow - 2); fMid <= Math.min(14, fLow + 3); fMid++) {
        const noteMid = getGuitarFretNote(gMid.openNote, fMid).note.toUpperCase();
        if (!targetNotes.includes(noteMid) || noteMid === noteLow) continue;

        // Search matching fret on high string
        for (let fHigh = Math.max(0, Math.min(fLow, fMid) - 2); fHigh <= Math.min(14, Math.max(fLow, fMid) + 3); fHigh++) {
          const noteHigh = getGuitarFretNote(gHigh.openNote, fHigh).note.toUpperCase();
          if (!targetNotes.includes(noteHigh) || noteHigh === noteLow || noteHigh === noteMid) continue;

          // Found a 3-note triad!
          const allF = [fLow, fMid, fHigh];
          const span = Math.max(...allF) - Math.min(...allF);
          if (span > 3) continue; // Must be easily reachable with fingers

          const hasOpen = allF.includes(0);
          const minF = Math.min(...allF);
          const maxF = Math.max(...allF);
          const baseFret = (hasOpen || minF <= 3) ? 1 : minF;
          const endFret = Math.max(baseFret + 3, maxF);

          // Build full 6-string frets representation (6 down to 1)
          const fretList: (number | 'x')[] = ['x', 'x', 'x', 'x', 'x', 'x'];
          // Map to correct string index in [6, 5, 4, 3, 2, 1]:
          // str 6 = 0, str 5 = 1, str 4 = 2, str 3 = 3, str 2 = 4, str 1 = 5
          fretList[6 - sLow] = fLow;
          fretList[6 - sMid] = fMid;
          fretList[6 - sHigh] = fHigh;

          // Get positions and notes in ascending order of string pitch
          const positions: ChordStringPosition[] = [];
          const notesSeq: ChordShapeVoicing['notesSequence'] = [];

          [6, 5, 4, 3, 2, 1].forEach((strNum, idx) => {
            const fret = fretList[idx];
            const gString = GUITAR_STRINGS.find((s) => s.stringNumber === strNum)!;

            if (fret === 'x') {
              positions.push({
                stringNum: strNum,
                fret: 'x',
                note: null,
                degree: null,
                octave: null,
              });
            } else {
              const { note, octaveDiff } = getGuitarFretNote(gString.openNote, fret);
              const octave = gString.openOctave + octaveDiff;
              const degree = getDegreeLabel(root, note, intervals);

              positions.push({
                stringNum: strNum,
                fret,
                note,
                degree,
                octave,
              });

              notesSeq.push({
                stringNum: strNum,
                fret,
                note,
                degree,
                octave,
              });
            }
          });

          // Sort notesSequence from lowest string to highest string (str 5 -> 4 -> 3 -> 2 -> 1)
          notesSeq.sort((a, b) => b.stringNum - a.stringNum);

          const positionLabel =
            minF <= 2
              ? 'Posisi Rendah'
              : minF <= 6
              ? `Fret ${minF}-${maxF}`
              : `Fret ${minF}-${maxF} (Tinggi)`;

          const id = `triad-${grpIdx}-${minF}-${sLow}-${sHigh}`;

          voicings.push({
            id,
            name: `${grp.label} • ${positionLabel}`,
            category: 'triad',
            stringSet: grp.label,
            frets: fretList,
            fretRange: [baseFret, endFret],
            baseFret,
            positions,
            notesSequence: notesSeq,
          });
        }
      }
    }
  });

  // Limit to most useful distinct voicings across low, mid, high registers
  const uniqueVoicings: ChordShapeVoicing[] = [];
  const seenFretCombo = new Set<string>();

  voicings.forEach((v) => {
    const key = `${v.stringSet}-${v.frets.join('-')}`;
    if (!seenFretCombo.has(key)) {
      seenFretCombo.add(key);
      uniqueVoicings.push(v);
    }
  });

  return uniqueVoicings.slice(0, 8);
}
