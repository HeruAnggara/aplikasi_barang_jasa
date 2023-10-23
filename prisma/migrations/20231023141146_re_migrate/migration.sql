/*
  Warnings:

  - The primary key for the `admin` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `anggaran` on the `pengajuan` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Float`.
  - The primary key for the `supplier` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE `admin` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `laporan` MODIFY `id` INTEGER NOT NULL,
    MODIFY `laporan` TEXT NULL;

-- AlterTable
ALTER TABLE `pengadaan` MODIFY `id` INTEGER NOT NULL,
    MODIFY `gambar` TEXT NULL;

-- AlterTable
ALTER TABLE `pengajuan` MODIFY `id` INTEGER NOT NULL,
    MODIFY `anggaran` FLOAT NOT NULL,
    MODIFY `proposal` TEXT NULL;

-- AlterTable
ALTER TABLE `supplier` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL;
