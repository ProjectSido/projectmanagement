# ⚠️ CARA MEMBUAT TEST USERS DI SUPABASE

## Error Yang Anda Alami:
```
null value in column "user_id" of relation "boards" violates not-null constraint
```

**Penyebab:** User `john@example.com`, `jane@example.com`, dan `bob@example.com` belum dibuat di Supabase Authentication!

---

## ✅ SOLUSI: Buat Users Dulu!

### Langkah-langkah:

1. **Buka Supabase Dashboard**
   - Login ke: https://supabase.com/dashboard
   - Pilih project Kanban Board Anda

2. **Masuk ke Authentication**
   - Di sidebar kiri, klik **"Authentication"**
   - Klik tab **"Users"**

3. **Buat 3 Test Users** (Klik "Add User" 3x)

#### User 1:
- Klik **"Add User"** → **"Create new user"**
- **Email:** `john@example.com`
- **Password:** `password123`
- **Auto Confirm User:** ✅ **CENTANG INI!** (Penting!)
- Klik **"Create User"**

#### User 2:
- Klik **"Add User"** → **"Create new user"**
- **Email:** `jane@example.com`
- **Password:** `password123`
- **Auto Confirm User:** ✅ **CENTANG!**
- Klik **"Create User"**

#### User 3:
- Klik **"Add User"** → **"Create new user"**
- **Email:** `bob@example.com`
- **Password:** `password123`
- **Auto Confirm User:** ✅ **CENTANG!**
- Klik **"Create User"**

4. **Verifikasi Users Sudah Dibuat**
   - Anda harus melihat 3 users di list
   - Status: **Confirmed** (hijau)

5. **Jalankan Dummy Data SQL Lagi**
   - Buka **SQL Editor** di Supabase
   - Klik **"New Query"**
   - Copy semua isi file `supabase-dummy-data.sql`
   - Paste & Run
   - Sekarang seharusnya **BERHASIL!** ✅

---

## 🎯 Setelah Users Dibuat:

Anda akan melihat pesan seperti ini saat run SQL:

```
NOTICE: ✅ Found 3 test user(s)
NOTICE: 📊 Proceeding with dummy data insertion...
```

Lalu data dummy akan berhasil diinsert!

---

## 🧪 Test Login:

Setelah semua selesai, test login di aplikasi:

```
Email: john@example.com
Password: password123
```

Anda akan melihat 2 boards (Website Redesign & Marketing Campaign)

---

## 💡 Catatan Penting:

- ✅ **Auto Confirm User** harus dicentang agar user langsung aktif
- ✅ Password minimal 6 karakter (`password123` sudah cukup)  
- ✅ Jangan lupa enable Email Provider di Authentication > Providers
- ✅ Buat users SEBELUM run dummy data SQL

---

❓ **Masih Error?**

Cek di SQL Editor, jalankan query ini:

```sql
SELECT id, email, confirmed_at 
FROM auth.users 
WHERE email IN ('john@example.com', 'jane@example.com', 'bob@example.com');
```

Kalau hasilnya kosong (0 rows) → berarti users belum dibuat!
