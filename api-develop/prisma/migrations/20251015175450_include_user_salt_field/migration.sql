/*
  Warnings:

  - Added the required column `satl` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `User` ADD COLUMN `satl` VARCHAR(191) NOT NULL;
