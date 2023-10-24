import { IsNotEmpty, Matches, Max } from "class-validator";

export class PengadaanDto {
  
  id: string;
  
  @IsNotEmpty()
  nama_pengadaan: string;
  
  @IsNotEmpty()
  deskripsi: string;

  gambar: string;

  @IsNotEmpty()
  anggaran: string

}