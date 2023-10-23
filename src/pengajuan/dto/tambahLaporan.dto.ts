import { IsInt, IsNotEmpty, IsString, Matches, Max } from "class-validator";

export class LaporanDto {
  
  @IsNotEmpty()
  @IsInt()
  id_pengajuan: string;
  
  laporan: string;

}