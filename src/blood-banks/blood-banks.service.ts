import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BloodBank, BloodBankDocument } from './blood-bank.schema';

@Injectable()
export class BloodBanksService {
    constructor(@InjectModel(BloodBank.name) private bloodBankModel: Model<BloodBankDocument>) {}

    async findAll(): Promise<BloodBank[]> {
        return this.bloodBankModel.find().exec();
    }
}
