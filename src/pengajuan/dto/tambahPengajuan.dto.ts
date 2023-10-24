import { IsInt, IsNotEmpty, IsString, Matches, Max } from "class-validator";

export class PengajuannDto {
  
  id: string;
  
  @IsNotEmpty()
  id_pengadaan: string;

  proposal: string;

  @IsNotEmpty()
  anggaran: string

}