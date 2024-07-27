import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsString } from 'class-validator';
import { IsValidObjectId } from 'src/validators/objectid.validator';

export class BookAppointmentDto {
  @ApiProperty()
  @IsString({ message: 'Hospital is required' })
  @IsValidObjectId({ message: 'Invalid hospital ID' })
  hospital: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Date is required' })
  @IsDateString({ strict: true }, { message: 'Invalid date selected' })
  date: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
  name: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Email is required' })
  @IsString({ message: 'Email must be a string' })
  email: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Phone number is required' })
  @IsString({ message: 'Phone number must be a string' })
  phoneNumber: string;
}
