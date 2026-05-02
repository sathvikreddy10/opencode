@echo off
:: opencode-v1 wrapper for Windows
:: Smart: attaches to existing backend or starts standalone TUI

set "SCRIPT_DIR=%~dp0"
set "PKG_DIR=%SCRIPT_DIR%.."

:: Check if backend is already running on port 4096
netstat -ano | findstr :4096 | findstr LISTENING >nul 2>&1
if %errorlevel% equ 0 (
    echo [opencode-v1] Backend detected on port 4096, attaching TUI...
    bun run --conditions=browser "%PKG_DIR%\src\index.ts" attach http://localhost:4096 %*
) else (
    echo [opencode-v1] Starting TUI with embedded server...
    bun run --conditions=browser "%PKG_DIR%\src\index.ts" %*
)
