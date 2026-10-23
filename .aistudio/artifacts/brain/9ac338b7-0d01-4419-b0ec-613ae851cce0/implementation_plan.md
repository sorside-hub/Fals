# Rencana Revisi: Presisi Alignment Editor Lirik & Minimalis Badge Akor

Pembaruan tampilan dan tata letak Editor Lirik sesuai feedback: menghilangkan ikon musik pada badge akor, merampingkan popup inspeksi akor (tanpa tombol X ganda di atas), memposisikan kolom suku kata mentok ke kiri dengan box angka yang pas/snug, serta menyempurnakan keselarasan vertikal (alignment center) antara label SEC, angka suku kata, dan baris lirik secara dinamis.

## User Review & Critical Decisions

> [!IMPORTANT]
> Penyesuaian spesifik berdasarkan evaluasi tampilan mobile pengguna:
> - **Badge Akor**: Menghilangkan ikon musik (`♪`) pada badge akor. Badge hanya menampilkan nama akor (misal `[E]`, `[Am]`) dengan gaya visual bersih dan tegas.
> - **Popup Inspeksi Akor (`ChordInspectionModal`)**: Menghilangkan tombol close `(X)` di header atas karena sudah tersedia tombol "Tutup" yang nyaman dijangkau di bagian bawah modal.
> - **Gutter Suku Kata Mentok Kiri**: Mempersempit dan menggeser kolom suku kata merapat ke tepi kiri (`w-6 sm:w-7`, tanpa padding kiri berlebih) untuk memaksimalkan lebar horizontal area ketik lirik di mobile.
> - **Kotak Angka Suku Kata Pas (Snug)**: Menghilangkan padding vertikal tebal agar kotak penampung angka pas membungkus angka (`h-4`, `px-1 py-0`, `text-[10px]`).
> - **Presisi Alignment Vertikal**: Mengganti perhitungan baris statis dengan sinkronisasi posisi dinamis berbasis `offsetTop` elemen paragraf editor TipTap, sehingga baris yang mengalami *text-wrapping* di mobile atau tag section tidak lagi menyebabkan desinkronisasi baris gutter.

- **Confirmed Decision 1**: Badge akor bersih tanpa ikon musik.
- **Confirmed Decision 2**: Header modal inspeksi tanpa tombol X; penutupan modal lewat tombol bawah atau klik backdrop.
- **Confirmed Decision 3**: Kolom metrik mentok kiri dengan kotak angka proporsional dan presisi sejajar baris teks lirik.

---

## 1. Overview & Core Concept

- **Apa yang Disempurnakan**: Mengeliminasi ketidaksejajaran visual (*misalignment*) antara kolom indikator suku kata kiri dan baris lirik TipTap pada layar ponsel, sekaligus merapikan ruang ketik horizontal agar lebih lapang.
- **Kenyamanan Penulisan**: Penulis lagu mendapatkan kanvas yang proporsional di mana setiap baris lirik memiliki indikator suku kata tepat di samping baris pertamanya, tanpa pergeseran akibat teks panjang yang turun ke baris berikutnya (*wrap*).

---

## 2. User Experience & Visual Design

### Alur & Tampilan Baru:
1. **Gutter Kiri Super Ramping & Mentok Kiri**:
   - Kolom suku kata merapat ke sisi kiri (`left-0`, `w-6 sm:w-7`).
   - Kotak angka suku kata berukuran pas (`h-4 min-w-[18px] text-[10px] leading-none px-1 py-0 rounded-[3px] bg-[#EAE8DF] text-[#44403C]`).
   - Tag bagian (`SEC`) berukuran kompak (`h-4 text-[9px] font-bold text-[#78716C]`).
2. **Sinkronisasi Posisi Vertikal Sempurna**:
   - Setiap indikator baris ditempatkan tepat sejajar vertikal (`flex items-center`) dengan baris pertama paragraf TipTap yang bersangkutan.
   - Paragraf yang membungkus (*wrapping*) ke 2 baris tidak menggeser baris-baris berikutnya.
