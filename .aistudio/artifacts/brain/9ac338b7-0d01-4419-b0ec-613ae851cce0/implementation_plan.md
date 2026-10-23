# Rencana Implementasi: Drawer Rekomendasi Family Chord & Non-Keyboard Chord Inspection

Berdasarkan diskusi dan klarifikasi, toolbar editor lirik akan dirapikan dengan menyatukan tombol-tombol chord menjadi **1 tombol tunggal "+ Akor"** yang membuka **Drawer Bottom Sheet** (seperti Drawer Bank Bar), menyajikan **rekomendasi family chord** lengkap sesuai nada dasar yang dipilih di header (tingkat I-vi + variasi/ekstensi), serta memperbaiki interaksi klik pada badge chord di teks agar **tidak memunculkan keyboard virtual**.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> Keputusan dan preferensi yang telah disepakati:
> 1. **Klik Badge Chord Tanpa Keyboard**: Saat pengguna mengklik badge chord di dalam teks (baik saat kursor aktif atau tidak), keyboard virtual HP **tidak boleh muncul sama sekali**, dan langsung membuka modal diagram tuts piano / fretboard gitar.
> 2. **Bentuk Tampilan Toolbar**: Seluruh tombol akor individual di toolbar mobile dan desktop disatukan menjadi **1 tombol "+ Akor"** (sama rapinya seperti tombol `+ Bagian`).
> 3. **Bentuk Tampilan Menu Akor**: Membuka **Drawer Bottom Sheet** bergaya Bank Bar (slide-up dari bawah di mobile dengan grab-handle, modal elegan di desktop).
> 4. **Cakupan Akor Berdasarkan Key**:
>    - **Family Chord Utama (Tingkat I - vi)**: Ditentukan secara otomatis dari nada dasar yang dipilih (misal Key D -> `D`, `Em`, `F#m`, `G`, `A`, `Bm`, `C#dim`).
>    - **Variasi & Ekstensi Populer**: Akor `7`, `maj7`, `sus2`, `sus4`, `add9`, dan slash chords (`D/F#`, `G/B`).
>    - **Kamus Akor & Pencarian**: Kolom pencarian untuk menemukan atau menyisipkan akor khusus apa saja secara instan.
>    - **Pratinjau Suara**: Tombol audio untuk mendengarkan bunyi akor sebelum disisipkan.

---

### 1. Overview & Core Concept

- **Apa yang Dibangun**:
  1. Interseptor event pada badge chord di TipTap editor (`pointerdown` stopPropagation + preventDefault + blur) sehingga virtual keyboard tidak pernah terbuka saat badge chord disentuh.
  2. Komponen baru `ChordDrawerModal.tsx` yang dirancang seperti `BankBarPickerModal` (drawer di mobile, dialog di desktop).
  3. Mesin kalkulasi teori musik `getFamilyChords(key)` untuk menghasilkan harmoni diatonik akor keluarga (Mayor: I, ii, iii, IV, V, vi; Minor: i, ii°, III, iv, v/V, VI, VII) dan variasinya.
  4. Penyederhanaan toolbar desktop & mobile: 1 tombol `+ Bagian` dan 1 tombol `+ Akor`.

---

### 2. User Experience & Visual Design

#### A. Alur Interaksi Klik Badge Chord (Bebas Keyboard)
```
Pengguna tap badge [Dmaj7] di dalam teks lirik
       │
       ▼
TipTap editorProps.handleDOMEvents.pointerdown
       │
       ├─► event.preventDefault() (Cegah contenteditable mengambil fokus)
       ├─► event.stopPropagation() (Cegah touch bubbling ke OS keyboard)
       ├─► document.activeElement?.blur() (Tutup keyboard jika sempat aktif)
       ▼
Buka ChordInspectionModal (Piano Roll & Fretboard) dengan layar bersih tanpa terhalang keyboard!
```

