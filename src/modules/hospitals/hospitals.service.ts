import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, SortOrder } from 'mongoose';
import { Hospital, HospitalDocument } from './hospitals.schema';
import { CreateHospitalDto } from './dto/create-hospital.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import {
  FindAllBloodBanksDto,
  FindAllBloodBanksNearMeDto,
} from './dto/find-hospitals.dto';
import {
  BloodBank,
  BloodBankDocument,
} from '../blood-banks/blood-banks.schema';
import { BloodBanksService } from '../blood-banks/blood-banks.service';

@Injectable()
export class HospitalsService {
  constructor(
    @InjectModel(Hospital.name) private hospitalModel: Model<HospitalDocument>,
    private readonly bloodBankService: BloodBanksService,
    private configService: ConfigService,
  ) {}

  async create(payload: Partial<HospitalDocument>): Promise<Hospital> {
    return this.hospitalModel.create(payload);
  }

  async findOne(
    query: FilterQuery<HospitalDocument>,
    select?: string,
  ): Promise<Hospital | null> {
    return this.hospitalModel.findOne(query).select(select);
  }

  async findMany(
    query: FilterQuery<HospitalDocument>,
    skip?: number,
    limit?: number,
    sort?: { [key: string]: SortOrder },
    populate?: { path: string; select?: string }[],
  ): Promise<Hospital[]> {
    return this.hospitalModel
      .find(query)
      .skip(skip)
      .limit(limit)
      .sort(sort!)
      .populate(populate!)
      .select('-__v -password -email -totalNumberOfPints');
  }

  async count(query: FilterQuery<HospitalDocument>): Promise<number> {
    return this.hospitalModel.countDocuments(query);
  }

  async getBloodBanksNearMe(request: FindAllBloodBanksNearMeDto) {
    const bloodBanks = await this.bloodBankService.find({
      bloodGroup: request.bloodGroup,
      totalAvailable: { $gt: 0 },
    });
    const query: FilterQuery<HospitalDocument> = {
      _id: { $in: bloodBanks.map((data) => data.hospital) },
    };
    if (request.search)
      query.$or = [
        { address: new RegExp(`^${request.search}`, 'i') },
        { name: new RegExp(`^${request.search}`, 'i') },
      ];
    const [hospitals, total] = await Promise.all([
      this.hospitalModel.aggregate([
        {
          $geoNear: {
            near: {
              type: 'Point',
              coordinates: [
                Number(request.longitude),
                Number(request.latitude),
              ],
            },
            distanceField: 'dist.calculated',
            // maxDistance: 10,
            query,
          },
        },
        { $sort: { distanceField: 1 } },
        { $skip: (Number(request.page) - 1) * Number(request.perPage) },
        { $limit: Number(request.perPage) },
      ]),
      this.hospitalModel.aggregate([
        {
          $geoNear: {
            near: {
              type: 'Point',
              coordinates: [
                Number(request.longitude),
                Number(request.latitude),
              ],
            },
            distanceField: 'dist.calculated',
            // maxDistance: 10,
            query,
          },
        },
        { $count: 'total' },
      ]),
    ]);
    return { hospitals, total: total[0]?.total || 0 };
  }

  async getBloodBanks(request: FindAllBloodBanksDto) {
    const query: FilterQuery<HospitalDocument> = {};
    if (request.search)
      query.$or = [
        { address: new RegExp(`${request.search}`, 'i') },
        { name: new RegExp(`${request.search}`, 'i') },
      ];
    const [hospitals, total] = await Promise.all([
      this.findMany(
        query,
        (Number(request.page) - 1) * Number(request.perPage),
        Number(request.perPage),
        { name: 'asc' },
        undefined,
      ),
      this.count(query),
    ]);
    return { hospitals, total };
  }

  async getHospital(id: string) {
    const hospital = await this.findOne({ _id: id }, '-__v -password -accessToken');
    return { hospital };
  }
}
