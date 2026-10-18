@echo off
setlocal
cd /d "%~dp0"
where cargo >nul 2>nul
if errorlevel 1 (
  echo Install Rust stable MSVC and Visual Studio C++ Build Tools first. See DESKTOP.md.
  pause
  exit /b 1
)
call npm ci
if errorlevel 1 goto failed
call npm run build:desktop
if errorlevel 1 goto failed
echo Build complete. See apps\web\src-tauri\target\x86_64-pc-windows-msvc\release\bundle\nsis\
pause
exit /b 0
:failed
echo Build failed. Please keep the error output.
pause
exit /b 1
