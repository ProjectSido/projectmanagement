# Automated Vercel Deployment Script
# Usage: .\scripts\deploy-to-vercel.ps1 [-Environment "production"|"preview"]

param(
    [string]$Environment = "preview"
)

Write-Host "🚀 Starting Vercel Deployment" -ForegroundColor Cyan
Write-Host "==============================" -ForegroundColor Cyan
Write-Host "Environment: $Environment" -ForegroundColor Yellow
Write-Host ""

# Step 1: Pre-deployment checks
Write-Host "🔍 Step 1: Pre-deployment checks..." -ForegroundColor Cyan

# Check git status
$gitStatus = git status --porcelain
if ($gitStatus) {
    Write-Host "⚠️  Warning: Uncommitted changes detected" -ForegroundColor Yellow
    Write-Host $gitStatus
    Write-Host ""
    $continue = Read-Host "Continue deployment? (y/n)"
    if ($continue -ne "y") {
        Write-Host "❌ Deployment cancelled" -ForegroundColor Red
        exit 1
    }
}
else {
    Write-Host "✅ No uncommitted changes" -ForegroundColor Green
}

# Check branch
$currentBranch = git branch --show-current
Write-Host "✅ Current branch: $currentBranch" -ForegroundColor Green

# Step 2: Deploy
Write-Host ""
Write-Host "🚀 Step 2: Deploying to Vercel..." -ForegroundColor Cyan

$deployCommand = "vercel"
if ($Environment -eq "production") {
    $deployCommand += " --prod"
}

Write-Host "Running: $deployCommand" -ForegroundColor Yellow

# Capture deployment output
$deploymentOutput = & $deployCommand.Split() 2>&1

# Display output
$deploymentOutput | ForEach-Object {
    Write-Host $_
}

# Extract deployment URL
$deploymentUrl = $deploymentOutput | Select-String -Pattern "https://" | Select-Object -First 1

if ($deploymentUrl) {
    Write-Host ""
    Write-Host "✅ Deployment successful!" -ForegroundColor Green
    Write-Host "🔗 URL: $deploymentUrl" -ForegroundColor Cyan
    
    # Step 3: Wait for deployment to be ready
    Write-Host ""
    Write-Host "⏳ Step 3: Waiting for deployment to be ready..." -ForegroundColor Cyan
    Start-Sleep -Seconds 10
    
    # Step 4: Verify deployment
    Write-Host ""
    Write-Host "🔍 Step 4: Verifying deployment..." -ForegroundColor Cyan
    
    try {
        $response = Invoke-WebRequest -Uri $deploymentUrl -Method Head -TimeoutSec 10
        if ($response.StatusCode -eq 200) {
            Write-Host "✅ Deployment is live and responding!" -ForegroundColor Green
        }
    }
    catch {
        Write-Host "⚠️  Deployment may not be ready yet. Check manually: $deploymentUrl" -ForegroundColor Yellow
    }
    
    # Step 5: Check logs for errors
    Write-Host ""
    Write-Host "📋 Step 5: Checking deployment logs..." -ForegroundColor Cyan
    Write-Host "Last 20 log lines:" -ForegroundColor Gray
    vercel logs --limit 20
    
    # Summary
    Write-Host ""
    Write-Host "================================" -ForegroundColor Cyan
    Write-Host "✅ Deployment Complete!" -ForegroundColor Green
    Write-Host "================================" -ForegroundColor Cyan
    Write-Host "🔗 URL: $deploymentUrl" -ForegroundColor White
    Write-Host "🌍 Environment: $Environment" -ForegroundColor White
    Write-Host "🔍 Monitor: vercel logs" -ForegroundColor White
    Write-Host ""
    
}
else {
    Write-Host ""
    Write-Host "❌ Deployment failed!" -ForegroundColor Red
    Write-Host "Check the output above for errors" -ForegroundColor Yellow
    exit 1
}
