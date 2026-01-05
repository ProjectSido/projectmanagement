# Panduan Implementasi CI/CD Pipeline

Dokumen ini menjelaskan cara mengimplementasikan pipeline CI/CD (Continuous Integration / Continuous Deployment) yang benar dan modern untuk project Next.js Anda.

## Konsep Dasar

1.  **CI (Continuous Integration)**: Otomatisasi pemeriksaan kode setiap kali ada perubahan. Tujuannya adalah mencegah kode yang "rusak" atau tidak sesuai standar masuk ke repository.
    *   **Tools**: GitHub Actions
    *   **Checks**: Linting (ESLint), Type Checking (TypeScript), Build Verification.

2.  **CD (Continuous Deployment)**: Otomatisasi deployment aplikasi ke production setelah kode lolos tahap CI.
    *   **Tools**: Vercel Platform (Terintegrasi dengan GitHub)
    *   **Trigger**: Push ke branch `main`.

---

## 1. Setup Continuous Integration (CI)

Kami telah membuatkan file konfigurasi GitHub Actions di `.github/workflows/ci.yml`. Pipeline ini akan berjalan otomatis setiap kali Anda melakukan:
- Push ke branch `main`
- Membuat Pull Request ke `main`

### Apa yang dilakukan pipeline ini?
1.  **Checkout Code**: Mengambil kode terbaru.
2.  **Install Dependencies**: Menginstall package npm dengan bersih (`npm ci`).
3.  **Linting**: Menjalankan `npm run lint` untuk mengecek gaya penulisan kode dan potensi error.
4.  **Build & Type Check**: Menjalankan `npm run build`. Next.js secara otomatis melakukan pengecekan tipe TypeScript saat build. Jika build gagal, pipeline akan gagal.

### Cara Mengaktifkan:
Cukup push folder `.github` yang baru dibuat ke repository GitHub Anda.

```bash
git add .github
git commit -m "Add CI pipeline"
git push origin main
```

---

## 2. Setup Continuous Deployment (CD) dengan Vercel

Untuk Next.js, cara terbaik dan paling robust untuk CD adalah menggunakan integrasi native Vercel dengan GitHub.

### Langkah-langkah:

1.  **Push Code ke GitHub**: Pastikan project Anda sudah ada di GitHub.
2.  **Hubungkan Vercel ke GitHub**:
    - Buka Dashboard Vercel.
    - "Add New Project" -> "Import" dari GitHub Repository Anda.
3.  **Konfigurasi Project**:
    - Framework Preset: Next.js (Otomatis terdeteksi).
    - **Environment Variables**: Masukkan variable dari `.env.local` Anda:
        - `NEXT_PUBLIC_SUPABASE_URL`
        - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4.  **Deploy**: Klik Deploy.

### Workflow Otomatis:
Setelah terhubung:
1.  Anda membuat perubahan kode di lokal.
2.  Anda push ke branch baru (misal: `feature/tambah-fitur`).
3.  Anda buat **Pull Request (PR)** di GitHub.
4.  **GitHub Actions (CI)** akan berjalan untuk memverifikasi kode Anda (Lint & Build).
5.  **Vercel** akan otomatis membuat **Preview Deployment** (URL unik untuk testing fitur tersebut).
6.  Jika CI hijau (sukses) dan Preview aman, Anda merge PR ke `main`.
7.  **Vercel** mendeteksi perubahan di `main` dan otomatis deploy ke **Production**.

---

## 3. (Opsional) Pre-commit Hooks dengan Husky

Untuk mencegah commit kode yang error *sebelum* masuk ke GitHub, Anda bisa menggunakan Husky.

1.  Install Husky:
    ```bash
    npx husky-init && npm install
    ```
2.  Edit file `.husky/pre-commit` untuk menjalankan linting:
    ```bash
    npm run lint
    ```

Dengan ini, Anda tidak akan bisa melakukan commit jika ada error linting.
