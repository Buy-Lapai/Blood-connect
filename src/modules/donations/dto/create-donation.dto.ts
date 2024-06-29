import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { IsValidObjectId } from 'src/validators/objectid.validator';

export class CreateDonationDto {
  @ApiProperty()
  @IsString({ message: 'User is required' })
  @IsValidObjectId({message: "Invalid user ID"})
  user: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Quantity is required' })
  @IsNumber({}, { message: 'Quantity must be a number' })
  quantity: number;
}
