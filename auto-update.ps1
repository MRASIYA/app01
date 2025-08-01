# Auto Update Script for app01 Repository
# Usage: .\auto-update.ps1 "Your commit message"

param(
    [Parameter(Mandatory=$true)]
    [string]$CommitMessage
)

Write-Host "🚀 Starting auto-update process..." -ForegroundColor Green

# Check if we're in a git repository
if (-not (Test-Path ".git")) {
    Write-Host "❌ Error: Not in a git repository!" -ForegroundColor Red
    exit 1
}

# Check for changes
Write-Host "📋 Checking for changes..." -ForegroundColor Yellow
$status = git status --porcelain
if (-not $status) {
    Write-Host "✅ No changes to commit. Repository is up to date!" -ForegroundColor Green
    exit 0
}

# Show status
Write-Host "📁 Current changes:" -ForegroundColor Cyan
git status --short

# Stage all changes
Write-Host "➕ Staging all changes..." -ForegroundColor Yellow
git add .

# Commit changes
Write-Host "💾 Committing changes..." -ForegroundColor Yellow
git commit -m "$CommitMessage"

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error: Failed to commit changes!" -ForegroundColor Red
    exit 1
}

# Push to origin
Write-Host "🔄 Pushing to GitHub..." -ForegroundColor Yellow
git push

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Successfully updated repository!" -ForegroundColor Green
    Write-Host "🌐 Repository: https://github.com/MRASIYA/app01" -ForegroundColor Cyan
    Write-Host "📄 GitHub Pages: https://mrasiya.github.io/app01/" -ForegroundColor Cyan
} else {
    Write-Host "❌ Error: Failed to push changes!" -ForegroundColor Red
    exit 1
}
