# 🔧 Setup Environment Variables di Vercel

## Masalah
Build Vercel gagal dengan error:
```
❌ Missing Supabase Credentials!
Error: @supabase/ssr: Your project's URL and API key are required to create a Supabase client!
```

## Solusi

### 1️⃣ Dapatkan Supabase Credentials

1. Buka [Supabase Dashboard](https://supabase.com/dashboard)
2. Pilih project Anda
3. Buka **Settings** → **API**
4. Copy:
   - **Project URL** (contoh: `https://xxxxx.supabase.co`)
   - **anon public key** (mulai dengan `eyJh...`)

### 2️⃣ Tambahkan ke Vercel

#### Via Vercel Dashboard (Recommended):

1. Buka [Vercel Dashboard](https://vercel.com/dashboard)
2. Pilih project **projectmanagement**
3. Klik **Settings** → **Environment Variables**
4. Tambahkan 2 environment variables berikut:

| Name | Value | Environments |
|------|-------|--------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxxxx.supabase.co` | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGc...` | Production, Preview, Development |

5. Klik **Save**

#### Via Vercel CLI:

```bash
# Install Vercel CLI jika belum
npm i -g vercel

# Login ke Vercel
vercel login

# Link project
vercel link

# Tambahkan environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL
# Paste URL Supabase saat diminta

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
# Paste anon key saat diminta
```

### 3️⃣ Redeploy

Setelah menambahkan environment variables:

**Option A - Trigger otomatis:**
```bash
git commit --allow-empty -m "trigger redeploy"
git push origin main
```

**Option B - Manual di Vercel:**
1. Buka Vercel Dashboard → Deployments
2. Klik **⋯** (three dots) pada deployment terakhir
3. Klik **Redeploy**

---

## 📝 Checklist

- [ ] Sudah copy Supabase URL
- [ ] Sudah copy Supabase anon key
- [ ] Sudah tambahkan environment variables di Vercel
- [ ] Sudah trigger redeploy
- [ ] Build berhasil ✅

---

## 🔍 Verifikasi

Setelah deployment selesai, cek:
1. Build log tidak ada error "Missing Supabase Credentials"
2. Aplikasi bisa diakses
3. Login/Register berfungsi

---

## 🚨 Troubleshooting

**Q: Build masih gagal dengan error yang sama?**
- Pastikan environment variables sudah disave
- Pastikan pilih semua environments (Production, Preview, Development)
- Coba redeploy lagi

**Q: Aplikasi tidak bisa connect ke Supabase?**
- Pastikan URL dan key benar (tidak ada spasi/typo)
- Pastikan menggunakan **anon public key**, bukan service role key
- Cek Supabase project masih aktif

**Q: Error "Invalid API key"?**
- Regenerate anon key di Supabase Dashboard
- Update environment variables di Vercel dengan key yang baru
