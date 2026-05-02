@echo off
:: opencode-v1 wrapper for Windows
:: Cleans up zombie processes before starting

:: Kill any existing bun processes on port 4096
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :4096 ^| findstr LISTENING') do taskkill /F /PID %%a 2>nul

set "SCRIPT_DIR=%~dp0"
bun --conditions=browser "%SCRIPT_DIR%..\src\index.ts" %*
