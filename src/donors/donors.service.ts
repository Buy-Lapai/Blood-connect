import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Donor, DonorDocument } from './donor.schema';

@Injectable()
export class DonorsService {
    constructor(@InjectModel(Donor.name) private donorModel: Model<DonorDocument>) {}

    async findAll(): Promise<Donor[]> {
        return this.donorModel.find().exec();
    }
}
