# Simplifikasi Kartu Lirik & Navigasi Smart Tab Lirik

Penyederhanaan desain kartu daftar lagu pada Studio Lirik serta penyesuaian perilaku navigasi tab Lirik untuk mempertahankan posisi editor saat berpindah tab, serta beralih kembali ke daftar lirik jika tab Lirik diklik ulang saat berada di editor.

## User Review & Critical Decisions

> [!IMPORTANT]
> Berdasarkan konfirmasi dari pengguna:
> 1. **Format Tanggal Kartu**: Format teks ringkas kapital tanpa jam (contoh: `24 OKT 2026`).
> 2. **Indikator Status**: Badge status warna kecil yang elegan (`DRAFT`, `PROSES`, `RELEASE`).
> 3. **Interaksi Kartu**: Seluruh area kartu dapat diklik langsung untuk membuka editor, tanpa tombol terpisah "Buka di Editor TipTap".

- **Penyederhanaan Kartu**: Baris atas berisi Judul Lagu + Tombol Hapus (jika lagu > 1). Baris bawah berisi `STATUS • KEY • BPM • TANGGAL`.
- **Navigasi Smart Tab Lirik**:
  - Berada di Editor Lirik ➔ Klik Tab Lain (Teori/Bank/Alat) ➔ Klik Tab Lirik lagi ➔ **Kembali ke Editor Lirik** (bukan ke daftar).
  - Berada di Editor Lirik ➔ Klik Tab Lirik lagi ➔ **Beralih ke Daftar Lirik**.

---

## 1. User Experience & Visual Design

### Tampilan Baru Kartu Lirik (`LyricListView.tsx`)
- **Struktur Kartu Minimalis (2 Baris)**:
  - **Baris Atas**: Judul lagu (dengan kecenderungan teks tebal, hover underline) + Tombol hapus ikon sampah (`Trash2`) di pojok kanan atas.
  - **Baris Bawah**:
    - Badge status berwarna kecil (`DRAFT` / `PROSES` / `RELEASE`).
    - Pembatas berupa titik pemisah (`•`).
    - Informasi Nada Dasar (`Key C`).
    - Tempo (`120 BPM`).
    - Tanggal pembaruan tanpa jam (`24 OKT 2026`).
- **Pembersihan Elemen**: Menghapus kutipan teks lirik (*excerpt*) dan strip footer tombol "Buka di Editor TipTap →" agar kartu sangat bersih, fokus, dan padat informasi mendasar.

```
┌─────────────────────────────────────────────────────────┐
│ Senja di Pelataran                                [ 🗑 ] │
│                                                         │
│ [ DRAFT ]  •  Key C  •  120 BPM  •  24 OKT 2026         │
└─────────────────────────────────────────────────────────┘
```

---

## 2. Technical Architecture & Navigation Strategy

### Alur Kerja Navigasi Smart Tab Lirik

```
┌───────────────────────────────────────────────────────────────────┐
│                      Pengguna Klik Tab Lirik                      │
└───────────────────────────────────────────────────────────────────┘
                                  │
         ┌────────────────────────┴────────────────────────┐
         ▼                                                 ▼
[ Posisi Saat Ini: Editor ]                    [ Posisi Saat Ini: Tab Lain ]
         │                                                 │
         ▼                                                 ▼
Navigasi ke `#lyrics`                           Ada lagu editor aktif sebelumnya?
(Kembali ke List Lirik)                                    │
                                                ┌──────────┴──────────┐
                                                ▼                     ▼
                                             [ Ya ]                [ Tidak ]
                                                │                     │
                                                ▼                     ▼
                                    Navigasi ke Editor       Navigasi ke `#lyrics`
                                    `#lyrics/editor/:id`     (Tampilan List Lirik)
```

### Penyesuaian State & Hook
- **State `lastActiveSongId`**: Menyimpan ID lagu terakhir yang sedang dibuka di editor lirik (`#lyrics/editor/:songId`).
- **Penanganan `handleSelectTab('lyrics')`** di `App.tsx`:
  - Jika `route.tab === 'lyrics'` dan `route.subView === 'editor'`: Navigasi ke `#lyrics` (kembali ke list lirik).
  - Jika `route.tab !== 'lyrics'`:
    - Jika ada `lastActiveSongId` dan lagu masih ada di daftar `songs`: Navigasi ke `#lyrics/editor/${lastActiveSongId}`.
    - Jika tidak ada: Navigasi ke `#lyrics`.

---

## 3. Plan Execution Steps

1. **Update `LyricListView.tsx`**:
   - Format tanggal dengan `toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }).toUpperCase()`.
   - Perbarui helper `getStatusBadge` menjadi badge berwarna ringkas (`DRAFT`, `PROSES`, `RELEASE`).
   - Ubah layout item kartu menjadi 2 baris (Baris Atas: Judul + Tombol Hapus; Baris Bawah: Status • Key • BPM • Tanggal).
   - Hapus kutipan lirik dan tombol "Buka di Editor TipTap".

2. **Update Navigasi Tab di `App.tsx`**:
   - Tambahkan state/memory `lastActiveSongId`.
   - Perbarui `useEffect` untuk memperbarui `lastActiveSongId` setiap kali route berada di `#lyrics/editor/:songId`.
   - Perbarui `handleSelectTab` untuk menangani logika pintar penyesuaian tab lirik.

3. **Verifikasi Build**:
   - Jalankan `compile_applet` & `lint_applet` untuk memastikan tidak ada kesalahan TypeScript/React.
