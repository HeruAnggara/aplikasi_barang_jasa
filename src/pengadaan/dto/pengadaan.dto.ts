import { IsNotEmpty, Matches, Max } from "class-validator";

export class PengadaanDto {
  
  @IsNotEmpty()
  nama_pengadaan: string;
  
  @IsNotEmpty()
  deskripsi: string;

  gambar: string;

  @IsNotEmpty()
  anggaran: string

}