import { TheoryTheme } from '../../types';

export const theme2Skala: TheoryTheme = {
  id: 'skala',
  themeNumber: '02',
  title: 'Tangga Nada & Melodi',
  tagline: 'Mayor, Minor, dan Pentatonik: Skala anti-fals untuk solo instrumen dan melodi vokal',
  readTime: '5 menit baca',
  preview: {
    analogy: 'Tangga nada itu seperti palet warna seorang pelukis. Daripada menabrakkan semua 12 warna acak yang bikin lukisan kotor, kita memilih 7 nada yang saling bersahabat.',
    summary: 'Tangga nada Mayor adalah raja dari semua teori musik. Dari rumus Mayor, kita bisa menurunkan tangga nada Minor, Pentatonik, hingga skala Blues.',
    cheatSheet: [
      'Rumus Mayor: 1 - 1 - 1/2 - 1 - 1 - 1 - 1/2 (W-W-H-W-W-W-H).',
      'C Mayor = C, D, E, F, G, A, B (Semua tuts putih, tanpa kres).',
      'Relative Minor selalu berjarak 3 semitone di bawah Mayor (C Mayor kembarannya A Minor).',
      'Pentatonik = Hanya 5 nada, dijamin tidak ada nada yang terdengar fals saat solo!'
    ],
    quickTip: 'Saat mengiringi lagu di nada dasar C, coba mainkan melodi hanya dari 5 nada Pentatonik (C, D, E, G, A). Apapun variasinya, melodimu akan selalu terdengar enak!',
    defaultRoot: 'C',
    highlightNotes: ['C', 'D', 'E', 'G', 'A'],
    toolType: 'piano'
  },
  deepDive: {
    overview: 'Tangga nada adalah panduan memilih nada saat membuat melodi vokal atau melodi solo gitar agar tidak sumbang.',
    chapters: [
      {
        chapterNum: '01',
        heading: 'Rumus Tangga Nada Mayor & Kunci Transposisi',
        content: 'Pola langkah Mayor selalu Whole-Whole-Half-Whole-Whole-Whole-Half. Menggunakan pola ini, kamu bisa membuat tangga nada mayor dari nada dasar mana saja. Misalnya dari nada G: G -> A -> B -> C -> D -> E -> F# -> G. Nada ke-7 harus F# agar jarak ke G kembali 1/2 semitone.',
        bulletPoints: [
          'Pola: 2 semitone, 2 semitone, 1 semitone, 2 semitone, 2 semitone, 2 semitone, 1 semitone',
          'Setiap huruf nada (A sampai G) harus dipakai tepat satu kali'
        ]
      },
      {
        chapterNum: '02',
        heading: 'Tangga Nada Minor Alami & Relasi Kembar',
        content: 'Tiap tangga nada mayor punya saudara kembar "Relative Minor" yang berisi nada yang sama persis namun diawali dari nada ke-6 (derajat vi). C Mayor dan A Minor punya notasi identik: A - B - C - D - E - F - G. Inilah alasan kenapa lagu di nada dasar C seringkali bisa diselingi akor Am dengan sangat mulus.',
        proTip: 'Kalau melodi lagu pop terasa terlalu ceria dan kekanak-kanakan, mulailah kalimat lagu dari nada relative minornya.'
      },
      {
        chapterNum: '03',
        heading: 'Pentatonik & Skala Blues: Senjata Rahasia Solo Gitar',
        content: 'Skala Pentatonik membuang nada ke-4 dan ke-7 dari skala mayor (dua nada yang paling sering berpotensi fals/disonan). Tersisa 5 nada murni: 1 - 2 - 3 - 5 - 6. Pada skala Blues, kita menambahkan nada "Blue Note" (b5) yang memberikan rasa gritty, renyah, dan bernyawa.',
        bulletPoints: [
          'Pentatonik Mayor: 1 - 2 - 3 - 5 - 6 (C - D - E - G - A)',
          'Pentatonik Minor: 1 - b3 - 4 - 5 - b7 (A - C - D - E - G)',
          'Blues Scale: 1 - b3 - 4 - b5 - 5 - b7 (Menambahkan nada Eb di antara D dan E)'
        ]
      }
    ]
  }
};
