# FALS — Integrasi Native History, URL Hash Routing & Scroll Retention

Implementasi sistem navigasi berbasis riwayat native (*Native-Like History & Gesture Back Handling*) dengan sinkronisasi URL hash (`#lyrics`, `#lyrics/editor/:id`, `#learn/deep/:id`, `#bank/editor/:id`), perlindungan dari keluar aplikasi tidak sengaja, dan pemulihan posisi gulir (*scroll retention*) agar musisi tidak kehilangan posisi baca saat berpindah antara daftar dan editor.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> **Keputusan Arsitektur & Alur Navigasi Terkonfirmasi:**
> 1. **Sinkronisasi URL Hash Dinamis**:
>    - `#learn` ➔ Halaman utama Ringkasan Teori (Home default).
>    - `#learn/deep/:themeId` ➔ Halaman materi mendalam tema teori (misal `#learn/deep/fondasi`).
>    - `#lyrics` ➔ Halaman Galeri Daftar Lirik Lagu.
>    - `#lyrics/editor/:songId` ➔ Halaman Editor Lirik TipTap Penuh.
>    - `#bank` ➔ Halaman Galeri Bank Bar & Rima.
>    - `#bank/editor/:barId` (atau `new`) ➔ Halaman Editor Bar Penuh.
>    - `#tools` ➔ Halaman Alat Musisi (Metronom, Chord/Scale Explorer).
> 2. **Perilaku Native Gesture Back (Browser & Smartphone Swipe)**:
>    - **Di dalam Editor**: Menggeser *gesture back* atau menekan tombol back di browser akan mengembalikan pengguna ke halaman daftar yang bersangkutan (misal dari `#lyrics/editor/1` kembali ke `#lyrics`), **BUKAN keluar dari aplikasi**.
>    - **Di Halaman Awal Daftar**: Jika pengguna berada di `#lyrics`, `#bank`, atau `#tools` lalu menekan back, aplikasi akan kembali ke tab `#learn` (Tab Teori Utama) terlebih dahulu sebelum menutup aplikasi.
>    - **Di Jendela Modal**: Jika modal Bank Bar picker sedang terbuka, tombol back akan menutup modal terlebih dahulu.
> 3. **Scroll Retention Otomatis**:
>    - Posisi gulir layar (`window.scrollY`) dicatat otomatis saat pengguna mengklik kartu.
>    - Ketika kembali dari editor atau modul mendalam ke daftar utama, posisi gulir dipulihkan secara instan sehingga musisi tidak perlu menggulir ulang dari atas.

---

## 1. Overview & Core Concept

- **Masalah yang Diselesaikan**: Pada web app / PWA standar, menekan tombol kembali seringkali langsung mengarahkan browser ke halaman luar atau menutup aplikasi. FALS kini berperilaku persis seperti aplikasi native iOS dan Android: tombol kembali mengendalikan tumpukan navigasi internal (*history stack*).
- **Nilai Bagi Musisi**: Menulis lirik dan ide bar di ponsel menjadi jauh lebih aman dan nyaman; gestur usap kembali (*swipe back*) alami mengembalikan layar ke galeri draf lagu tanpa risiko kehilangan fokus atau posisi scroll.

---

## 2. User Experience & Visual Design

### Peta Navigasi & History Stack
```
[ #learn (Root Default) ] ◄────────────────────────────────────────┐
   │                                                               │
   ├── (Klik Kartu Tema "Pelajari Lebih Dalam")                    │ (Gesture Back
   │    └──► [ #learn/deep/:themeId ]                              │  dari tab daftar
   │          └── (Gesture Back) ──► Kembali ke #learn             │  kembali ke #learn)
   │                                                               │
   ├── (Pilih Tab Lirik) ──► [ #lyrics (Daftar Lirik) ] ───────────┤
   │                           │                                   │
   │                           └── (Klik Lagu / Tulis Baru)        │
   │                                └──► [ #lyrics/editor/:songId ]│
   │                                      └── (Gesture Back) ──► Kembali ke #lyrics
   │                                                               │
   ├── (Pilih Tab Bank Bar) ─► [ #bank (Daftar Bar) ] ─────────────┤
   │                             │                                 │
   │                             └── (Klik Bar / Catat Baru)       │
   │                                  └──► [ #bank/editor/:barId ] │
   │                                        └── (Gesture Back) ──► Kembali ke #bank
   │                                                               │
   └── (Pilih Tab Alat) ─────► [ #tools ] ─────────────────────────┘
```

