@echo off
setlocal enabledelayedexpansion

REM Git Connect & Update Batch Wrapper for https://github.com/MRASIYA/app01

if "%~1"=="help" (
    echo.
    echo 🔧 Git Connect ^& Update Tool - Quick Commands
    echo.
    echo Connect to repository ^(first time^):
    echo    git-connect-update.bat connect
    echo.
    echo Update repository with changes:
    echo    git-connect-update.bat update "Your commit message"
    echo    git-connect-update.bat "Your commit message"
    echo.
    echo Check repository status:
    echo    git-connect-update.bat status
    echo.
    echo Examples:
    echo    git-connect-update.bat "Updated homepage design"
    echo    git-connect-update.bat update "Fixed navigation bug"
    echo    git-connect-update.bat connect
    echo    git-connect-update.bat status
    goto :eof
)

if "%~1"=="" (
    echo Usage: git-connect-update.bat [action] [commit message]
    echo Type 'git-connect-update.bat help' for more information
    goto :eof
)

REM Execute PowerShell script with parameters
if "%~2"=="" (
    powershell -ExecutionPolicy Bypass -File "git-connect-update.ps1" -Action "%~1"
) else (
    powershell -ExecutionPolicy Bypass -File "git-connect-update.ps1" -Action "%~1" -CommitMessage "%~2"
)
