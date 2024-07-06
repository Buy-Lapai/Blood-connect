import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumberString, IsString } from 'class-validator';
import { IsValidBloodType } from 'src/validators/bloodtype.validator';

export class FindDonationsDto {
  @IsNotEmpty({ message: 'Page is required' })
  @IsNumberString({}, { message: 'Page must be a number' })
  @ApiProperty()
  page: number;

  @IsNotEmpty({ message: 'Per Page is required' })
  @IsNumberString({}, { message: 'Per Page must be a number' })
  @ApiProperty()
  perPage: number;

  @ApiProperty({ required: false })
  search: string;
}

export class FindTopDonorsDto {
  @IsNotEmpty({ message: 'Blood group is required' })
  @IsString({ message: 'Blood group is invalid' })
  @IsValidBloodType()
  @ApiProperty()
  bloodGroup: 'A+' | 'A-' | 'B+' | 'B-' | 'O+' | 'O-' | 'AB+' | 'AB-';

  @ApiProperty({ required: false })
  search: string;
}
