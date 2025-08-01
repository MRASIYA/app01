@echo off
if "%~1"=="" (
    echo Usage: auto-update.bat "Your commit message"
    echo Example: auto-update.bat "Updated website content"
    exit /b 1
)

powershell -ExecutionPolicy Bypass -File "auto-update.ps1" "%~1"
