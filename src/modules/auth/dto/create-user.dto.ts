import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { IsVeryStrongPassword } from '../password-validator.decorator';
import { IsValidBloodType } from '../bloodtype-validator.decorator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'First name is required' })
  @IsString()
  @ApiProperty()
  firstName: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  middleName: string;

  @IsNotEmpty({ message: 'Last name is required' })
  @IsString()
  @ApiProperty()
  lastName: string;

  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Email must be a valid email' })
  @ApiProperty()
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @IsString({ message: 'Password is invalid' })
  @MinLength(8, { message: 'Password must have a minimum of eight characters' })
  @IsVeryStrongPassword()
  @ApiProperty()
  password: string;

  @IsNotEmpty({ message: 'Password is required' })
  @IsString()
  @IsValidBloodType()
  @ApiProperty()
  bloodType: string;
}
