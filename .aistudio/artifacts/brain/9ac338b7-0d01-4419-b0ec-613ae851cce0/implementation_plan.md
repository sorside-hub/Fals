# Rencana Kerja: Tahap 2 - Sistem Versi Lirik (Multi-Version Lyric Drafting)

## Ringkasan Konsep & Sistem
Menambahkan fitur **Versi Lirik** pada setiap proyek lagu. Penulis lagu dapat membuat beberapa variasi/draf lirik (misal: *Versi 1 - Draf Awal*, *Versi 2 - Reff Alternatif*, *Versi 3 - Final*), berpindah versi secara instan di editor, serta menentukan satu versi sebagai **`★ Versi Final`**. Saat lagu diklik dari daftar lirik di halaman utama, aplikasi akan secara otomatis membuka Versi Final tersebut.

---

## Rincian Perubahan & Arsitektur

### 1. Struktur Tipe Data (`src/types/index.ts`)
- Membuat interface `LyricVersion`:
  ```ts
  export interface LyricVersion {
    id: string;
    name: string;
    content: string;
    isFinal: boolean;
    createdAt: number;
  }
  ```
- Menambahkan field `versions?: LyricVersion[];` dan `activeVersionId?: string;` pada `SongDraft`.

### 2. Inisialisasi Otomatis & Kompatibilitas Data Lama (`useSongs.ts`)
- **Lagu Baru**: Otomatis diawali dengan `Versi 1` yang ditandai `isFinal: true`.
- **Lagu Lama**: Lagu yang sudah ada akan otomatis dikonversi dengan membuatkan `Versi 1` bertanda `isFinal: true` berisi konten lirik lamanya.

### 3. UI Seksi Versi Lirik di Sidebar (`SongProjectDrawer.tsx`)
Di dalam Sidebar Kanan di bawah bagian **"2. Versi Lirik"**:
- **Daftar Versi Lirik**:
  - Menampilkan nama versi, tanggal/waktu, serta *badge* emas **`★ Final`**.
  - Menyorot versi yang sedang aktif diedit di kanvas TipTap.
- **Fitur & Tombol Kontrol**:
  - **`+ Buat Versi Baru`**: Pilihan *Duplikasi Versi Aktif* atau *Kanvas Kosong*.
  - **Tombol `Set Final`**: Menjadikan versi terpilih sebagai Versi Final dengan 1 klik.
  - **Ubah Nama Versi**: Mengubah nama versi (contoh: `"Versi 2 - Akustik"`).
  - **Hapus Versi**: Menghapus versi (dinonaktifkan jika tinggal 1 versi tersisa).

### 4. Integrasi dengan List Lirik Utama & Editor Canvas (`App.tsx` & `LyricEditor.tsx`)
- **Buka dari List Utama**: Saat lagu diklik di `LyricListView`, aplikasi membaca versi yang memiliki `isFinal: true` dan memuat kontennya ke editor.
- **Penyimpanan Real-Time**: Setiap ketikan atau perubahan akor di TipTap disimpan secara otomatis ke versi lirik yang sedang aktif.

---

## Verifikasi
- Menjalankan `lint_applet` dan `compile_applet`.
- Memastikan pembuatan versi baru, *switching* versi, dan penandaan Versi Final berfungsi sempurna.
