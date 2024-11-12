/*
  Warnings:

  - You are about to drop the column `notaFiscalId` on the `Compras` table. All the data in the column will be lost.
  - You are about to drop the `NotaFiscal` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Compras` DROP FOREIGN KEY `Compras_notaFiscalId_fkey`;

-- AlterTable
ALTER TABLE `Compras` DROP COLUMN `notaFiscalId`;

-- DropTable
DROP TABLE `NotaFiscal`;
