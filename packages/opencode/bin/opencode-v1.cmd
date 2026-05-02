@echo off
:: opencode-v1 wrapper for Windows
:: Direct bun invocation for proper TTY inheritance

set "SCRIPT_DIR=%~dp0"
bun --conditions=browser "%SCRIPT_DIR%..\src\index.ts" %*
