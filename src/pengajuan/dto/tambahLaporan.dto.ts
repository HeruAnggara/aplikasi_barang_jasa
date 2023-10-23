import { IsInt, IsNotEmpty, IsString, Matches, Max } from "class-validator";

export class LaporanDto {
  
  @IsNotEmpty()
  id_pengajuan: string;
  
  laporan: string;

}