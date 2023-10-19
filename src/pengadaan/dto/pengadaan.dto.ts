import { IsNotEmpty, Matches, Max } from "class-validator";

export class PengadaanDto {
  
  @IsNotEmpty()
  nama_pengadaan: string;
  
  @IsNotEmpty()
  deskripsi: string;

  // @IsNotEmpty()
  // @Matches('jpg|png|jpeg')
  // @Max(10 * 1024 * 1024, { message: 'Ukuran file tidak boleh lebih dari 10MB.' })
  gambar: string;

  @IsNotEmpty()
  anggaran: string

}