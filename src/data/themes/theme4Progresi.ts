import { TheoryTheme } from '../../types';

export const theme4Progresi: TheoryTheme = {
  id: 'progresi',
  themeNumber: '04',
  title: 'Progresi & Bedah Lagu',
  tagline: 'Sistem Angka Romawi, 4-Chord Magic, dan bedah progresi lagu hits dunia',
  readTime: '6 menit baca',
  preview: {
    analogy: 'Angka Romawi (I, ii, iii, IV, V, vi) itu seperti posisi dalam tim sepak bola. Si I adalah Kapten (Home), si V adalah Penyerang pembawa ketegangan (Tension), dan si IV adalah Gelandang pengatur tempo.',
    summary: 'Hampir seluruh lagu pop dunia dibangun dari 4 akor yang sama. Dengan memahami angka romawi, kamu bisa memindahkan lagu ke nada dasar vokal apapun dalam sekejap.',
    cheatSheet: [
      'Keluarga di Tangga Nada C: I = C, ii = Dm, iii = Em, IV = F, V = G, vi = Am.',
      'I - V - vi - IV (C - G - Am - F): "The 4-Chord Magic" (Dipakai di ribuan lagu hits).',
      'ii - V - I (Dm - G - C): Resep utama musik Jazz, City Pop, dan R&B.',
      'vi - IV - I - V (Am - F - C - G): Progresi galau pop modern yang sangat emosional.'
    ],
    quickTip: 'Kunci dari semua progresi yang enak adalah perjalanan dari V (Dominant) kembali pulang ke I (Tonic). Telinga manusia secara alami mendambakan resolusi dari V ke I.',
    defaultRoot: 'C',
    highlightNotes: ['C', 'G', 'A', 'F'],
    toolType: 'chords'
  },
  deepDive: {
    overview: 'Progresi akor adalah alur cerita lagu. Cara kamu menyusun urutan akor menentukan bagaimana emosi pendengar terbawa.',
    chapters: [
      {
        chapterNum: '01',
        heading: 'Sistem Angka Romawi (The Nashville Number System)',
        content: 'Musisi profesional tidak menghafal chord "C - G - Am - F", melainkan menghafal jabatannya: "I - V - vi - IV". Huruf kapital (I, IV, V) menunjukkan akor Mayor, sedangkan huruf kecil (ii, iii, vi) menunjukkan akor Minor. Derajat vii° adalah diminished.',
        bulletPoints: [
          'Tonic (I): Titik awal dan tempat pulang paling tenang',
          'Subdominant (IV): Membawa suasana menjauh dari rumah, membuka ruang baru',
          'Dominant (V): Puncak ketegangan musik yang mendesak untuk diselesaikan ke I',
          'Submediant (vi): Titik melankolis, sering dijadikan awal verse lagu pop galau'
        ]
      },
      {
        chapterNum: '02',
        heading: '3 Formula Progresi Paling Legendaris',
        content: 'Jika kamu bingung memulai lagu, gunakan salah satu dari 3 formula andalan ini:',
        bulletPoints: [
          '1. Pop Anthem (I - V - vi - IV): Rasa optimis, megah, dan abadi',
          '2. Melodrama Pop (vi - IV - I - V): Rasa sedih yang perlahan menemukan harapan',
          '3. Sentuhan Jazz/Soul (ii - V - I): Halus, elegan, dan sangat berkelas'
        ]
      }
    ],
    songCaseStudies: [
      {
        song: 'Someone Like You',
        artist: 'Adele',
        progression: ['A', 'E', 'F#m', 'D'],
        romanNumerals: 'I - V - vi - IV',
        whyItWorks: 'Formula 4-chord legendaris yang membangkitkan rasa nostalgia dan penerimaan emosional secara universal.'
      },
      {
        song: 'Sempurna',
        artist: 'Andra and The Backbone',
        progression: ['E', 'C#m', 'A', 'B'],
        romanNumerals: 'I - vi - IV - V',
        whyItWorks: 'Variasi 50s Doo-Wop progression. Dari I langsung ke vi memberikan rasa romantis yang manis dan intim.'
      },
      {
        song: 'Don\'t Look Back in Anger',
        artist: 'Oasis',
        progression: ['C', 'G', 'Am', 'E', 'F', 'G', 'C'],
        romanNumerals: 'I - V - vi - III - IV - V - I',
        whyItWorks: 'Ada sentuhan chord E Mayor (Secondary Dominant III) sebelum masuk ke F, memberikan lonjakan emosi yang luar biasa megah.'
      },
      {
        song: 'Get Lucky',
        artist: 'Daft Punk ft. Pharrell',
        progression: ['Bm', 'D', 'F#m', 'E'],
        romanNumerals: 'i - III - v - IV (Dorian loop)',
        whyItWorks: 'Akor E mayor di akhir adalah tanda khas mode B Dorian, membuat progresi berputar tanpa henti tanpa terasa membosankan.'
      }
    ]
  }
};
