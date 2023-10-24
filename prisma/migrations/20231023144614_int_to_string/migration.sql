-- AlterTable
ALTER TABLE `laporan` MODIFY `id_pengajuan` VARCHAR(191) NOT NULL,
    MODIFY `id_supplier` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `pengajuan` MODIFY `id_supplier` VARCHAR(191) NOT NULL,
    MODIFY `id_pengadaan` VARCHAR(191) NOT NULL;
