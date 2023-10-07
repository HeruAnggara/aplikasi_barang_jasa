import { IsNotEmpty, IsString, Matches, Max } from "class-validator";

export class UpdatePengadaanDto {
  
  @IsString()
  nama_pengadaan: string;
  
  @IsString()
  deskripsi: string;

  @IsString()
  anggaran: string

}