### Visual Identity & Feedback
- Tidak ada elemen visual baru yang mengganggu; estetika *paper minimalist* putih gading (`#FAF9F5`) dan tinta arang (`#1C1917`) tetap murni.
- Transisi halaman dan pemulihan scroll terjadi secara halus dan tanpa kedipan layar (*zero flickering*).

---

## 3. Key Product Decisions & Trade-Offs

1. **Hash-Based Routing (`window.location.hash`)**:
   - *Pilihan*: Menggunakan URL hash (`#lyrics`, `#lyrics/editor/:id`) dengan `window.history.pushState` dan pendengar event `popstate`.
   - *Alasan*: Kompatibel 100% dengan lingkungan dev preview AI Studio dan static hosting tanpa memerlukan konfigurasi rewrite server Nginx/Express yang rumit. Deep link juga dapat di-bookmark secara langsung.
2. **Scroll Memory Manager**:
   - *Pilihan*: Menyimpan koordinat vertikal `window.scrollY` di dalam memori React ref yang dipetakan ke rute sebelumnya (`scrollMemory.current[route]`).
   - *Alasan*: Sangat ringan, tidak membebani memori LocalStorage, dan dipulihkan via `requestAnimationFrame` saat transisi `popstate` terjadi.
3. **Modal History Interception**:
   - *Pilihan*: Mendaftarkan hash khusus saat modal terbuka (misal `#modal-picker`) sehingga gestur back di ponsel menutup modal terlebih dahulu sebelum berpindah halaman.

---

## 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                   Sistem Navigasi & History FALS                       │
│                                                                        │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                    useAppNavigation Hook                         │  │
│  │  - route: ParsedRoute (tab, subView, itemId)                     │  │
│  │  - pushRoute(newHash): pushState + simpan scrollY rute aktif     │  │
│  │  - popstate Event Listener: sinkronisasi state + restore scroll  │  │
│  │  - scrollMemory: Map<string, number>                             │  │
│  └──────────────────────────────────┬───────────────────────────────┘  │
│                                     │                                  │
│                                     ▼                                  │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                        App.tsx Root                              │  │
│  │  - currentTab sinkron dengan route.tab                           │  │
│  │  - isLyricEditorOpen sinkron dengan (route.subView === 'editor') │  │
│  │  - isDeepDiveOpen sinkron dengan (route.subView === 'deep')      │  │
│  │  - isBarEditorOpen sinkron dengan (route.subView === 'editor')   │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Rencana Langkah Eksekusi (Implementation Steps)

1. **Pembuatan Hook Navigasi (`src/hooks/useAppNavigation.ts`)**:
   - Parse `window.location.hash` menjadi objek rute terstruktur (`tab`, `subView`, `id`).
   - Sediakan fungsi `navigate(targetHash, preserveScroll = false)` menggunakan `window.history.pushState`.
   - Tangani event `popstate` untuk memicu pembaruan state dan pemulihan `window.scrollTo` ke posisi semula.
   - Atur default ke `#learn` jika hash kosong.
2. **Pembaruan `src/App.tsx`**:
   - Hubungkan state tab dan sub-view (`isLyricEditorOpen`, `isDeepDiveOpen`, `editingBar`) dengan `useAppNavigation`.
   - Atur agar tombol back pada kartu/header memanggil `navigateBack()` atau `pushRoute()` yang sinkron dengan riwayat browser.
3. **Pembaruan Komponen Teori, Lirik, dan Bank Bar**:
   - Pastikan klik kartu lagu di `LyricListView` melakukan push hash `#lyrics/editor/:songId`.
   - Pastikan klik "Pelajari Lebih Dalam" di `TheoryLearnView` melakukan push hash `#learn/deep/:themeId`.
   - Pastikan klik kartu bar di `BankBar` melakukan push hash `#bank/editor/:barId`.
4. **Verifikasi & Build Test**:
   - Jalankan `compile_applet` dan `lint_applet`.
   - Uji penekanan tombol back browser dan gesture back di berbagai kedalaman halaman untuk memastikan aplikasi tidak keluar secara prematur.
