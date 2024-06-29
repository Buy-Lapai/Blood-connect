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

@Injectable()
export class HospitalsService {
  constructor(
    @InjectModel(Hospital.name) private hospitalModel: Model<HospitalDocument>,
    private configService: ConfigService,
  ) {}

  async create(payload: CreateHospitalDto): Promise<Hospital> {
    return this.hospitalModel.create(payload);
  }

  async findOne(
    query: FilterQuery<HospitalDocument>,
  ): Promise<Hospital | null> {
    return this.hospitalModel.findOne(query);
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
    const query: FilterQuery<HospitalDocument> = {
      state: new RegExp(request.state, 'i'),
      lga: new RegExp(request.lga, 'i'),
    };
    if (request.search)
      query.$or = [
        { address: new RegExp(`^${request.search}`, 'i') },
        { name: new RegExp(`^${request.search}`, 'i') },
      ];
    const [hospitals, total] = await Promise.all([
      this.findMany(
        query,
        (Number(request.page) - 1) * Number(request.perPage),
        Number(request.perPage),
        { name: 'asc' },
      ),
      this.count(query),
    ]);
    return { hospitals, total };
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
}
