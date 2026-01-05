# 🚀 Quick Start: Membuat Users & Data Dummy

## ⚡ Cara Tercepat (2 Langkah)

### **Langkah 1: Buat Test Users**

1. Buka **Supabase Dashboard** → **SQL Editor**
2. Klik **"New Query"**
3. Copy **seluruh isi** file `create-test-users.sql`
4. Paste & klik **"Run"**
5. ✅ Anda akan melihat pesan sukses dengan 3 users dibuat

### **Langkah 2: Isi Data Dummy**

1. Masih di **SQL Editor**, klik **"New Query"** lagi
2. Copy **seluruh isi** file `supabase-dummy-data.sql`
3. Paste & klik **"Run"**
4. ✅ Data dummy (boards, columns, tasks) akan terisi otomatis

---

## 🔑 Credentials untuk Login

Setelah kedua script di atas dijalankan, gunakan salah satu akun ini untuk login:

```
Email: john@example.com
Password: password123
```

```
Email: jane@example.com
Password: password123
```

```
Email: bob@example.com
Password: password123
```

---

## 📊 Apa yang Dibuat?

### 👥 **3 Test Users:**
- John Doe (`john@example.com`)
- Jane Smith (`jane@example.com`)
- Bob Wilson (`bob@example.com`)

### 📋 **3 Boards:**
1. **Website Redesign Project** (Owner: John)
   - 5 columns, 9 tasks
2. **Mobile App Development** (Owner: Jane)
   - 4 columns, 8 tasks
3. **Marketing Campaign Q1 2024** (Owner: John)
   - 4 columns, 7 tasks

### ✨ **Total:**
- 3 Users
- 3 Boards
- 13 Columns
- 24 Tasks
- 6 Board Memberships

---

## ✅ Verifikasi

Jalankan query ini di SQL Editor untuk memastikan semua data berhasil:

```sql
-- Cek users
SELECT email, email_confirmed_at 
FROM auth.users 
WHERE email LIKE '%@example.com'
ORDER BY email;

-- Cek boards
SELECT b.name, p.email as owner 
FROM public.boards b 
JOIN public.profiles p ON b.user_id = p.id;

-- Cek total tasks
SELECT COUNT(*) as total_tasks FROM public.tasks;
```

---

## 🎯 Next Steps

1. **Test Login**: Buka aplikasi di browser dan login dengan `john@example.com`
2. **Explore**: Lihat boards, drag & drop tasks, edit data
3. **Develop**: Mulai develop fitur baru dengan data yang sudah tersedia

---

## ⚠️ Troubleshooting

### Error: "permission denied for schema auth"

**Solusi:** Pastikan Anda menjalankan query sebagai **database owner**. Di Supabase SQL Editor, ini seharusnya otomatis.

### Error: "function gen_salt does not exist"

**Solusi:** Extension `pgcrypto` belum aktif. Jalankan:

```sql
CREATE EXTENSION IF NOT EXISTS pgcrypto;
```

Lalu jalankan ulang `create-test-users.sql`.

### Users sudah ada (duplicate)

Tidak masalah! Script menggunakan `WHERE NOT EXISTS` jadi tidak akan duplikat. Users lama tetap aman.

---

**Happy Coding! 🚀**
