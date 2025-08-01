# Git Connect & Update Script for https://github.com/MRASIYA/app01
# This script handles initial git setup, remote connection, and repository updates

param(
    [Parameter(Mandatory=$false)]
    [string]$Action = "update",
    [Parameter(Mandatory=$false)]
    [string]$CommitMessage = "Auto update $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
)

$RepoUrl = "https://github.com/MRASIYA/app01.git"
$RepoName = "app01"

Write-Host "🔧 Git Connect `& Update Tool" -ForegroundColor Magenta
Write-Host "Repository: $RepoUrl" -ForegroundColor Cyan
Write-Host "Action: $Action" -ForegroundColor Yellow
Write-Host ""

function Initialize-GitRepo {
    Write-Host "🚀 Initializing Git repository..." -ForegroundColor Green
    
    # Initialize git if not already done
    if (-not (Test-Path ".git")) {
        git init
        Write-Host "✅ Git repository initialized" -ForegroundColor Green
    } else {
        Write-Host "✅ Git repository already exists" -ForegroundColor Green
    }
    
    # Add remote origin if not exists
    $remoteExists = git remote get-url origin 2>$null
    if (-not $remoteExists) {
        git remote add origin $RepoUrl
        Write-Host "✅ Remote origin added: $RepoUrl" -ForegroundColor Green
    } else {
        Write-Host "✅ Remote origin already configured: $remoteExists" -ForegroundColor Green
    }
    
    # Set default branch to main
    git branch -M main
    Write-Host "✅ Default branch set to 'main'" -ForegroundColor Green
}

function Connect-Repository {
    Write-Host "🔗 Connecting to GitHub repository..." -ForegroundColor Green
    
    Initialize-GitRepo
    
    # Check if we have any commits
    $hasCommits = git log --oneline -1 2>$null
    if (-not $hasCommits) {
        Write-Host "📝 No commits found. Creating initial commit..." -ForegroundColor Yellow
        git add .
        git commit -m "Initial commit - Connect to GitHub repository"
    }
    
    # Push to origin
    Write-Host "⬆️ Pushing to GitHub..." -ForegroundColor Yellow
    git push -u origin main
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Successfully connected to GitHub repository!" -ForegroundColor Green
        Show-Links
    } else {
        Write-Host "❌ Failed to connect to repository. Check your credentials." -ForegroundColor Red
    }
}

function Update-Repository {
    Write-Host "🔄 Updating repository..." -ForegroundColor Green
    
    # Check if we're in a git repository
    if (-not (Test-Path ".git")) {
        Write-Host "❌ Not in a git repository. Use -Action 'connect' first." -ForegroundColor Red
        return
    }
    
    # Pull latest changes first
    Write-Host "⬇️ Pulling latest changes..." -ForegroundColor Yellow
    git pull origin main
    
    # Check for local changes
    $status = git status --porcelain
    if (-not $status) {
        Write-Host "✅ Repository is up to date! No changes to commit." -ForegroundColor Green
        return
    }
    
    # Show changes
    Write-Host "📁 Changes detected:" -ForegroundColor Cyan
    git status --short
    
    # Stage, commit, and push
    Write-Host "➕ Staging changes..." -ForegroundColor Yellow
    git add .
    
    Write-Host "💾 Committing changes..." -ForegroundColor Yellow
    git commit -m "$CommitMessage"
    
    Write-Host "⬆️ Pushing to GitHub..." -ForegroundColor Yellow
    git push origin main
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Repository updated successfully!" -ForegroundColor Green
        Show-Links
    } else {
        Write-Host "❌ Failed to update repository!" -ForegroundColor Red
    }
}

function Show-Status {
    Write-Host "📊 Repository Status:" -ForegroundColor Green
    Write-Host "Branch: $(git branch --show-current)" -ForegroundColor Cyan
    Write-Host "Remote: $(git remote get-url origin)" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Recent commits:" -ForegroundColor Yellow
    git log --oneline -5
    Write-Host ""
    Write-Host "Current status:" -ForegroundColor Yellow
    git status --short
    Show-Links
}

function Show-Links {
    Write-Host ""
    Write-Host "🔗 Quick Links:" -ForegroundColor Magenta
    Write-Host "   Repository: https://github.com/MRASIYA/app01" -ForegroundColor Cyan
    Write-Host "   GitHub Pages: https://mrasiya.github.io/app01/" -ForegroundColor Cyan
    Write-Host "   Actions: https://github.com/MRASIYA/app01/actions" -ForegroundColor Cyan
}

function Show-Help {
    Write-Host "📖 Git Connect `& Update Tool Usage:" -ForegroundColor Green
    Write-Host ""
    Write-Host "Connect to repository (first time setup):" -ForegroundColor Yellow
    Write-Host "   .\git-connect-update.ps1 -Action 'connect'" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Update repository with changes:" -ForegroundColor Yellow
    Write-Host "   .\git-connect-update.ps1 -Action 'update' -CommitMessage 'Your message'" -ForegroundColor Cyan
    Write-Host "   .\git-connect-update.ps1 'Your commit message'" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Check repository status:" -ForegroundColor Yellow
    Write-Host "   .\git-connect-update.ps1 -Action 'status'" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Show this help:" -ForegroundColor Yellow
    Write-Host "   .\git-connect-update.ps1 -Action 'help'" -ForegroundColor Cyan
}

# Main execution logic
switch ($Action.ToLower()) {
    "connect" { Connect-Repository }
    "update" { 
        if ($args.Count -gt 0 -and -not $CommitMessage.StartsWith("Auto update")) {
            # If there are additional arguments, treat first as commit message
            $CommitMessage = $args[0]
        }
        Update-Repository 
    }
    "status" { Show-Status }
    "help" { Show-Help }
    default { 
        if ($Action -ne "update") {
            # Treat the action as commit message if it's not a recognized command
            $CommitMessage = $Action
        }
        Update-Repository 
    }
}
