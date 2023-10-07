import { IsNotEmpty, Matches, Max } from "class-validator";

export class UpdateGambarDto {

  @IsNotEmpty()
  @Matches('jpg|png|jpeg')
  @Max(10 * 1024 * 1024, { message: 'Ukuran file tidak boleh lebih dari 10MB.' })
  gambar: string;

}