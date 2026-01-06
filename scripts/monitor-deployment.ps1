# Vercel Deployment Monitor Script
# Usage: .\scripts\monitor-deployment.ps1

Write-Host "🚀 Vercel Deployment Monitor" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Check if vercel CLI is installed
try {
    $vercelVersion = vercel --version 2>$null
    Write-Host "✅ Vercel CLI installed: $vercelVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Vercel CLI not installed!" -ForegroundColor Red
    Write-Host "Run: npm install -g vercel" -ForegroundColor Yellow
    exit 1
}

# Check if project is linked
if (-not (Test-Path ".vercel")) {
    Write-Host "❌ Project not linked to Vercel!" -ForegroundColor Red
    Write-Host "Run: vercel link" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Project linked to Vercel" -ForegroundColor Green
Write-Host ""

# Get latest deployments
Write-Host "📋 Recent Deployments:" -ForegroundColor Cyan
Write-Host "=====================" -ForegroundColor Cyan
vercel ls --limit 5

Write-Host ""
Write-Host "🔍 Latest Deployment Status:" -ForegroundColor Cyan
Write-Host "===========================" -ForegroundColor Cyan

# Get latest deployment details
$deploymentInfo = vercel ls --limit 1 2>&1

# Check deployment status
Write-Host ""
Write-Host "📊 Deployment Logs (last 20 lines):" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
vercel logs --limit 20

Write-Host ""
Write-Host "🔐 Environment Variables:" -ForegroundColor Cyan
Write-Host "=========================" -ForegroundColor Cyan
vercel env ls

Write-Host ""
Write-Host "✅ Monitoring complete!" -ForegroundColor Green
Write-Host ""
Write-Host "💡 Next steps:" -ForegroundColor Yellow
Write-Host "  - Check deployment URL from list above" -ForegroundColor White
Write-Host "  - Verify environment variables are set" -ForegroundColor White
Write-Host "  - Review logs for any errors" -ForegroundColor White
