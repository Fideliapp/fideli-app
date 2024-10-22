@echo off

:: Navegar para a pasta server, executar as migrações do Prisma e gerar o cliente Prisma
start cmd /k "cd /d ./server && npx prisma migrate dev"

pause