#### B. Alur Interaksi Drawer "+ Akor"
```
Header Key: [D] ────► Toolbar: [ + Bagian ▾ ]  [ + Akor ▾ ]
                                                   │ (klik)
                                                   ▼
┌───────────────────────────────────────────────────────────────┐
│ Drawer Sisipkan Akor (Key: D)                             [X] │
├───────────────────────────────────────────────────────────────┤
│ 🔍 Cari akor (misal: Bm7, G/B, F#)...                         │
├───────────────────────────────────────────────────────────────┤
│ FAMILY CHORD UTAMA (DIATONIK)                                 │
│ ┌─────────┬─────────┬─────────┬─────────┬─────────┬─────────┐ │
│ │  I      │  ii     │  iii    │  IV     │  V      │  vi     │ │
│ │  [D] 🔊 │ [Em] 🔊 │ [F#m]🔊 │  [G] 🔊 │  [A] 🔊 │ [Bm] 🔊 │ │
│ └─────────┴─────────┴─────────┴─────────┴─────────┴─────────┘ │
│                                                               │
│ VARIASI & EKSTENSI POPULER                                    │
│ [Dmaj7] [Dadd9] [Dsus2] [Dsus4] [D/F#] [A7] [Em7] [A/C#]      │
│                                                               │
│ KAMUS LENGKAP SEMUA ROOT (Kromatik)                           │
│ C · C# · D · Eb · E · F · F# · G · Ab · A · Bb · B            │
└───────────────────────────────────────────────────────────────┘
```

#### C. Estetika & Ergonomi
- Menggunakan gaya Drawer Bank Bar (`bg-[#FAF9F5] border-[#E5E4DE] shadow-2xl`, dengan mobile grab handle `w-10 h-1 bg-[#D6D3D1]`).
- Tiap kartu akor memiliki tombol preview suara kecil (`Volume2`), label derajat angka romawi (I, ii, iii, IV, V, vi), dan font monospace yang bersih.
- Menekan salah satu akor langsung menyisipkannya ke teks editor lirik pada posisi kursor (`[D] `) dan menutup drawer.

---

### 3. Key Product Decisions & Trade-Offs

1. **Family Chord Otomatis Sesuai Key**:
   - Jika pengguna memilih Key `D`, maka famili chord-nya adalah `D`, `Em`, `F#m`, `G`, `A`, `Bm`, `C#dim`.
   - Jika pengguna memilih Key `Am`, famili chord-nya adalah `Am`, `Bdim`, `C`, `Dm`, `Em`/`E7`, `F`, `G`.
   - Tidak ada lagi akor acak yang salah tangga nada (seperti Dm saat key D mayor).
2. **Drawer Bottom Sheet vs Inline Bar**:
   - Inline bar sebelumnya memakan ruang horizontal dan hanya muat 4-5 akor root.
   - Dengan 1 tombol `+ Akor` yang membuka Drawer, toolbar menjadi sangat bersih, dan pengguna mendapatkan pilihan harmoni yang jauh lebih kaya (I-vi, variasi 7th, sus, add9, serta pencarian).
3. **Pencegahan Keyboard pada Klik Badge**:
   - Menangani `pointerdown` alih-alih `click` biasa adalah kunci teknis utama untuk mencegah OS mobile memunculkan virtual keyboard sebelum modal sempat dibuka.

---

### 4. Technical Architecture & Data Strategy

#### Komponen yang Dibuat / Dimodifikasi:
1. **`/src/utils/musicTheory.ts` (atau `/src/utils/musicCalculations.ts`)**:
   - Fungsi `getFamilyChordGroups(key: string)`: menghitung akor tingkat I-vii, akor variasi (7, sus2, sus4, add9, slash), serta interval audio untuk sound playback.
2. **`/src/components/lyrics/ChordDrawerModal.tsx`** *(Baru)*:
   - Komponen Drawer Bottom Sheet (mobile) & Modal (desktop).
   - Menampilkan Family Chord tingkat I-vi, variasi, pencarian akor cepat, dan audio playback.
3. **`/src/components/LyricEditor.tsx`**:
   - Menambahkan event listener `handleDOMEvents: { pointerdown: ... }` di TipTap editor props untuk mencegah keyboard muncul saat klik badge chord.
   - Mengelola state `isChordDrawerOpen` dan menghubungkannya dengan `LyricWritingToolbar`.
4. **`/src/components/lyrics/LyricWritingToolbar.tsx`**:
   - Menyederhanakan strip toolbar: Tombol `+ Bagian` dan tombol `+ Akor` (membuka ChordDrawerModal).
   - Menghapus deretan akor horizontal statis yang panjang sehingga ruang toolbar sangat ringkas dan lega.
