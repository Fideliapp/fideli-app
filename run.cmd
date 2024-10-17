@echo off

start "" "C:\xampp\xampp-control.exe"

start cmd /k "cd /d ./web && npm run dev"

start cmd /k "cd /d ./server && npm run dev"

pause
