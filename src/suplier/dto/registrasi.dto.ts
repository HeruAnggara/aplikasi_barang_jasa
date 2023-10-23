import {
    MinLength,
    MaxLength,
    IsNotEmpty,
    IsString,
    IsEmail,
    isString,
    Matches
  } from 'class-validator';
  
  export class RegisterDTO {
    
    @IsNotEmpty()
    id: string;

    @IsNotEmpty()
    @IsString()
    nama_usaha: string;
  
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    alamat: string;
  
    @IsNotEmpty()
    no_npwp: string;
  
    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    @MaxLength(20)
    @Matches(/^(?=.*[A-Z])(?=.*[0-9])(?=.*\W).*$/, {
      message: 'Password harus mengandung setidaknya satu huruf besar, satu angka, dan satu karakter khusus.'
    })
    password: string;
  }