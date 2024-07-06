import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';
import { IsValidBloodType } from 'src/validators/bloodtype.validator';

export class FindAllBloodBanksDto {
  @IsNotEmpty({ message: 'Page is required' })
  @IsNumberString({}, { message: 'Page must be a number' })
  @ApiProperty()
  page: string;

  @IsNotEmpty({ message: 'Per Page is required' })
  @IsNumberString({}, { message: 'Per Page must be a number' })
  @ApiProperty()
  perPage: string;

  @IsOptional()
  @ApiProperty({ required: false })
  search: string;
}

export class FindAllBloodBanksNearMeDto {
  @IsNotEmpty({ message: 'Page is required' })
  @IsNumberString({}, { message: 'Page must be a number' })
  @ApiProperty()
  page: number;

  @IsNotEmpty({ message: 'Per Page is required' })
  @IsNumberString({}, { message: 'Per Page must be a number' })
  @ApiProperty()
  perPage: number;

  @IsNotEmpty({ message: 'Longitude is required' })
  @IsString({ message: 'Longitude is required' })
  @ApiProperty()
  longitude: string;

  @IsNotEmpty({ message: 'Latitude is required' })
  @IsString({ message: 'Latitude is required' })
  @ApiProperty()
  latitude: string;

  @IsNotEmpty({ message: 'Blood group is required' })
  @IsString({ message: 'Blood group is invalid' })
  @IsValidBloodType()
  @ApiProperty()
  bloodGroup: 'A+' | 'A-' | 'B+' | 'B-' | 'O+' | 'O-' | 'AB+' | 'AB-';

  @IsOptional()
  @ApiProperty({ required: false })
  search: string;
}
