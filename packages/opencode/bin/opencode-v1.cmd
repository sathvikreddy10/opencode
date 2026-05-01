@echo off
:: opencode-v1 wrapper for Windows CMD/PowerShell
:: Runs the local opencode source from the repo

set "SCRIPT_DIR=%~dp0"
set "SRC=%SCRIPT_DIR%..\src\index.ts"
set "BUN=C:\Users\sathv\AppData\Roaming\npm\bun.cmd"

:: IMPORTANT: Do NOT cd anywhere. 
:: The TUI needs the current working directory to be the user's project folder.
:: Bun will resolve the script and its imports via the monorepo workspace config.

"%BUN%" run "%SRC%" %*
