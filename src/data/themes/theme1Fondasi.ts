import { TheoryTheme } from '../../types';

export const theme1Fondasi: TheoryTheme = {
  id: 'fondasi',
  themeNumber: '01',
  title: 'Fondasi Nada & Telinga',
  tagline: '12 nada semesta, jarak interval, dan rahasia melatih telinga musisi agar tidak fals',
  readTime: '4 menit baca',
  preview: {
    analogy: 'Bayangkan tangga di rumahmu. Setiap langkah ke 1 anak tangga di sebelahnya adalah 1 semitone. Kalau kamu melompat 2 anak tangga sekaligus, itu 1 whole tone.',
    summary: 'Seluruh musik di dunia Barat hanya tersusun dari 12 nada. Jarak (interval) antar nada inilah yang memicu rasa senang, sedih, tegang, atau rileks di dada pendengar.',
    cheatSheet: [
      'Semitone (1/2): Geser 1 tuts tetangga / 1 fret gitar.',
      'Whole tone (1): Loncat 2 semitone / geser 2 fret gitar.',
      'Antara E-F dan B-C tidak ada tuts hitam (jarak alaminya sudah 1/2 nada).',
      'Major 3rd (4 semitone) = Karakter senyum / cerah.',
      'Minor 3rd (3 semitone) = Karakter murung / sendu.'
    ],
    quickTip: 'Coba pencet tuts C lalu E (Major 3rd), bandingkan dengan C lalu D# (Minor 3rd). Perbedaan senyum vs melow langsung terasa di telinga!',
    defaultRoot: 'C',
    highlightNotes: ['C', 'E', 'G'],
    toolType: 'piano'
  },
  deepDive: {
    overview: 'Memahami nada bukan tentang menghafal rumus kertas partitur kuno, tapi melatih kepekaan telinga mendengar relasi jarak frekuensi.',
    chapters: [
      {
        chapterNum: '01',
        heading: 'Anatomi 12 Nada Kromatik',
        content: 'Ada 12 nada dasar dalam sistem nada Barat: C, C#, D, D#, E, F, F#, G, G#, A, A#, B. Setelah nada B, kita kembali ke C pada register oktaf yang lebih tinggi. Kres (#) berarti nada dinaikkan 1/2 semitone, sedangkan Mol (b) berarti diturunkan 1/2 semitone. C# dan Db menghasilkan frekuensi suara yang sama persis (enharmonik).',
        bulletPoints: [
          'Tuts Putih: 7 nada natural (C, D, E, F, G, A, B)',
          'Tuts Hitam: 5 nada aksidental (C#, D#, F#, G#, A#)',
          'Kunci hafalan cepat: E-F dan B-C adalah pasangan alami tanpa tuts hitam di antaranya.'
        ],
        proTip: 'Di gitar, senar manapun yang kamu tekan jika digeser maju 12 fret akan menghasilkan nada yang sama persis di oktaf atas.'
      },
      {
        chapterNum: '02',
        heading: 'Interval: Jarak Matematika Pembawa Emosi',
        content: 'Interval adalah jarak ketinggian antara dua nada. Inilah daftar interval terpenting yang wajib dikenali telinga musisi:',
        bulletPoints: [
          'Unison (0 semitone): Nada identik bersamaan',
          'Minor 2nd (1 semitone): Paling disonan dan tegang (contoh intro film "Jaws")',
          'Major 2nd (2 semitone): Melangkah wajar dalam melodi',
          'Minor 3rd (3 semitone): Jantung dari akor minor (sendu, emosional)',
          'Major 3rd (4 semitone): Jantung dari akor mayor (terang, bangkit)',
          'Perfect 4th (5 semitone): Terbuka, gagah (awal lagu nasional/hymn)',
          'Tritone (6 semitone): "The Devil\'s Interval", sangat tegang dan butuh resolusi',
          'Perfect 5th (7 semitone): Kokoh banget, fondasi power chord musik rock!',
          'Octave (12 semitone): Kembar nada tapi lebih tinggi'
        ],
        proTip: 'Power chord di musik rock (seperti C5) hanya berisi Root + Perfect 5th (tanpa nada ke-3). Karena tidak ada 3rd, power chord netral: tidak mayor dan tidak minor!'
      },
      {
        chapterNum: '03',
        heading: 'Cara Melatih Telinga Musisi (Ear Training)',
        content: 'Musisi handal tidak perlu melihat partitur untuk tahu akor sebuah lagu. Mereka mengenali "rasa" interval. Latihlah telingamu dengan asosiasi lagu populer: Mayor 3rd terdengar seperti awal lagu "Kumbaya" atau "When the Saints Go Marching In", sedangkan Minor 3rd terdengar seperti nada bel pintu atau "Lullaby" Brahms.'
      }
    ]
  }
};
