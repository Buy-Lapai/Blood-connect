import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  FilterQuery,
  Model,
  PipelineStage,
  PopulateOptions,
  SortOrder,
} from 'mongoose';
import { Donation, DonationDocument } from './donation.schema';
import { UsersService } from '../users/users.service';
import { Hospital } from '../hospitals/hospitals.schema';
import { CreateDonationDto } from './dto/create-donation.dto';
import { FindDonationsDto, FindTopDonorsDto } from './dto/find-donation.dto';
import { BloodBanksService } from '../blood-banks/blood-banks.service';
import { AppointmentsService } from '../appointments/appointment.service';

@Injectable()
export class DonationsService {
  constructor(
    @InjectModel(Donation.name) private donationModel: Model<DonationDocument>,
    private userService: UsersService,
    private bloodbankService: BloodBanksService,
    private appointmentService: AppointmentsService,
  ) {}

  async find(
    query: FilterQuery<Donation>,
    skip?: number,
    limit?: number,
    populate?: PopulateOptions[],
    sort?: { [key: string]: SortOrder },
  ): Promise<Donation[]> {
    return this.donationModel
      .find(query)
      .skip(skip)
      .limit(limit)
      .sort(sort)
      .populate(populate);
  }

  async create(payload: Donation): Promise<Donation> {
    return this.donationModel.create(payload);
  }

  async count(payload: FilterQuery<Donation>): Promise<number> {
    return this.donationModel.countDocuments(payload);
  }

  async aggregate(pipeline: PipelineStage[]) {
    return this.donationModel.aggregate(pipeline);
  }

  async findDonations(payload: FindDonationsDto, hospital?: Hospital) {
    const query: FilterQuery<Donation> = {};
    if (hospital) query.hospital = hospital.id;
    if (payload.search) {
      const users = await this.userService.find(
        {
          $or: [
            { firstName: new RegExp(`^${payload.search}`, 'i') },
            { lastName: new RegExp(`^${payload.search}`, 'i') },
          ],
        },
        0,
        50,
        'id',
      );
      query.user = { $in: users.map((data) => data.id) };
    }
    const [donations, total] = await Promise.all([
      this.find(
        query,
        (Number(payload.page) - 1) * Number(payload.perPage),
        Number(payload.perPage),
        [{ path: 'user', select: '-password -__v -_id' }],
      ),
      this.count(query),
    ]);
    return { donations, total };
    // const pipeline: PipelineStage[] = [];
    // const b = await this.aggregate([
    //   { $match: query },
    //   { $sort: { createdAt: -1 } },
    //   { $skip: (Number(payload.page) - 1) * Number(payload.perPage) },
    //   { $limit: Number(payload.perPage) },
    //   { $group: { _id: '$user', totalDonated: { $sum: '$quantity' } } },
    // ]);
  }

  async createDonation(payload: CreateDonationDto, hospital: Hospital) {
    const donor = await this.userService.findOne({ _id: payload.user });
    if (!donor)
      throw new BadRequestException('Donor does not exist on our database');

    const storeDonation = await this.create({
      ...payload,
      hospital: hospital.id,
    });
    if (!storeDonation)
      throw new BadRequestException('Failed to store data. Please try again');

    const bank = await this.bloodbankService.findOne({
      bloodGroup: donor.bloodGroup,
      hospital: hospital.id,
    });
    if (!bank) {
      await this.bloodbankService.create({
        bloodGroup: donor.bloodGroup,
        totalAvailable: payload.quantity,
        totalDonated: payload.quantity,
        hospital: hospital.id,
      });
    } else {
      bank.totalAvailable += payload.quantity;
      bank.totalDonated += payload.quantity;
      await bank.save();
    }

    if (payload.appointment)
      await this.appointmentService.update(
        { status: 'Donated' },
        { _id: payload.appointment },
      );

    return { message: 'Successful' };
  }

  async aggregateDonations(payload: FindDonationsDto, hospital?: Hospital) {
    const query: FilterQuery<Donation> = {};
    if (hospital) query.hospital = hospital.id;
    if (payload.search) {
      const users = await this.userService.find(
        {
          $or: [
            { firstName: new RegExp(`^${payload.search}`, 'i') },
            { lastName: new RegExp(`^${payload.search}`, 'i') },
          ],
        },
        0,
        50,
        'id',
      );
      query.user = { $in: users.map((data) => data.id) };
    }

    const [donations, total] = await Promise.all([
      this.aggregate([
        { $match: query },
        { $sort: { createdAt: -1 } },
        { $skip: (Number(payload.page) - 1) * Number(payload.perPage) },
        { $limit: Number(payload.perPage) },
        {
          $group: {
            _id: '$user',
            totalDonated: { $sum: '$quantity' },
            lastDonatedAt: { $first: '$createdAt' },
          },
        },
      ]),
      this.aggregate([
        { $match: query },
        { $group: { _id: '$user' } },
        { $count: 'total' },
      ]),
    ]);
    await this.userService.populate(donations, {
      path: '_id',
      select: '-_id -__v -password',
    });
    return { donations, total: total[0].total };
  }

  async topDonors(payload: FindTopDonorsDto) {
    const query: FilterQuery<Donation> = {};
    if (payload.search) {
      const users = await this.userService.find(
        {
          $or: [
            { firstName: new RegExp(`^${payload.search}`, 'i') },
            { lastName: new RegExp(`^${payload.search}`, 'i') },
          ],
          bloodGroup: payload.bloodGroup,
        },
        0,
        50,
        'id',
      );
      query.user = { $in: users.map((data) => data.id) };
    } else {
      const users = await this.userService.find({
        bloodGroup: payload.bloodGroup,
      });
      query.user = { $in: users.map((data) => data.id) };
    }

    const [donations] = await Promise.all([
      this.aggregate([
        { $match: query },
        {
          $group: {
            _id: '$user',
            totalDonated: { $sum: '$quantity' },
          },
        },
        { $sort: { totalDonated: -1 } },
      ]),
    ]);
    await this.userService.populate(donations, {
      path: '_id',
      select: '-_id -__v -password',
    });
    return { donations };
  }
}
