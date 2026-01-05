# 🎯 Quick Start - Supabase Setup

Panduan cepat setup database Supabase untuk Kanban Board.

---

## 1️⃣ Buat Project Supabase

1. **Login:** [supabase.com/dashboard](https://supabase.com/dashboard)
2. **New Project** → Isi nama & password → **Create**
3. **Tunggu ~2 menit** hingga project ready

---

## 2️⃣ Jalankan Schema (SQL Editor)

```sql
-- Copy & paste seluruh isi file: supabase-schema.sql
-- Lalu klik Run
```

**Hasil:** 5 tabel dibuat (profiles, boards, columns, tasks, board_members)

---

## 3️⃣ Buat User Test (Authentication > Users)

Klik **Add User** → **Create new user** (3x):

| Email | Password | Auto Confirm |
|-------|----------|--------------|
| `john@example.com` | `password123` | ✅ |
| `jane@example.com` | `password123` | ✅ |
| `bob@example.com` | `password123` | ✅ |

---

## 4️⃣ Insert Dummy Data (SQL Editor)

```sql
-- Copy & paste seluruh isi file: supabase-dummy-data.sql
-- Lalu klik Run
```

**Hasil:**
- ✅ 3 Boards (Website Redesign, Mobile App, Marketing)
- ✅ 13 Columns total
- ✅ 24 Tasks dengan labels & priorities
- ✅ Board members & collaboration setup

---

## 5️⃣ Konfigurasi Environment

### Dapatkan Credentials:
**Settings** → **API** → Copy:
- `Project URL`
- `anon public key`

### Update `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Restart Server:

```bash
npm run dev
```

---

## ✅ Verifikasi Cepat

```sql
-- Cek boards
SELECT b.name, p.email as owner 
FROM boards b JOIN profiles p ON b.user_id = p.id;

-- Cek total tasks
SELECT COUNT(*) as total_tasks FROM tasks;

-- Cek board members
SELECT b.name as board, p.email as member, bm.role 
FROM board_members bm 
JOIN boards b ON bm.board_id = b.id 
JOIN profiles p ON bm.user_id = p.id;
```

**Expected:**
- 3 boards
- 24 tasks
- 6 memberships

---

## 🔧 Quick Reset (Jika Error)

```sql
DROP TABLE IF EXISTS board_members CASCADE;
DROP TABLE IF EXISTS tasks CASCADE;
DROP TABLE IF EXISTS columns CASCADE;
DROP TABLE IF EXISTS boards CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

DROP FUNCTION IF EXISTS handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS create_board_with_columns(VARCHAR, TEXT, VARCHAR) CASCADE;
```

Lalu jalankan lagi schema & dummy data.

---

## 🧪 Test Login

**Open app** → Login:
- Email: `john@example.com`
- Password: `password123`

**Expected:** Melihat 2 boards (Website Redesign & Marketing Campaign)

---

## 📊 Data Summary

### Boards:
1. **Website Redesign Project** (john)
   - Backlog → To Do → In Progress → Review → Done
   - 9 tasks total
   
2. **Mobile App Development** (jane) 
   - To Do → In Progress → Testing → Done
   - 8 tasks total
   
3. **Marketing Campaign Q1 2024** (john)
   - Ideas → Planning → Execution → Completed
   - 7 tasks total

### Access Rights:
- john: owner of Board 1 & 3
- jane: owner of Board 2, admin of Board 1
- bob: member of Board 1 & 2

---

**🎉 Done! Lihat** `SUPABASE_SETUP.md` **untuk detail lengkap & troubleshooting.**
