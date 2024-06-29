import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { IsVeryStrongPassword } from '../../auth/password-validator.decorator';
import { IsValidBloodType } from '../../../validators/bloodtype.validator';
import { IsValidGender } from 'src/validators/gender.validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'First name is required' })
  @IsString({ message: 'First name is required' })
  @ApiProperty()
  firstName: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  middleName: string;

  @IsNotEmpty({ message: 'Last name is required' })
  @IsString()
  @ApiProperty()
  lastName: string;

  @IsOptional()
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
  bloodGroup: 'A+' | 'A-' | 'B+' | 'B-' | 'O+' | 'O-' | 'AB+' | 'AB-';

  @IsNotEmpty({ message: 'NIN is required' })
  @IsNumberString({}, { message: 'NIN is invalid' })
  @ApiProperty()
  nin: string;

  @IsNotEmpty({ message: 'Gender is required' })
  @IsString({ message: 'Gender is invalid' })
  @IsValidGender()
  @ApiProperty()
  gender: string;

  @IsNotEmpty({ message: 'Address is required' })
  @IsString({ message: 'Address is invalid' })
  @ApiProperty()
  address: string;

  @IsNotEmpty({ message: 'Data of birth is required' })
  @IsDateString(
    { strict: true },
    { message: 'Data of birth is required and must be in format YYYY-MM-DD' },
  )
  @ApiProperty()
  dob: string;
}
