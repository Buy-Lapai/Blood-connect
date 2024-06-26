import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsString } from 'class-validator';

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

  @IsNotEmpty({ message: 'State is required' })
  @IsString({ message: 'State is required' })
  @ApiProperty()
  state: string;

  @IsNotEmpty({ message: 'LGA is required' })
  @IsString({ message: 'LGA is required' })
  @ApiProperty()
  lga: string;

  @IsOptional()
  @ApiProperty({ required: false })
  search: string;
}
