import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumberString } from 'class-validator';

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
