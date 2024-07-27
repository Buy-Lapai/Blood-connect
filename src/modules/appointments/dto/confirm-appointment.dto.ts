import { ApiProperty } from '@nestjs/swagger';

export class ConfirmAppointmentDto {
  @ApiProperty()
  date?: string;
}
