import { IsInt, IsNotEmpty, IsString, Matches, Max } from "class-validator";

export class LaporanDto {
  
  id: string;
  
  @IsNotEmpty()
  id_pengajuan: string;
  
  laporan: string;

}