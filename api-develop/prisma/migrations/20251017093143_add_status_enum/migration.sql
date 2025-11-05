/*
  Warnings:

  - You are about to alter the column `status` on the `Gate` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(0))`.

*/
-- AlterTable
ALTER TABLE `Gate` MODIFY `status` ENUM('ativado', 'desativado') NOT NULL DEFAULT 'ativado';
