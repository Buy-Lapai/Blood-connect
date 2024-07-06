import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNumberString,
  IsString,
  MinLength,
} from 'class-validator';
import { IsVeryStrongPassword } from 'src/modules/auth/password-validator.decorator';

export class CreateHospitalDto {
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name is required' })
  @ApiProperty()
  name: string;

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

  @IsNotEmpty({ message: 'State is required' })
  @IsString({ message: 'State is required' })
  @ApiProperty()
  state: string;

  @IsNotEmpty({ message: 'Local government area is required' })
  @IsString({ message: 'Local government area is required' })
  @ApiProperty()
  lga: string;

  @IsNotEmpty({ message: 'Street is required' })
  @IsString({ message: 'Street is required' })
  @ApiProperty()
  street: string;

  @IsNotEmpty({ message: 'House number is required' })
  @IsString({ message: 'House number is required' })
  @ApiProperty()
  houseNumber: string;

  @IsNotEmpty({ message: 'Longitude is required' })
  @IsNumberString({}, { message: 'Longitude is required' })
  @ApiProperty()
  long: string;

  @IsNotEmpty({ message: 'Latitude is required' })
  @IsNumberString({}, { message: 'Latitude is required' })
  @ApiProperty()
  lat: string;
}
