import { IsInt, IsNotEmpty, IsString, Matches, Max } from "class-validator";

export class LaporanDto {
  
  @IsNotEmpty()
  @IsInt()
  id_pengajuan: string;

  @IsNotEmpty()
  @Matches('pdf')
  @Max(10 * 1024 * 1024, { message: 'Ukuran file tidak boleh lebih dari 10MB.' })
  laporan: string;

}