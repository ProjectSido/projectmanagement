# Sync Environment Variables from .env.local to Vercel
# Usage: .\scripts\sync-env-to-vercel.ps1

Write-Host "🔄 Syncing Environment Variables to Vercel" -ForegroundColor Cyan
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host ""

# Check if .env.local exists
if (-not (Test-Path ".env.local")) {
    Write-Host "❌ Error: .env.local file not found!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Found .env.local" -ForegroundColor Green
Write-Host ""

# Read and display variables (without showing full values for security)
Write-Host "📋 Reading environment variables from .env.local..." -ForegroundColor Cyan

$content = Get-Content ".env.local" -Raw
$lines = $content -split "`n"

$supabaseUrl = ""
$supabaseKey = ""

foreach ($line in $lines) {
    $line = $line.Trim()
    if ($line -match "^NEXT_PUBLIC_SUPABASE_URL=(.+)$") {
        $supabaseUrl = $matches[1].Trim()
    }
    if ($line -match "^NEXT_PUBLIC_SUPABASE_ANON_KEY=(.+)$") {
        $supabaseKey = $matches[1].Trim()
    }
}

if (-not $supabaseUrl) {
    Write-Host "❌ NEXT_PUBLIC_SUPABASE_URL not found in .env.local" -ForegroundColor Red
    exit 1
}

if (-not $supabaseKey) {
    Write-Host "❌ NEXT_PUBLIC_SUPABASE_ANON_KEY not found in .env.local" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Found NEXT_PUBLIC_SUPABASE_URL" -ForegroundColor Green
Write-Host "✅ Found NEXT_PUBLIC_SUPABASE_ANON_KEY" -ForegroundColor Green
Write-Host ""

# Display preview
$urlPreview = $supabaseUrl.Substring(0, [Math]::Min(40, $supabaseUrl.Length))
if ($supabaseUrl.Length -gt 40) { $urlPreview += "..." }

$keyPreview = $supabaseKey.Substring(0, [Math]::Min(20, $supabaseKey.Length))
if ($supabaseKey.Length -gt 20) { $keyPreview += "..." }

Write-Host "Preview:" -ForegroundColor Cyan
Write-Host "  NEXT_PUBLIC_SUPABASE_URL: $urlPreview" -ForegroundColor White
Write-Host "  NEXT_PUBLIC_SUPABASE_ANON_KEY: $keyPreview" -ForegroundColor White
Write-Host ""

Write-Host "⚠️  These will be added to Vercel for Production, Preview, and Development environments" -ForegroundColor Yellow
Write-Host ""

$confirm = Read-Host "Continue? (y/n)"
if ($confirm -ne "y") {
    Write-Host "❌ Cancelled" -ForegroundColor Red
    exit 0
}

Write-Host ""
Write-Host "📤 Adding to Vercel..." -ForegroundColor Cyan
Write-Host ""
Write-Host "Please follow the prompts for each variable:" -ForegroundColor Yellow
Write-Host ""

# Add SUPABASE_URL
Write-Host "1️⃣  Adding NEXT_PUBLIC_SUPABASE_URL..." -ForegroundColor Cyan
Write-Host "   When prompted:" -ForegroundColor Gray
Write-Host "   - Value will be auto-filled" -ForegroundColor Gray
Write-Host "   - Select environments: Production, Preview, Development (use Space to select)" -ForegroundColor Gray
Write-Host ""

# Save values to temp files
$urlFile = New-TemporaryFile
$keyFile = New-TemporaryFile
Set-Content -Path $urlFile.FullName -Value $supabaseUrl -NoNewline
Set-Content -Path $keyFile.FullName -Value $supabaseKey -NoNewline

Write-Host "Copy this value for NEXT_PUBLIC_SUPABASE_URL:" -ForegroundColor Yellow
Write-Host $supabaseUrl -ForegroundColor Cyan
Write-Host ""
Write-Host "Now run: vercel env add NEXT_PUBLIC_SUPABASE_URL" -ForegroundColor Green
Write-Host "Then paste the value above when prompted" -ForegroundColor Gray
Write-Host ""
Read-Host "Press Enter after you've added NEXT_PUBLIC_SUPABASE_URL"

Write-Host ""
Write-Host "2️⃣  Adding NEXT_PUBLIC_SUPABASE_ANON_KEY..." -ForegroundColor Cyan
Write-Host "Copy this value for NEXT_PUBLIC_SUPABASE_ANON_KEY:" -ForegroundColor Yellow
Write-Host $supabaseKey -ForegroundColor Cyan
Write-Host ""
Write-Host "Now run: vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY" -ForegroundColor Green
Write-Host "Then paste the value above when prompted" -ForegroundColor Gray
Write-Host ""
Read-Host "Press Enter after you've added NEXT_PUBLIC_SUPABASE_ANON_KEY"

# Cleanup
Remove-Item $urlFile.FullName -ErrorAction SilentlyContinue
Remove-Item $keyFile.FullName -ErrorAction SilentlyContinue

Write-Host ""
Write-Host "🔍 Verifying..." -ForegroundColor Cyan
vercel env ls

Write-Host ""
Write-Host "✅ Done!" -ForegroundColor Green
