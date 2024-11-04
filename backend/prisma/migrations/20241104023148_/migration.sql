/*
  Warnings:

  - You are about to drop the column `notaId` on the `Compras` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[clienteId,empresaId]` on the table `Pontos` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `Compras` DROP FOREIGN KEY `Compras_notaId_fkey`;

-- AlterTable
ALTER TABLE `Compras` DROP COLUMN `notaId`,
    ADD COLUMN `notaFiscalId` INTEGER NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Pontos_clienteId_empresaId_key` ON `Pontos`(`clienteId`, `empresaId`);

-- AddForeignKey
ALTER TABLE `Compras` ADD CONSTRAINT `Compras_notaFiscalId_fkey` FOREIGN KEY (`notaFiscalId`) REFERENCES `NotaFiscal`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
