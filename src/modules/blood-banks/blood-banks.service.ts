import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  FilterQuery,
  Model,
  PipelineStage,
  PopulateOptions,
  SortOrder,
} from 'mongoose';
import { BloodBank, BloodBankDocument } from './blood-banks.schema';

@Injectable()
export class BloodBanksService {
  constructor(
    @InjectModel(BloodBank.name)
    private bloodbankModel: Model<BloodBankDocument>,
  ) {}

  async find(
    query: FilterQuery<BloodBank>,
    skip?: number,
    limit?: number,
    populate?: PopulateOptions[],
    sort?: { [key: string]: SortOrder },
  ): Promise<BloodBank[]> {
    return this.bloodbankModel
      .find(query)
      .skip(skip)
      .limit(limit)
      .sort(sort)
      .populate(populate);
  }

  async findOne(
    payload: FilterQuery<BloodBank>,
    populate?: PopulateOptions[],
  ): Promise<BloodBankDocument> {
    return this.bloodbankModel.findOne(payload).populate(populate);
  }

  async create(payload: BloodBank): Promise<BloodBank> {
    return this.bloodbankModel.create(payload);
  }

  async count(payload: FilterQuery<BloodBank>): Promise<number> {
    return this.bloodbankModel.countDocuments(payload);
  }

  async aggregate(pipeline: PipelineStage[]) {
    return this.bloodbankModel.aggregate(pipeline);
  }
}
