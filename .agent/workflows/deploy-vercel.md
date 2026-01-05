---
description: Deploy Kanban Board ke Vercel dengan Supabase
---

# Deployment Kanban Board ke Vercel

## Prerequisites
- Akun Supabase (https://supabase.com)
- Akun Vercel (https://vercel.com)
- Git repository (GitHub/GitLab/Bitbucket)

## Step 1: Setup Supabase Database

1. Buka https://supabase.com dan login/register
2. Klik "New Project" dan isi detailnya:
   - Organization: Pilih atau buat baru
   - Project Name: `kanban-project`
   - Database Password: Catat password ini
   - Region: Pilih yang terdekat (Singapore untuk Indonesia)
3. Tunggu project selesai dibuat (~2 menit)

// turbo
4. Buka SQL Editor (ikon database di sidebar kiri)
5. Copy dan paste konten dari `supabase-schema.sql` ke editor
6. Klik "Run" untuk membuat tables

7. Buka Settings > API (di sidebar kiri)
8. Catat nilai berikut:
   - Project URL: `https://xxx.supabase.co`
   - anon public key: `eyJxxxxxx...`

## Step 2: Setup Environment Variables Lokal

1. Buat file `.env.local` di root project:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

2. Test lokal dengan:
```bash
npm run dev
```

## Step 3: Push ke GitHub

// turbo
1. Inisialisasi git (jika belum):
```bash
git init
git add .
git commit -m "Initial commit: Kanban Board"
```

2. Buat repository baru di GitHub
3. Push code:
```bash
git remote add origin https://github.com/username/kanban-project.git
git branch -M main
git push -u origin main
```

## Step 4: Deploy ke Vercel

### Via Dashboard
1. Buka https://vercel.com dan login
2. Klik "Add New" > "Project"
3. Import repository dari GitHub
4. Di section "Environment Variables", tambahkan:
   - `NEXT_PUBLIC_SUPABASE_URL` = (Project URL dari Supabase)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = (anon key dari Supabase)
5. Klik "Deploy"
6. Tunggu deployment selesai (~1-2 menit)

### Via CLI
// turbo
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy dengan wizard
vercel

# Untuk production
vercel --prod
```

## Step 5: Konfigurasi Domain (Optional)

1. Di Vercel Dashboard, buka project
2. Klik "Settings" > "Domains"
3. Tambahkan custom domain jika ada

## Troubleshooting

### Error: "Please set the NEXT_PUBLIC_SUPABASE_URL..."
- Pastikan environment variables sudah diset di Vercel
- Redeploy setelah menambah environment variables

### Tasks tidak tersimpan
- Pastikan SQL schema sudah dijalankan di Supabase
- Cek RLS policies sudah aktif
- Periksa anon key benar

### Build error di Vercel
- Cek log build di Vercel Dashboard
- Pastikan semua dependencies terinstall
