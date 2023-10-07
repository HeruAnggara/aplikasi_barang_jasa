-- CreateTable
CREATE TABLE `pengadaan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_pengadaan` VARCHAR(255) NOT NULL,
    `deskripsi` TEXT NOT NULL,
    `gambar` TEXT NOT NULL,
    `anggaran` VARCHAR(191) NOT NULL,
    `status` INTEGER NOT NULL DEFAULT 1,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
