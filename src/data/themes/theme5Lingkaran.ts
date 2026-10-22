import { TheoryTheme } from '../../types';

export const theme5Lingkaran: TheoryTheme = {
  id: 'lingkaran',
  themeNumber: '05',
  title: 'Roda Nada & Modus Lanjutan',
  tagline: 'Circle of Fifths, rumus transposisi 10 detik, dan warna eksotis modus musik',
  readTime: '5 menit baca',
  preview: {
    analogy: 'Circle of Fifths (Lingkaran Kuint) itu seperti kompas GPS musik. Jam 12 adalah C (tanpa kres). Setiap bergeser 1 jam searah jarum jam, kamu naik 5 nada dan menambah 1 tanda kres (#).',
    summary: 'Lingkaran Kuint menunjukkan 6 akor yang bertetangga dekat dan dijamin harmonis kalau digabungkan, sekaligus trik instan ganti nada dasar untuk vokal vokalis.',
    cheatSheet: [
      'Tetangga nada C: Kiri adalah F (IV), kanan adalah G (V).',
      'Di dalam lingkaran C adalah Am (Relative Minor / vi).',
      '6 Akor Keluarga C: C, F, G, Am, Dm, Em (Pasti enak digabung!).',
      'Modus Dorian: Minor tapi santai danceable (Daft Punk).',
      'Modus Mixolydian: Mayor gaya retro pantai (The Beatles).'
    ],
    quickTip: 'Kalau vokalis bilang "Ketinggian bro kalau di C, turunin ke A dong!", geser kompas lingkaran kuint 3 langkah ke kiri. Semua urutan akormu langsung terkonversi!',
    defaultRoot: 'C',
    highlightNotes: ['C', 'F', 'G', 'A', 'D', 'E'],
    toolType: 'circle'
  },
  deepDive: {
    overview: 'Ketika kamu sudah menguasai mayor dan minor standar, Lingkaran Kuint dan Modus Musik adalah pintu menuju aransemen musik level profesional.',
    chapters: [
      {
        chapterNum: '01',
        heading: 'Cara Membaca Circle of Fifths dalam 30 Detik',
        content: 'Lingkaran Kuint menyusun 12 nada berdasarkan jarak interval Kuint (7 semitone). Keuntungan terbesarnya: Akor-akor yang posisinya saling menempel dalam lingkaran adalah akor yang memiliki frekuensi paling selaras.',
        bulletPoints: [
          'Pusat: Nada dasar Tonic (I)',
          'Sisi Kiri: Subdominant (IV)',
          'Sisi Kanan: Dominant (V)',
          'Cincin Dalam: 3 Akor Minor pendukung (ii, iii, vi)'
        ],
        proTip: 'Jangan pernah pusing mencari chord jembatan. Cukup ambil salah satu dari 6 akor keluarga yang bertetangga di lingkaran kuint.'
      },
      {
        chapterNum: '02',
        heading: 'Modus Musik: Mengubah Warna Emosi Tanpa Rumit',
        content: 'Modus bukanlah tangga nada baru yang misterius. Modus hanyalah tangga nada Mayor yang dimainkan mulai dari nada derajat yang berbeda:',
        bulletPoints: [
          'Dorian (Mulai dari derajat 2): Minor dengan natural 6th. Tidak terlalu gelap, punya aura misterius yang keren (Contoh: "Get Lucky" - Daft Punk, "Billie Jean" - Michael Jackson)',
          'Mixolydian (Mulai dari derajat 5): Mayor dengan flat 7th. Akor V-nya jadi minor, sangat santai dan retro (Contoh: "Sweet Home Alabama", "Norwegian Wood" - The Beatles)',
          'Lydian (Mulai dari derajat 4): Mayor dengan sharp 4th (#4). Suasana melayang magis seperti mimpi luar angkasa (Sering dipake soundtrack film sci-fi)'
        ]
      }
    ]
  }
};
