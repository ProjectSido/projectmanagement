# Add environment variables to Vercel automatically
$ErrorActionPreference = "Stop"

Write-Host "Reading .env.local..." -ForegroundColor Cyan

# Read env vars
$envContent = Get-Content .env.local
$supabaseUrl = ($envContent | Select-String "NEXT_PUBLIC_SUPABASE_URL" | ForEach-Object { $_.Line.Split('=', 2)[1].Trim() })
$supabaseKey = ($envContent | Select-String "NEXT_PUBLIC_SUPABASE_ANON_KEY" | ForEach-Object { $_.Line.Split('=', 2)[1].Trim() })

if (-not $supabaseUrl) {
    Write-Host "Error: NEXT_PUBLIC_SUPABASE_URL not found" -ForegroundColor Red
    exit 1
}

if (-not $supabaseKey) {
    Write-Host "Error: NEXT_PUBLIC_SUPABASE_ANON_KEY not found" -ForegroundColor Red
    exit 1  
}

Write-Host "Found URL: $($supabaseUrl.Substring(0, 40))..." -ForegroundColor Green
Write-Host "Found KEY: $($supabaseKey.Substring(0, 20))... ($($supabaseKey.Length) chars)" -ForegroundColor Green
Write-Host ""

# Export to environment for vercel command
$env:VERCEL_SUPABASE_URL = $supabaseUrl
$env:VERCEL_SUPABASE_KEY = $supabaseKey

Write-Host "Values exported to environment variables" -ForegroundColor Green
Write-Host "Run these commands manually:" -ForegroundColor Yellow
Write-Host ""
Write-Host 'echo $env:VERCEL_SUPABASE_URL | vercel env add NEXT_PUBLIC_SUPABASE_URL production' -ForegroundColor Cyan
Write-Host 'echo $env:VERCEL_SUPABASE_KEY | vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production' -ForegroundColor Cyan
