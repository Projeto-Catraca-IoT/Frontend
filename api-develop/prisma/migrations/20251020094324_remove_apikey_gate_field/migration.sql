/*
  Warnings:

  - You are about to drop the column `apiKey` on the `Gate` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `Gate_apiKey_key` ON `Gate`;

-- AlterTable
ALTER TABLE `Gate` DROP COLUMN `apiKey`;
