@echo off
:: opencode-v1 wrapper for Windows
:: Delegates to the JS wrapper for proper TTY inheritance

set "SCRIPT_DIR=%~dp0"
node "%SCRIPT_DIR%opencode-v1" %*
