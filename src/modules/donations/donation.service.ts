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
import { FindDonationsDto } from './dto/find-donation.dto';

@Injectable()
export class DonationsService {
  constructor(
    @InjectModel(Donation.name) private donationModel: Model<DonationDocument>,
    private userService: UsersService,
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
    const storeDonation = await this.create({
      ...payload,
      hospital: hospital.id,
    });
    if (!storeDonation)
      throw new BadRequestException('Failed to store data. Please try again');

    hospital.totalNumberOfPints += payload.quantity;
    hospital.numberOfPintsAvailable += payload.quantity;
    await hospital.save();

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
}
