import { TheoryTheme } from '../../types';

export const theme3Akor: TheoryTheme = {
  id: 'akor',
  themeNumber: '03',
  title: 'Anatomi Akor & Harmoni',
  tagline: 'Formula triad, 7th chords, sus, add9, dan kamus akor pop berkelas',
  readTime: '6 menit baca',
  preview: {
    analogy: 'Membentuk akor itu seperti membuat roti lapis: ambil nada 1 (roti bawah), lewati satu nada, ambil nada 3 (daging isi), lewati satu nada, ambil nada 5 (roti atas). Rumusnya selalu melompati satu nada: 1 - 3 - 5!',
    summary: 'Akor dibentuk dari penumpukan interval 3rd. Mengubah nada ke-3 dari 4 semitone ke 3 semitone langsung mengubah akor Mayor menjadi Minor seketika.',
    cheatSheet: [
      'Mayor: 1 - 3 - 5 (C - E - G)',
      'Minor: 1 - b3 - 5 (C - Eb - G) -> nada ke-3 turun 1/2 nada.',
      'Sus2 (1-2-5) & Sus4 (1-4-5): Nada ke-3 diganti, menghasilkan rasa mengambang segar.',
      'Major 7 (1-3-5-7): Menambahkan nada ke-7, akor khas indie & city pop.',
      'Add9 (1-3-5-9): Kunci akustik mahal andalan Ed Sheeran & John Mayer.'
    ],
    quickTip: 'Coba gantikan akor C biasa dengan Cmaj7 atau Cadd9 saat menulis lagu akustik. Suasana lagu langsung terdengar jauh lebih dewasa dan sinematik!',
    defaultRoot: 'C',
    highlightNotes: ['C', 'E', 'G', 'B'],
    toolType: 'chords'
  },
  deepDive: {
    overview: 'Harmoni adalah seni menggabungkan beberapa nada secara simultan. Kuasai formula pembentuknya dan lihat posisi fingering gitar di bawah.',
    chapters: [
      {
        chapterNum: '01',
        heading: 'Triad Dasar: Mayor, Minor, dan Suspended',
        content: 'Triad adalah fondasi musik modern yang terdiri dari 3 nada. Nada dasar disebut Root (1), nada tengah disebut 3rd (penentu sifat mayor atau minor), dan nada atas disebut 5th (penopang kestabilan). Pada akor Suspended (Sus), nada ke-3 digantikan oleh nada ke-2 (Sus2) atau nada ke-4 (Sus4), menciptakan rasa penasaran yang ingin segera kembali ke akor Mayor.',
        bulletPoints: [
          'Mayor: Jarak 4 semitone (Mayor 3rd) + 3 semitone (Minor 3rd)',
          'Minor: Jarak 3 semitone (Minor 3rd) + 4 semitone (Mayor 3rd)',
          'Diminished: Jarak 3 + 3 semitone (b3 dan b5), tegang dan horor'
        ]
      },
      {
        chapterNum: '02',
        heading: 'Akor 7th & Extensions: Membuka Nuansa Modern Pop',
        content: 'Menambahkan nada ke-4 pada triad (Seventh Chord) mengubah karakter lagu secara drastis:',
        bulletPoints: [
          'Major 7 (1-3-5-7): Lembut, santai sore, jazz pop (Cmaj7 = C-E-G-B)',
          'Dominant 7 (1-3-5-b7): Bluesy, tegang dan ingin segera jatuh ke akor I (G7 = G-B-D-F)',
          'Minor 7 (1-b3-5-b7): Hangat, R&B, melow elegan (Dm7 = D-F-A-C)',
          'Add9 (1-3-5-9): Triad biasa yang ditambah nada ke-2 pada oktaf atas (Cadd9 = C-E-G-D)'
        ],
        proTip: 'Di piano, nada Major 7th posisinya tepat 1/2 semitone di bawah root oktaf atas. Kamu tidak perlu menghitung 7 langkah dari bawah, cukup mundur 1 tuts dari root oktaf atas!'
      }
    ],
    chordDictionary: [
      {
        name: 'C Mayor',
        symbol: 'C',
        formula: '1 - 3 - 5',
        feeling: 'Terang, optimis, stabil',
        notesExample: 'C - E - G',
        intervals: [0, 4, 7],
        fingering: {
          frets: ['x', 3, 2, 0, 1, 0],
          fingers: 'x-3-2-0-1-0',
          description: 'Jari manis senar 5 fret 3, tengah senar 4 fret 2, telunjuk senar 2 fret 1'
        }
      },
      {
        name: 'C Major 7',
        symbol: 'Cmaj7',
        formula: '1 - 3 - 5 - 7',
        feeling: 'Dreamy, mewah, santai sore',
        notesExample: 'C - E - G - B',
        intervals: [0, 4, 7, 11],
        fingering: {
          frets: ['x', 3, 2, 0, 0, 0],
          fingers: 'x-3-2-0-0-0',
          description: 'Bentuk C biasa tanpa menekan senar 2 (senar 2 open string B)'
        }
      },
      {
        name: 'C Add 9',
        symbol: 'Cadd9',
        formula: '1 - 3 - 5 - 9',
        feeling: 'Akustik pop mahal, modern',
        notesExample: 'C - E - G - D',
        intervals: [0, 4, 7, 14],
        fingering: {
          frets: ['x', 3, 2, 0, 3, 0],
          fingers: 'x-3-2-0-4-0',
          description: 'Bentuk C biasa ditambah jari kelingking di senar 2 fret 3 (nada D)'
        }
      },
      {
        name: 'A Minor',
        symbol: 'Am',
        formula: '1 - b3 - 5',
        feeling: 'Melankolis, introspektif, sendu',
        notesExample: 'A - C - E',
        intervals: [0, 3, 7],
        fingering: {
          frets: ['x', 0, 2, 2, 1, 0],
          fingers: 'x-0-2-3-1-0',
          description: 'Jari tengah senar 4 fret 2, manis senar 3 fret 2, telunjuk senar 2 fret 1'
        }
      },
      {
        name: 'D Minor 7',
        symbol: 'Dm7',
        formula: '1 - b3 - 5 - b7',
        feeling: 'R&B, jazzy, hangat',
        notesExample: 'D - F - A - C',
        intervals: [0, 3, 7, 10],
        fingering: {
          frets: ['x', 'x', 0, 2, 1, 1],
          fingers: 'x-x-0-2-1-1',
          barreFret: 1,
          description: 'Jari tengah senar 3 fret 2, telunjuk mem-barre senar 1 & 2 di fret 1'
        }
      },
      {
        name: 'G Dominant 7',
        symbol: 'G7',
        formula: '1 - 3 - 5 - b7',
        feeling: 'Tegang, butuh pulang ke C (resolusi)',
        notesExample: 'G - B - D - F',
        intervals: [0, 4, 7, 10],
        fingering: {
          frets: [3, 2, 0, 0, 0, 1],
          fingers: '3-2-0-0-0-1',
          description: 'Jari manis senar 6 fret 3, tengah senar 5 fret 2, telunjuk senar 1 fret 1'
        }
      },
      {
        name: 'F Mayor (Easy Bar)',
        symbol: 'F',
        formula: '1 - 3 - 5',
        feeling: 'Harapan terbuka, lebar',
        notesExample: 'F - A - C',
        intervals: [0, 4, 7],
        fingering: {
          frets: ['x', 'x', 3, 2, 1, 1],
          fingers: 'x-x-3-2-1-1',
          description: 'Versi simpel tanpa palang penuh: manis senar 4 fret 3, tengah senar 3 fret 2, telunjuk barre senar 1-2'
        }
      }
    ]
  }
};
