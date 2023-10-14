import { IsString, IsNotEmpty, IsEmail, MinLength, MaxLength, Matches } from "class-validator";

export class NonAktifDto {
  
  @IsNotEmpty()
  id: string;

}