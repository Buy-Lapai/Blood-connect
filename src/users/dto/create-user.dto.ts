import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString, IsStrongPassword, MinLength } from 'class-validator';
import { IsVeryStrongPassword } from 'src/auth/password-validator.decorator';

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    first_name: string;

    @IsString()
    @IsOptional()
    middle_name: string;

    @IsString()
    @IsNotEmpty()
    last_name: string;

    @IsString()
    @IsNotEmpty()
    username: string;

    @IsEmail()
    @IsNotEmpty()
    email: string

    @IsString()
    @MinLength(8)
    @IsNotEmpty()
    @IsStrongPassword()
    @IsVeryStrongPassword()
    password: string;

    @IsBoolean()
    @IsOptional()
    isDonor?: boolean;

    @IsString()
    bloodType?: string;

    @IsOptional()
    lastDonationDate?: Date;
}
