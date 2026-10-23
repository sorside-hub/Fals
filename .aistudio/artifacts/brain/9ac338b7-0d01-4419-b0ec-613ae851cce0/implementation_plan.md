# Popup Pemilih Nada Dasar (Key Selector) Interaktif & Standar Teori Musik

Menggantikan elemen dropdown `<select>` bawaan browser pada header editor lirik dengan komponen **Key Selector Popup** khusus yang intuitif, mendukung peralihan mode **Mayor / Minor**, tata letak grid **Circle of Fifths (4x3)** dengan penulisan notasi enharmonik standar musik (misal `Db` di mayor menjadi `C#m` di minor), serta kolom input manual untuk nada/akor kustom sesuai tema estetika FALS (*warm paper & charcoal*).

---

### User Review & Critical Decisions

> [!IMPORTANT]
> Keputusan desain yang telah dikonfirmasi oleh pengguna melalui tanya jawab:
> 1. **Susunan Grid**: Menggunakan format **Circle of Fifths** 4x3 sesuai gambar referensi (C, G, D, A / E, B, F#, Db / Ab, Eb, Bb, F).
> 2. **Interaksi Pemilihan**: Sekali sentuh/klik tombol nada langsung menerapkan nada ke lagu dan **otomatis menutup popup**.
> 3. **Input Kustom**: Kolom input manual *"Ketik key lain..."* dan tombol **OK** tetap disediakan untuk nada atau variasi akor khusus.
> 4. **Penulisan Notasi Standar**: Pada mode minor, nada otomatis menyesuaikan standar enharmonik teoritis musik (misal `Db` menjadi `C#m`, `Ab` menjadi `G#m`, dsb.).
> 5. **Gaya Visual**: Mengikuti bahasa visual FALS (*warm paper aesthetic* `#FAF9F5`, `#1C1917`, `#E5E4DE`), bukan dark UI flat bawaan screenshot.

---

### 1. Overview & Core Concept

- **Apa yang Dibangun**: Komponen baru `KeySelectorModal` (atau popover dialog) yang dipicu dari tombol nada dasar di header editor lirik (baik desktop maupun mobile).
- **Target Pengguna**: Penulis lirik & komposer musik yang membutuhkan pemilihan nada dasar secara cepat tanpa repot menggulir dropdown native, dengan notasi musik yang akurat dan jelas.
- **Nilai Tambah**: Mempermudah transposing dan pemilihan harmoni lagu dengan susunan Circle of Fifths yang musikal, serta menjaga editor lirik tetap bersih dan fokus.

---

### 2. User Experience & Visual Design

#### A. Alur Interaksi Pengguna (User Flow)
1. Pengguna melihat tombol nada dasar di header (contoh: `Key: C` atau `Key: Am`) dengan indikator badge rapi.
2. Pengguna mengklik tombol tersebut -> muncul popup `KeySelectorModal` dengan latar belakang backdrop halus (`bg-black/30 backdrop-blur-xs`).
3. Di dalam popup:
   - **Header**: Label *"PILIH NADA DASAR"* dan tab segmented control **Mayor** / **Minor**.
   - **Input Bar**: Field *"Ketik key lain..."* + tombol **OK**.
   - **Grid 4x3**: 12 tombol nada dasar yang responsif terhadap sentuhan jari jempol.
4. Saat pengguna mengklik salah satu tombol nada di grid:
   - Nada lagu langsung diperbarui (`onSelectKey(newKey)`).
   - Popup otomatis menutup dengan transisi halus.
5. Jika pengguna ingin mengetik nada di luar 12 tombol (contoh `F#m7`, `D/F#`, atau `Eb minor`):
   - Ketik di input, lalu tekan `Enter` atau tombol **OK** -> nada diterapkan dan popup menutup.

#### B. Pemetaan Enharmonik Nada Standar (Mayor vs Minor)
| Posisi Kolom | Baris 1 (Mayor / Minor) | Baris 2 (Mayor / Minor) | Baris 3 (Mayor / Minor) |
| :--- | :--- | :--- | :--- |
| **Kolom 1** | `C`  / `Cm` | `E`  / `Em` | `Ab` / `G#m` *(standar 5 kres)* |
| **Kolom 2** | `G`  / `Gm` | `B`  / `Bm` | `Eb` / `Ebm` |
| **Kolom 3** | `D`  / `Dm` | `F#` / `F#m` | `Bb` / `Bbm` |
| **Kolom 4** | `A`  / `Am` | `Db` / `C#m` *(sesuai request)* | `F`  / `Fm` |

#### C. Estetika & Desain Sesuai Tema FALS
- **Latar Modal**: `#FFFFFF` bersih dengan border tipis `#E5E4DE`, rounded sudut `rounded-2xl`, dan bayangan `shadow-2xl`.
- **Tombol Aktif (Selected Key)**: `#1C1917` (charcoal gelap) dengan teks putih `#FFFFFF` kontras tinggi.
- **Tombol Normal**: `#FAF9F5` (off-white hangat) dengan border `#E5E4DE`, teks `#1C1917`, dan efek hover/active `#F5F4EE`.
- **Segmented Control Mayor/Minor**: Kontainer kapsul halus dengan tombol aktif berwarna `#1C1917` (atau charcoal tint) dan tombol nonaktif berteks abu-abu hangat `#78716C`.
- **Ukuran Sentuhan**: Minimal 42px tinggi per kotak nada pada grid sehingga sangat nyaman dioperasikan oleh jempol di smartphone.

---

### 3. Key Product Decisions & Trade-Offs

- **Circle of Fifths vs Urutan Alfabet Kromatik**:
  - *Keputusan*: Circle of Fifths 4x3 (C, G, D, A, dst.).
  - *Alasan*: Pola ini merupakan standar industri workstation musik (DAW) dan mempermudah musisi melihat nada-nada yang bertetangga secara harmonik.
- **Otomatis Tutup vs Konfirmasi Tombol OK Terpisah pada Grid**:
  - *Keputusan*: 1 kali klik pada tombol grid langsung mengaplikasikan nada dan menutup popup. Tombol OK hanya berlaku untuk input teks manual.
  - *Alasan*: Mengurangi jumlah ketukan jari (*friction reduction*) dari 2 tap menjadi 1 tap.
- **Deteksi Otomatis Mode Mayor/Minor**:
  - Saat modal dibuka dengan lagu yang sudah bernada `Am` atau `C#m`, modal secara otomatis membuka tab **Minor** dan menyorot tombol `Am` / `C#m`. Jika lagunya `C` atau `G`, modal otomatis membuka tab **Mayor**.

---

### 4. Technical Architecture & Data Strategy

#### Diagram Komponen & Aliran Data

```
┌────────────────────────────────────────────────────────┐
│ LyricEditor.tsx (State: songKey)                       │
│                                                        │
│  [ Header Desktop / Mobile ]                           │
│  Trigger: <button onClick={() => setOpen(true)}>       │
│           Key: [C] ▾                                   │
│  </button>                                             │
└──────────────────────────┬─────────────────────────────┘
                           │ (isOpen, songKey, onSelectKey)
                           ▼
┌────────────────────────────────────────────────────────┐
│ KeySelectorModal.tsx                                   │
│                                                        │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Header: "PILIH NADA DASAR"   [ Mayor | Minor ]   │  │
│  └──────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Input: [Ketik key lain...        ] [ OK ]        │  │
│  └──────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Grid 4x3 (Circle of Fifths):                     │  │
│  │  [ C  ]  [ G  ]  [ D  ]  [ A  ]                  │  │
│  │  [ E  ]  [ B  ]  [ F# ]  [ Db/C#m ]              │  │
│  │  [ Ab/G#m ] [ Eb ] [ Bb ] [ F  ]                 │  │
│  └──────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────┘
```

#### Struktur & Logika File yang Akan Dibuat/Dimodifikasi:
1. **`/src/components/lyrics/KeySelectorModal.tsx`** *(Baru)*:
   - Komponen modal popover yang berisi logika pemetaan Circle of Fifths untuk Mayor dan Minor.
   - Deteksi mode awal berdasarkan akhiran `m` atau nama nada.
   - Penanganan input teks kustom dengan tombol OK dan tombol `Enter`.
   - Backdrop click outside & tombol Escape untuk menutup.
2. **`/src/components/LyricEditor.tsx`**:
   - Mengganti elemen `<select>` native pada Desktop Header dan Mobile Header dengan tombol pemicu `KeySelectorModal`.
   - Mengirimkan `songKey` aktif dan callback `handleKeyChange` ke `KeySelectorModal`.
3. **Verifikasi**:
   - Memastikan transisi dari `Db` di mayor ke `C#m` di minor konsisten.
   - Menjalankan `compile_applet` dan `lint_applet`.
