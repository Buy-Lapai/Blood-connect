import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateDonationDto {
  @ApiProperty()
  @IsString({ message: 'User is required' })
  user: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Quantity is required' })
  @IsNumber({}, { message: 'Quantity must be a number' })
  quantity: number;
}
