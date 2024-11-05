/*
  Warnings:

  - Added the required column `clienteId` to the `Transacoes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Transacoes` ADD COLUMN `clienteId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Transacoes` ADD CONSTRAINT `Transacoes_clienteId_fkey` FOREIGN KEY (`clienteId`) REFERENCES `Client`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
