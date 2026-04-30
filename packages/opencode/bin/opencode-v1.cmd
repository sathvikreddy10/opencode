@echo off
:: opencode-v1 wrapper for Windows CMD/PowerShell
:: Runs the local opencode source from the repo

set "SCRIPT_DIR=%~dp0"
set "SRC=%SCRIPT_DIR%..\src\index.ts"
set "BUN=C:\Users\sathv\AppData\Roaming\npm\bun.cmd"

"%BUN%" run --conditions=browser "%SRC%" %*
