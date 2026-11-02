# Implementation Plan - Scale Lab & Pola Pattern Optimizer

## Progress
- [x] Analyze proposed section sequence in `ScaleLabView.tsx`
- [x] Reorder visual flow:
  1. Dropdowns (Root & Jenis Skala)
  2. Rumusnya (Box Formulasi, Interval, Semitone)
  3. Tangga nadanya (Chips deretan nada skala interaktif)
  4. Virtual fret/piano (Visualizer Hero, toggle Fret/Piano, tombol Fullscreen)
  5. Pola dan pattern (Cropped box diagram fokus ke fret aktif)
- [x] Remove the audio bar strip under the visualizer ("Bunyikan Seluruh Nada Skala")
- [x] Redesign Pattern Box Visualizer (Fretboard & Navigasi):
  - [x] Tombol panah [ < ] dan [ > ] dipindahkan ke header atas mengapit judul, membebaskan lebar diagram agar tidak terhimpit di HP
  - [x] Hapus teks "Fret" di atas fretboard, kini hanya menampilkan angka bersih (misal: 8, 9, 10, 11, 12, 13) dengan titik fret inlay
  - [x] Diagram menggunakan 100% lebar kontainer sehingga fret dan senar lebih lega dan mudah ditekan di layar HP
- [x] Active Note Highlight saat Bunyikan Jalur Pola (Run):
  - [x] Lingkaran nada di fretboard menyala terang (amber ring & glow animation) secara real-time mengikuti alunan nada yang sedang berbunyi dari Senar 6 ke Senar 1
- [x] BPM / Tempo Controller:
  - [x] Dilengkapi pengatur tempo (50 - 180 BPM, default 90 BPM) dengan tombol [-] dan [+], serta preset cepat (60, 90, 120 BPM)
  - [x] Durasi langkah tiap nada otomatis sinkron dengan nilai BPM yang dipilih
- [x] Build and compile verification (passed cleanly with 0 errors)
