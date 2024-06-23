import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Donor, DonorDocument } from './donor.schema';
import { CreateUserDto } from '../auth/dto/create-user.dto';

@Injectable()
export class DonorsService {
  constructor(
    @InjectModel(Donor.name) private donorModel: Model<DonorDocument>,
  ) {}

  async findAll(): Promise<Donor[]> {
    return this.donorModel.find().exec();
  }

  async create(createUserDto: CreateUserDto): Promise<Donor> {
    const createdDonor = new this.donorModel(createUserDto);
    return createdDonor.save();
  }
}
