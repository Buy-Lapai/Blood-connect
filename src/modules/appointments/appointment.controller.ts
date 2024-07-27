import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { IRequest } from 'src/interfaces/express';
import { HospitalGuard } from 'src/guards/hospital.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AppointmentsService } from './appointment.service';
import { AppointmentIDDto, ListAppointmentsDto } from './dto/list-appointments.dto';
import { BookAppointmentDto } from './dto/book-appointment.dto';
import { ConfirmAppointmentDto } from './dto/confirm-appointment.dto';
import { RescheduleAppointmentDto } from './dto/reschedule-appointment.dto';

@ApiTags('Appointments')
@Controller('appointments')
export class AppointmentsController {
  constructor(private appointmentService: AppointmentsService) {}

  @ApiBearerAuth()
  @UseGuards(HospitalGuard)
  @Get()
  async findAll(@Query() query: ListAppointmentsDto, @Req() req: IRequest) {
    return this.appointmentService.fetchAppointments(query, req.hospital);
  }

  @Post()
  async create(@Body() body: BookAppointmentDto) {
    return this.appointmentService.bookAppointment(body);
  }

  @ApiBearerAuth()
  @Patch(':id/confirm')
  async confirmAppointment(
    @Param() param: AppointmentIDDto,
    @Req() req: IRequest,
    @Body() body: ConfirmAppointmentDto,
  ) {
    return this.appointmentService.confirmAppointment(
      param.id,
      body,
      req.hospital,
    );
  }

  @Patch(':id/reschedule')
  async rescheduleAppointment(
    @Body() body: RescheduleAppointmentDto,
    @Param() param: AppointmentIDDto,
    @Req() req: IRequest,
  ) {
    return this.appointmentService.rescheduleAppointment(
      param.id,
      body,
      req.hospital!,
    );
  }

  @Get(':id/cancel')
  async cancelAppointment(
    @Param() param: AppointmentIDDto,
    @Req() req: IRequest,
  ) {
    return this.appointmentService.cancelAppointment(param.id, req.hospital!);
  }
}
