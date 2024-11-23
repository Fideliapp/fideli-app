/*
  Warnings:

  - A unique constraint covering the columns `[notaId]` on the table `Compras` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `Compras` ADD COLUMN `notaId` INTEGER NULL;

-- CreateTable
CREATE TABLE `NotaFiscal` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `valor` DOUBLE NOT NULL,
    `data` DATETIME(3) NOT NULL,
    `nf` VARCHAR(191) NOT NULL,
    `empresaId` INTEGER NOT NULL,
    `compraId` INTEGER NULL,

    UNIQUE INDEX `NotaFiscal_nf_key`(`nf`),
    UNIQUE INDEX `NotaFiscal_compraId_key`(`compraId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Compras_notaId_key` ON `Compras`(`notaId`);

-- AddForeignKey
ALTER TABLE `NotaFiscal` ADD CONSTRAINT `NotaFiscal_empresaId_fkey` FOREIGN KEY (`empresaId`) REFERENCES `Empresa`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Compras` ADD CONSTRAINT `Compras_notaId_fkey` FOREIGN KEY (`notaId`) REFERENCES `NotaFiscal`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
