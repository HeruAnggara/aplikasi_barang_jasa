import { IsInt, IsNotEmpty, IsString, Matches, Max } from "class-validator";

export class PengajuannDto {
  
  @IsNotEmpty()
  @IsInt()
  id_pengadaan: number;

  @IsNotEmpty()
  @Matches('pdf')
  @Max(10 * 1024 * 1024, { message: 'Ukuran file tidak boleh lebih dari 10MB.' })
  proposal: string;

  @IsNotEmpty()
  @IsString()
  anggaran: string

}