import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { IsVeryStrongPassword } from '../../auth/password-validator.decorator';
import { IsValidBloodType } from '../../auth/bloodtype-validator.decorator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'First name is required' })
  @IsString({ message: 'First name is required' })
  @ApiProperty()
  firstName: string;

  @IsString()
  @ApiProperty({ required: false })
  middleName: string;

  @IsNotEmpty({ message: 'Last name is required' })
  @IsString()
  @ApiProperty()
  lastName: string;

  @IsEmail({}, { message: 'Email must be a valid email' })
  @ApiProperty({ required: false })
  email: string;

  @IsNumberString({}, { message: 'Phone number is invalid' })
  @ApiProperty({ required: true })
  phoneNumber: string;

  @IsNotEmpty({ message: 'Blood group is required' })
  @IsString({ message: 'Blood group is invalid' })
  @IsValidBloodType()
  @ApiProperty()
  bloodGroup: string;

  @IsNotEmpty({ message: 'NIN is required' })
  @IsString({ message: 'NIN is invalid' })
  @ApiProperty()
  nin: string;

  @IsNotEmpty({ message: 'Gender is required' })
  @IsString({ message: 'Gender is invalid' })
  @ApiProperty()
  gender: string;

  @IsNotEmpty({ message: 'Address is required' })
  @IsString({ message: 'Address is invalid' })
  @ApiProperty()
  address: string;
}
