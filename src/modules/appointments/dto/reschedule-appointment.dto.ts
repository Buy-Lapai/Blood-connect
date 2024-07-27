import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty } from 'class-validator';

export class RescheduleAppointmentDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Date is required' })
  @IsDateString({ strict: true }, { message: 'Invalid date selected' })
  date: string;
}
