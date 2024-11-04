@echo off

:: Navegar para a pasta server, executar as migrações do Prisma e gerar o cliente Prisma
start cmd /k "cd /d ./backend && npx prisma migrate dev"

pause
