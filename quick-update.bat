@echo off
REM Quick Update Command for https://github.com/MRASIYA/app01
REM Usage: quick-update.bat "Your commit message"

if "%~1"=="" (
    set /p message="Enter commit message: "
    if "!message!"=="" (
        echo Error: Commit message is required
        exit /b 1
    )
    powershell -ExecutionPolicy Bypass -File "git-connect-update.ps1" -Action "update" -CommitMessage "!message!"
) else (
    powershell -ExecutionPolicy Bypass -File "git-connect-update.ps1" -Action "update" -CommitMessage "%~1"
)
