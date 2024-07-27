import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumberString } from 'class-validator';
import { IsValidObjectId } from 'src/validators/objectid.validator';

export class ListAppointmentsDto {
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

  @ApiProperty({ required: false })
  date: string;
}

export class AppointmentIDDto {
  @IsValidObjectId({ message: 'ID is invalid' })
  @ApiProperty()
  id: string;
}
