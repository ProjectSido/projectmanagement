# 🚀 Panduan Setup Database Supabase untuk Kanban Board

Dokumen ini menjelaskan langkah-langkah lengkap untuk mengatur database Supabase dan mengisi data dummy untuk project Kanban Board.

---

## 📋 Daftar Isi

1. [Prasyarat](#prasyarat)
2. [Langkah 1: Membuat Project Supabase](#langkah-1-membuat-project-supabase)
3. [Langkah 2: Menjalankan Skema Database](#langkah-2-menjalankan-skema-database)
4. [Langkah 3: Membuat User Test](#langkah-3-membuat-user-test)
5. [Langkah 4: Menambahkan Data Dummy](#langkah-4-menambahkan-data-dummy)
6. [Langkah 5: Konfigurasi Environment](#langkah-5-konfigurasi-environment)
7. [Verifikasi Database](#verifikasi-database)
8. [Troubleshooting](#troubleshooting)

---

## Prasyarat

- ✅ Akun Supabase (gratis di [supabase.com](https://supabase.com))
- ✅ Project Kanban Board sudah di-clone/download
- ✅ File `supabase-schema.sql` dan `supabase-dummy-data.sql` tersedia

---

## Langkah 1: Membuat Project Supabase

1. **Login ke Supabase Dashboard**
   - Buka [https://supabase.com/dashboard](https://supabase.com/dashboard)
   - Login dengan akun Anda

2. **Buat Project Baru**
   - Klik tombol **"New Project"**
   - Isi informasi project:
     - **Name:** `kanban-board` (atau nama lain sesuai keinginan)
     - **Database Password:** Buat password yang kuat dan **SIMPAN** password ini!
     - **Region:** Pilih region terdekat dengan lokasi Anda (misal: Southeast Asia - Singapore)
   - Klik **"Create new project"**
   
3. **Tunggu Setup Selesai**
   - Proses setup membutuhkan waktu 1-2 menit
   - Tunggu hingga status project berubah menjadi **"Active"**

---

## Langkah 2: Menjalankan Skema Database

### 2.1 Buka SQL Editor

1. Di Supabase Dashboard, pada sidebar kiri, klik **"SQL Editor"**
2. Klik **"New Query"** untuk membuat query baru

### 2.2 Jalankan Schema

1. **Copy seluruh isi file** `supabase-schema.sql`
2. **Paste** ke SQL Editor
3. Klik tombol **"Run"** (atau tekan `Ctrl + Enter`)
4. Tunggu hingga query selesai dijalankan

### 2.3 Verifikasi Schema

Query akan membuat:
- ✅ 5 tabel: `profiles`, `boards`, `columns`, `tasks`, `board_members`
- ✅ Row Level Security (RLS) policies
- ✅ Triggers untuk auto-update timestamps
- ✅ Function helper untuk membuat board dengan columns default

Untuk verifikasi, klik **"Table Editor"** di sidebar dan pastikan semua tabel sudah ada.

---

## Langkah 3: Membuat User Test

Sebelum menambahkan data dummy, kita perlu membuat user test terlebih dahulu.

### 3.1 Buat User Melalui Authentication

1. Di sidebar, klik **"Authentication"** → **"Users"**
2. Klik tombol **"Add User"** → **"Create new user"**
3. Buat 3 user berikut:

   **User 1:**
   - Email: `john@example.com`
   - Password: `password123`
   - Auto Confirm User: ✅ (centang)
   
   **User 2:**
   - Email: `jane@example.com`
   - Password: `password123`
   - Auto Confirm User: ✅ (centang)
   
   **User 3:**
   - Email: `bob@example.com`
   - Password: `password123`
   - Auto Confirm User: ✅ (centang)

4. Klik **"Create User"** untuk setiap user

### 3.2 Verifikasi Profile Auto-Created

Setelah user dibuat, profile akan otomatis dibuat oleh trigger:

```sql
SELECT id, email, full_name FROM public.profiles;
```

Jalankan query di atas di SQL Editor untuk memastikan profiles sudah dibuat.

---

## Langkah 4: Menambahkan Data Dummy

### 4.1 Jalankan Dummy Data

1. Buka **SQL Editor** lagi
2. Klik **"New Query"**
3. **Copy seluruh isi file** `supabase-dummy-data.sql`
4. **Paste** ke SQL Editor
5. Klik **"Run"** (atau tekan `Ctrl + Enter`)

### 4.2 Apa yang Akan Dibuat?

Data dummy akan membuat:

#### 📊 **3 Boards:**
1. **Website Redesign Project** (Owner: john@example.com)
   - 5 columns: Backlog, To Do, In Progress, Review, Done
   - 9 tasks dengan berbagai priority dan labels
   
2. **Mobile App Development** (Owner: jane@example.com)
   - 4 columns: To Do, In Progress, Testing, Done
   - 8 tasks untuk development mobile app
   
3. **Marketing Campaign Q1 2024** (Owner: john@example.com)
   - 4 columns: Ideas, Planning, Execution, Completed
   - 7 tasks untuk campaign marketing

#### 👥 **Board Members:**
- Website Redesign: john (owner), jane (admin), bob (member)
- Mobile App: jane (owner), bob (member)
- Marketing Campaign: john (owner)

#### 🏷️ **Task Features:**
- ✅ Priority levels: low, medium, high, urgent
- ✅ Due dates (berbasis waktu relatif)
- ✅ Labels (tags) untuk kategorisasi
- ✅ Descriptions yang detail

---

## Langkah 5: Konfigurasi Environment

### 5.1 Dapatkan Credentials Supabase

1. Di Supabase Dashboard, klik **"Settings"** (ikon gear di sidebar)
2. Klik **"API"**
3. **Copy** nilai berikut:
   - **Project URL**: `https://xxxxxxxxxxxxx.supabase.co`
   - **anon/public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### 5.2 Update Environment Variables

1. Buat file `.env.local` di root project (jika belum ada)
2. Tambahkan konfigurasi berikut:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

3. **Ganti** dengan nilai yang Anda copy dari Supabase Dashboard
4. **Restart** development server:

```bash
# Stop server yang sedang running (Ctrl + C)
# Lalu jalankan lagi:
npm run dev
```

---

## Verifikasi Database

Jalankan query berikut di SQL Editor untuk memverifikasi data:

### 1. Cek Semua Boards

```sql
SELECT 
    b.name, 
    p.email as owner_email, 
    b.description,
    b.created_at 
FROM public.boards b 
JOIN public.profiles p ON b.user_id = p.id 
ORDER BY b.created_at DESC;
```

**Expected Result:** 3 boards

### 2. Cek Columns per Board

```sql
SELECT 
    b.name as board, 
    c.title as column, 
    c.position,
    c.color
FROM public.columns c 
JOIN public.boards b ON c.board_id = b.id 
ORDER BY b.name, c.position;
```

**Expected Result:** 13 columns total (5 + 4 + 4)

### 3. Cek Task Count per Column

```sql
SELECT 
    b.name as board, 
    c.title as column, 
    COUNT(t.id) as task_count 
FROM public.columns c 
LEFT JOIN public.tasks t ON c.id = t.column_id 
JOIN public.boards b ON c.board_id = b.id 
GROUP BY b.name, c.title, c.position 
ORDER BY b.name, c.position;
```

**Expected Result:** Distribution tasks across columns

### 4. Cek Board Members & Roles

```sql
SELECT 
    b.name as board, 
    p.email as member, 
    bm.role 
FROM public.board_members bm 
JOIN public.boards b ON bm.board_id = b.id 
JOIN public.profiles p ON bm.user_id = p.id 
ORDER BY b.name, bm.role;
```

**Expected Result:** 6 memberships total

### 5. Cek Tasks dengan Priority

```sql
SELECT 
    b.name as board,
    c.title as column,
    t.title as task,
    t.priority,
    t.labels,
    t.due_date
FROM public.tasks t
JOIN public.columns c ON t.column_id = c.id
JOIN public.boards b ON c.board_id = b.id
ORDER BY b.name, c.position, t.position;
```

---

## Troubleshooting

### ❌ Error: "relation already exists"

**Masalah:** Tabel sudah ada dari run sebelumnya.

**Solusi:**
1. Jika ingin reset database, jalankan query berikut terlebih dahulu:

```sql
-- DROP semua tabel (HATI-HATI: Akan menghapus semua data!)
DROP TABLE IF EXISTS public.board_members CASCADE;
DROP TABLE IF EXISTS public.tasks CASCADE;
DROP TABLE IF EXISTS public.columns CASCADE;
DROP TABLE IF EXISTS public.boards CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- DROP functions dan triggers
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS create_board_with_columns(VARCHAR, TEXT, VARCHAR) CASCADE;
```

2. Lalu jalankan lagi `supabase-schema.sql`

### ❌ Error: "violates foreign key constraint"

**Masalah:** User belum dibuat atau ID tidak cocok.

**Solusi:**
1. Pastikan sudah membuat user di Authentication
2. Verifikasi user ID:

```sql
SELECT id, email FROM auth.users;
```

### ❌ Error: RLS policy blocks insert

**Masalah:** Row Level Security memblokir insert dari SQL Editor.

**Solusi:** 
Query dummy data sudah menggunakan subquery untuk mendapatkan user_id yang benar, tapi jika masih error, coba:

```sql
-- Temporary disable RLS (UNTUK DEVELOPMENT SAJA!)
ALTER TABLE public.boards DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.columns DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.board_members DISABLE ROW LEVEL SECURITY;

-- Jalankan dummy data
-- ...

-- Enable RLS kembali
ALTER TABLE public.boards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.columns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.board_members ENABLE ROW LEVEL SECURITY;
```

### 🔑 Lupa Database Password

Jika lupa password database:
1. Di Supabase Dashboard → Settings → Database
2. Klik **"Reset Database Password"**
3. Masukkan password baru
4. **PENTING:** Koneksi direct database akan terputus, tapi API tetap berfungsi

---

## 🎉 Selesai!

Jika semua langkah di atas berhasil, Anda sekarang memiliki:

- ✅ Database schema yang lengkap dengan RLS
- ✅ 3 user test (john, jane, bob)
- ✅ 3 sample boards dengan columns
- ✅ 24 tasks dengan realistic data
- ✅ Board collaboration setup

### Next Steps:

1. **Test Login:** Buka aplikasi dan login dengan salah satu user:
   - Email: `john@example.com`
   - Password: `password123`

2. **Explore Features:**
   - Lihat boards yang tersedia
   - Drag & drop tasks antar columns
   - Add/edit/delete tasks
   - Manage board members

3. **Development:**
   - Mulai develop fitur baru
   - Test dengan data dummy yang sudah ada
   - Deploy ke production saat siap

---

## 📚 Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Next.js + Supabase Guide](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)

---

**Happy Coding! 🚀**

Jika ada pertanyaan atau issue, silakan buat issue di repository atau hubungi maintainer.
