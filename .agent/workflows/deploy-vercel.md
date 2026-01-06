---
description: Deploy Kanban Board ke Vercel dengan Supabase
---

# Deploy ke Vercel - Complete Workflow

## 🎯 Tujuan
Deploy aplikasi Project Management ke Vercel dengan monitoring deployment status secara real-time via CLI.

## 📋 Prerequisites
- [x] Akun Vercel sudah dibuat
- [x] Repository GitHub sudah di-push
- [x] Supabase project sudah setup
- [x] Vercel CLI sudah terinstall globally

---

## 🚀 Deployment Steps

### Step 1: Login ke Vercel
```bash
vercel login
```
**Output yang diharapkan:** Browser akan terbuka untuk authenticate. Klik "Confirm" di browser.

---

### Step 2: Link Project ke Vercel
// turbo
```bash
vercel link
```
**Pilihan yang muncul:**
- Set up and deploy? → **Y** (Yes)
- Which scope? → Pilih username/org Anda
- Link to existing project? → **Y** (jika project sudah ada) atau **N** (untuk project baru)
- What's your project's name? → `projectmanagement`
- In which directory is your code located? → `./` (Enter)

**Output:** `.vercel` folder akan dibuat dengan config project.

---

### Step 3: Set Environment Variables
// turbo
```bash
# Set Supabase URL
vercel env add NEXT_PUBLIC_SUPABASE_URL

# Set Supabase Anon Key
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
```

**Untuk setiap command:**
- What's the value? → Paste dari Supabase Dashboard → Settings → API
- Add to environment? → Pilih **Production**, **Preview**, **Development** (tekan Space untuk select, Enter untuk confirm)

**Verifikasi:**
```bash
vercel env ls
```

---

### Step 4: Deploy ke Production
```bash
vercel --prod
```

**Process yang terjadi:**
1. ✅ Uploading source code
2. ✅ Installing dependencies
3. ✅ Building application
4. ✅ Deploying to Vercel CDN
5. ✅ Assigning production domain

**Output:** URL production (e.g., `https://projectmanagement.vercel.app`)

---

### Step 5: Monitor Deployment Status
```bash
# List semua deployments
vercel ls

# Inspect deployment tertentu
vercel inspect <deployment-url>

# View deployment logs
vercel logs <deployment-url>
```

---

## 🔍 Monitoring & Debugging

### Check Deployment Status
```bash
# Get list of recent deployments
vercel ls --limit 5

# Get detailed inspection
vercel inspect
```

### View Build Logs
```bash
# Real-time logs dari deployment terakhir
vercel logs

# Logs dari deployment spesifik
vercel logs <deployment-id>
```

### Check Environment Variables
```bash
# List semua env vars
vercel env ls

# Pull env vars ke .env.local
vercel env pull .env.local
```

---

## 🛠️ Troubleshooting Commands

### Build Failed
```bash
# Deploy dengan debug mode
vercel --debug

# Force rebuild tanpa cache
vercel --force
```

### Environment Variables Missing
```bash
# Cek env vars yang ada
vercel env ls

# Add missing env var
vercel env add VARIABLE_NAME
```

### Rollback ke Deployment Sebelumnya
```bash
# Promote deployment lama ke production
vercel promote <deployment-url>
```

---

## 🤖 AI Agent Best Practices

### 1. **Pre-Deployment Check**
```bash
# Cek status git
git status

# Cek branch
git branch --show-current

# Pastikan semua di-commit
git add .
git commit -m "feat: deploy to production"
git push origin main
```

### 2. **Deploy dengan Monitoring**
```bash
# Deploy dan simpan URL
vercel --prod > deployment_url.txt

# Extract URL dari output
$url = Get-Content deployment_url.txt | Select-String -Pattern "https://" | Select-Object -First 1

# Monitor status
vercel inspect $url
```

### 3. **Auto-Check Deployment Health**
```bash
# Wait for deployment to be ready
Start-Sleep -Seconds 30

# Test endpoint
curl https://projectmanagement.vercel.app/api/health

# Check Vercel logs for errors
vercel logs --limit 50
```

### 4. **Report Deployment Status**
Setelah deployment, AI agent harus:
1. ✅ Confirm deployment berhasil
2. 📊 Share deployment URL
3. 🔍 Report build time & size
4. ⚠️ Flag any warnings/errors dari logs
5. 🧪 Verify environment variables loaded correctly

---

## 📝 Quick Reference Commands

| Command | Purpose |
|---------|---------|
| `vercel` | Deploy to preview |
| `vercel --prod` | Deploy to production |
| `vercel ls` | List deployments |
| `vercel logs` | View deployment logs |
| `vercel env ls` | List environment variables |
| `vercel inspect` | Get deployment details |
| `vercel rollback` | Rollback deployment |
| `vercel domains` | Manage custom domains |

---

## 🎯 Success Criteria

Deployment sukses jika:
- [x] Build completed without errors
- [x] All environment variables loaded
- [x] Production URL accessible
- [x] No errors in logs
- [x] Supabase connection working
- [x] Login/Register functional

---

## 🔗 Useful Links

- **Vercel Dashboard:** https://vercel.com/dashboard
- **Deployment Logs:** https://vercel.com/<username>/projectmanagement/deployments
- **CLI Docs:** https://vercel.com/docs/cli
- **Supabase Dashboard:** https://supabase.com/dashboard
