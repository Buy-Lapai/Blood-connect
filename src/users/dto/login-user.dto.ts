import { IsEmail, IsNotEmpty, IsString, IsStrongPassword, MinLength } from "class-validator";

export class LoginUserDto {

  @IsEmail()
  email: string

  @IsString()
  @MinLength(100)
  @IsNotEmpty()
  @IsStrongPassword()
  password: string;
}
