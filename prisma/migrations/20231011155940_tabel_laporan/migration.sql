-- AlterTable
ALTER TABLE `admin` ALTER COLUMN `updated_at` DROP DEFAULT;

-- AlterTable
ALTER TABLE `pengadaan` ALTER COLUMN `updated_at` DROP DEFAULT;

-- AlterTable
ALTER TABLE `pengajuan` ALTER COLUMN `updated_at` DROP DEFAULT;

-- AlterTable
ALTER TABLE `supplier` ALTER COLUMN `updated_at` DROP DEFAULT;

-- CreateTable
CREATE TABLE `laporan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_pengajuan` INTEGER NOT NULL,
    `id_supplier` INTEGER NOT NULL,
    `laporan` TEXT NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
