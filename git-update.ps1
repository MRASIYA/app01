# Git Update Script for Professional Web Application
# This script helps you quickly update your Git repository

Write-Host "🚀 Professional Web Application - Git Update Script" -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan

# Function to add, commit, and push changes
function Update-Git {
    param(
        [string]$CommitMessage = "Update website files"
    )
    
    Write-Host "📝 Checking Git status..." -ForegroundColor Yellow
    git status
    
    Write-Host "`n📦 Adding all changes..." -ForegroundColor Yellow
    git add .
    
    Write-Host "💾 Committing changes..." -ForegroundColor Yellow
    git commit -m $CommitMessage
    
    Write-Host "🌐 Pushing to GitHub..." -ForegroundColor Yellow
    git push origin main
    
    Write-Host "✅ Git update completed successfully!" -ForegroundColor Green
}

# Function to check current status
function Check-GitStatus {
    Write-Host "📊 Current Git Status:" -ForegroundColor Cyan
    git status
    
    Write-Host "`n📋 Recent commits:" -ForegroundColor Cyan
    git log --oneline -5
    
    Write-Host "`n🌐 Remote repository:" -ForegroundColor Cyan
    git remote -v
}

# Main menu
Write-Host "`nChoose an option:" -ForegroundColor White
Write-Host "1. Quick update (add, commit, push)" -ForegroundColor White
Write-Host "2. Custom commit message" -ForegroundColor White
Write-Host "3. Check status only" -ForegroundColor White
Write-Host "4. Pull latest changes" -ForegroundColor White

$choice = Read-Host "Enter your choice (1-4)"

switch ($choice) {
    "1" {
        $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm"
        Update-Git "🔄 Quick update - $timestamp"
    }
    "2" {
        $message = Read-Host "Enter commit message"
        if ($message) {
            Update-Git $message
        } else {
            Write-Host "❌ No commit message provided" -ForegroundColor Red
        }
    }
    "3" {
        Check-GitStatus
    }
    "4" {
        Write-Host "⬇️ Pulling latest changes..." -ForegroundColor Yellow
        git pull origin main
        Write-Host "✅ Pull completed!" -ForegroundColor Green
    }
    default {
        Write-Host "❌ Invalid choice" -ForegroundColor Red
    }
}

Write-Host "`n🎯 Script completed!" -ForegroundColor Cyan
