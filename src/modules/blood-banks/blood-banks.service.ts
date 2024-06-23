import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BloodBank, BloodBankDocument } from './blood-bank.schema';
import { BloodBankDto } from './dto/blood-bank.dto';

@Injectable()
export class BloodBanksService {
    constructor(@InjectModel(BloodBank.name) private bloodBankModel: Model<BloodBankDocument>) {}

    async findAll(): Promise<BloodBank[]> {
        return this.bloodBankModel.find().exec();
    }

    async findOne(id: string): Promise<BloodBankDocument> {
        return this.bloodBankModel.findById(id).exec();
    }

    async create(createBloodBankDto: BloodBankDto): Promise<BloodBankDocument> {
        const createdBloodBank = new this.bloodBankModel(createBloodBankDto);
        return createdBloodBank.save();
    }

    async update(id: string, updateBloodBankDto: BloodBankDto): Promise<BloodBankDocument> {
        return this.bloodBankModel.findByIdAndUpdate(id, updateBloodBankDto, { new: true }).exec();
    }

    async delete(id: string): Promise<BloodBankDocument> {
        return this.bloodBankModel.findByIdAndDelete(id).exec();
    }
}
