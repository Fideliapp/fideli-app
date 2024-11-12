/*
  Warnings:

  - You are about to drop the column `ramoId` on the `Empresa` table. All the data in the column will be lost.
  - You are about to drop the `Ramo` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Empresa` DROP FOREIGN KEY `Empresa_ramoId_fkey`;

-- AlterTable
ALTER TABLE `Empresa` DROP COLUMN `ramoId`;

-- DropTable
DROP TABLE `Ramo`;
