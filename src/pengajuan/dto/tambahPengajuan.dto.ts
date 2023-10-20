import { IsInt, IsNotEmpty, IsString, Matches, Max } from "class-validator";

export class PengajuannDto {
  
  @IsNotEmpty()
  id_pengadaan: string;

  proposal: string;

  @IsNotEmpty()
  @IsString()
  anggaran: string

}