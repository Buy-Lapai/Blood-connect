import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  FilterQuery,
  Model,
  PipelineStage,
  PopulateOptions,
  SortOrder,
} from 'mongoose';
import { Appointment, AppointmentDocument } from './appointment.schema';
import { BookAppointmentDto } from './dto/book-appointment.dto';
import * as moment from 'moment';
import { Hospital } from '../hospitals/hospitals.schema';
import { RescheduleAppointmentDto } from './dto/reschedule-appointment.dto';
import { ListAppointmentsDto } from './dto/list-appointments.dto';
import { ConfirmAppointmentDto } from './dto/confirm-appointment.dto';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectModel(Appointment.name)
    private appointmentModel: Model<AppointmentDocument>,
  ) {}

  async find(
    query: FilterQuery<Appointment>,
    skip?: number,
    limit?: number,
    populate?: PopulateOptions[],
    sort?: { [key: string]: SortOrder },
  ) {
    return this.appointmentModel
      .find(query)
      .skip(skip)
      .limit(limit)
      .sort(sort)
      .populate(populate);
  }

  async findOne(query: FilterQuery<Appointment>, populate?: PopulateOptions[]) {
    return this.appointmentModel.findOne(query).populate(populate);
  }

  async create(payload: Appointment): Promise<Appointment> {
    return this.appointmentModel.create(payload);
  }

  async update(payload: Partial<Appointment>, query: FilterQuery<Appointment>) {
    return this.appointmentModel.updateOne(query, payload);
  }

  async count(payload: FilterQuery<Appointment>): Promise<number> {
    return this.appointmentModel.countDocuments(payload);
  }

  async aggregate(pipeline: PipelineStage[]) {
    return this.appointmentModel.aggregate(pipeline);
  }

  async bookAppointment(payload: BookAppointmentDto) {
    await this.create({
      ...payload,
      status: 'Awaiting Confirmation',
      date: moment(payload.date).toDate(),
    });
    // TODO: Alert hospital
    return {
      message:
        'Your appointment was booked successfully and awaiting confirmation from the hospital',
    };
  }

  async confirmAppointment(
    id: string,
    { date }: ConfirmAppointmentDto,
    hospital: Hospital,
  ) {
    const appointment = await this.findOne({ _id: id });
    if (!appointment)
      throw new BadRequestException('Appointment does not exist');
    if (appointment.hospital !== hospital.id)
      throw new BadRequestException(
        'Appointment does not belong to your hospital',
      );
    if (appointment.status !== 'Awaiting Confirmation')
      throw new BadRequestException('Appointment is not awaiting confirmation');

    if (date) appointment.date = moment(date).toDate();
    appointment.status = 'Confirmed';
    await appointment.save();
    // TODO: Alert donor
    return {
      message: "You have successfully confirmed a donor's appointment",
    };
  }

  async cancelAppointment(id: string, hospital: Hospital) {
    const appointment = await this.findOne({ _id: id });
    if (!appointment)
      throw new BadRequestException('Appointment does not exist');
    if (appointment.hospital !== hospital.id)
      throw new BadRequestException(
        'Appointment does not belong to your hospital',
      );
    appointment.status = 'Cancelled';
    await appointment.save();
    // TODO: Alert donor
    return {
      message: "You have successfully confirmed a donor's appointment",
    };
  }

  async rescheduleAppointment(
    id: string,
    { date }: RescheduleAppointmentDto,
    hospital: Hospital,
  ) {
    const appointment = await this.findOne({ _id: id });
    if (!appointment)
      throw new BadRequestException('Appointment does not exist');
    if (appointment.hospital !== hospital.id)
      throw new BadRequestException(
        'Appointment does not belong to your hospital',
      );
    if (appointment.status !== 'Confirmed')
      throw new BadRequestException('Appointment cannot be rescheduled');
    if (moment(date).isBefore(moment()))
      throw new BadRequestException('Date cannot be before today');
    appointment.date = moment(date).toDate();
    await appointment.save();
    // TODO: Alert donor
    return {
      message: "You have successfully rescheduled a donor's appointment",
    };
  }

  async fetchAppointments(query: ListAppointmentsDto, hospital: Hospital) {
    const filter: FilterQuery<Appointment> = { hospital: hospital.id };
    if (query.search) {
      filter.$or = [{ name: new RegExp(`^${query.search}`, 'i') }];
    }
    if (query.date) {
      filter.date = moment(query.date).toDate();
    }
    const [appointments, total] = await Promise.all([
      this.find(
        filter,
        (Number(query.page) - 1) * Number(query.perPage),
        Number(query.perPage),
        undefined,
        { updatedAt: -1 },
      ),
      this.count(filter),
    ]);
    return {
      appointments,
      total,
    };
  }
}
