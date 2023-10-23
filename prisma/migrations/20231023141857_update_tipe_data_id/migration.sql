/*
  Warnings:

  - The primary key for the `laporan` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `pengadaan` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `pengajuan` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE `admin` MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `laporan` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `pengadaan` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `pengajuan` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `supplier` MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);