3. **Badge Akor Minimalis**:
   - Tampilan bersih tanpa ikon nada: `[E]`, `[Am]`, `[F]`, `[G]`.
   - Mengklik badge membuka popup inspeksi akor.
4. **Modal Inspeksi Akor Rapi**:
   - Header modal hanya memuat nama akor, notasi pembentuk, dan tombol audio "Putar Akor".
   - Tidak ada tombol silang `(X)` di sudut atas; tombol aksi utama "Tutup" di bagian bawah sudah cukup dan mudah dijangkau satu tangan.

---

## 3. Key Product Decisions & Trade-Offs

- **Keputusan 1: Dynamic Layout Sync Menggunakan DOM Paragraph Offsets**
  - *Pendekatan*: Mengambil `offsetTop` dari setiap anak elemen `editor.view.dom` (paragraf `<p>` dan heading `<h3>`) dan memetakan indikator suku kata pada koordinat vertikal yang sama persis.
  - *Alasan*: Pendekatan statis `split('\n') * height` gagal total ketika teks lirik membungkus di mobile (seperti terlihat pada screenshot). Menggunakan `offsetTop` menjamin 100% presisi vertikal tanpa peduli berapa baris teks membungkus.

- **Keputusan 2: Pembersihan Elemen Redundan di Modal & Badge**
  - *Pendekatan*: Menghapus `♪` dari ekstensi TipTap dan menghapus `X` dari header modal.
  - *Alasan*: Mengurangi *visual clutter* sesuai instruksi pengguna, membuat UI tampak lebih dewasa dan profesional.

---

## 4. Technical Architecture & Data Strategy

```
┌─────────────────────────────────────────────────────────────┐
│                       LyricEditor                           │
│                                                             │
│ ┌────┐ ┌──────────────────────────────────────────────────┐ │
│ │SEC │ │ [VERSE 1]                                        │ │
│ │ 11 │ │ Di sudut kamar berteman sepi [E]                 │ │
│ │ 12 │ │ Kucoba petik senar gitar yang                    │ │
│ │    │ │ hening [Am] ◄── Wrapped line (tidak bikin geser) │ │
│ │ 12 │ │ Membuat melodi dari rindu yang perih [F]         │ │
│ │    │ │                                                  │ │
│ │SEC │ │ [HOOK]                                           │ │
│ │  8 │ │ Aku bernyanyi untukmu [C]                        │ │
│ └────┘ └──────────────────────────────────────────────────┘ │
│  ▲                                                          │
│  └─ Mentok kiri, snug box (h-4), diposisikan via offsetTop  │
└─────────────────────────────────────────────────────────────┘
```

### Langkah-Langkah Pengerjaan:
1. **Modifikasi `ChordBadgeExtension.ts` & `index.css`**:
   - Hapus rendering span `♪` (`chord-pill-icon`).
   - Rapikan padding badge akor inline agar ringkas dan nyaman dibaca berdampingan dengan kata-kata lirik.
2. **Modifikasi `ChordInspectionModal.tsx`**:
   - Hapus elemen button close `(X)` dari header kanan atas.
3. **Penyempurnaan Gutter & Alignment di `LyricEditor.tsx` & `index.css`**:
   - Sambungkan observer terhadap `editor.view.dom` untuk menghitung `offsetTop` tiap elemen baris secara live.
   - Set ukuran gutter mentok ke tepi kiri (`w-6 sm:w-7`, padding kiri 0).
   - Buat box angka suku kata pas dengan angka (`h-4`, `px-1 py-0`, `text-[10px]`, `leading-none`).
   - Samakan line-height pada `tiptap-editor p` dan `tiptap-editor h3` (`2.25rem` / `36px`) agar titik tengah vertikal (*vertical center*) teks dan badge selalu klop dan presisi.
4. **Verifikasi**:
   - Jalankan `compile_applet` dan `lint_applet` untuk memastikan tidak ada regresi kode.
