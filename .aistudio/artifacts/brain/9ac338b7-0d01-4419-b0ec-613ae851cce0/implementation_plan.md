# Rencana Kerja: Penyempurnaan Header Editor Lirik & Kontinuitas Metronom

## Ringkasan Perubahan
Menyesuaikan estetika header editor lirik agar konsisten, simetris, dan bersih sesuai dengan umpan balik visual dari pengguna. Menghilangkan inner box pada nilai Key & BPM, menyamakan tinggi ketiga tombol control, membuat custom dropdown menu untuk Status, membuat modal BPM dapat ditutup dengan mengklik area backdrop luar, serta menjaga audio metronom tetap berputar di latar belakang meskipun modal BPM ditutup.

---

## Rincian Perbaikan

### 1. Desain Unboxed & Ukuran Simetris untuk Tombol Header (`LyricEditor.tsx`)
- **Penghapusan Inner Box**: Menghapus background box abu-abu kecil di dalam nilai Key dan BPM sehingga nilai langsung tampil sebagai teks tebal polos (`Key: Em ▾`, `BPM: 140 ▾`).
- **Konsistensi Tinggi & Padding**: Menyamakan tinggi (`h-8`) dan padding untuk tombol `Key`, `BPM`, dan `Status` baik di Desktop Header maupun Mobile Header.

### 2. Custom Popover Dropdown untuk Status Lagu
- **Penggantian Native `<select>` Browser**: Mengganti elemen `<select>` bawaan browser dengan custom popover dropdown buatan sendiri yang selaras dengan tema aplikasi.
- **Visual Status Badge**: Setiap opsi status (`Draft`, `Proses`, `Release`) dilengkapi indikator visual warna yang menarik.
- **Klik Luar untuk Menutup**: Popover otomatis menutup saat mengklik area di luar menu.

### 3. Penutupan Modal BPM via Backdrop & Audio Berkelanjutan
- **Backdrop Click**: Menambahkan listener `onClick={handleClose}` pada overlay latar belakang modal BPM (`BpmMetronomeModal.tsx`) sehingga modal dapat ditutup dengan mengklik area mana saja di luar modal.
- **Mendukung Background Playback**: Mengubah siklus `isPlaying` agar metronom **tetap memutar audio** di latar belakang ketika modal ditutup. Audio hanya akan berhenti apabila pengguna menekan tombol *Stop* secara eksplisit atau saat pengguna keluar dari lembar editor lirik (`LyricEditor` unmount).

---

## Verifikasi
- Menjalankan `lint_applet` dan `compile_applet`.
- Memastikan ketiga tombol di header terlihat simetris, rapi, dan konsisten secara estetika.
- Memastikan metronom tetap berjalan dengan suara stabil ketika modal BPM ditutup.
