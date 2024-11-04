@echo off

:: Iniciar o XAMPP Control
start "" "C:\xampp\xampp-control.exe"

:: Navegar para a pasta web, instalar dependências e iniciar o servidor
start cmd /k "cd /d ./web && npm install && npm run dev"

:: Navegar para a pasta server, executar as migrações do Prisma e gerar o cliente Prisma
start cmd /k "cd /d ./backend && npm install && npx prisma generate && npm run dev"

pause
