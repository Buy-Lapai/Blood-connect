import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Visit, VisitDocument } from './visit.schema';
import { CreateVisitDto } from './dto/create-visit.dto';

@Injectable()
export class VisitsService {
    constructor(@InjectModel(Visit.name) private visitModel: Model<VisitDocument>) {}

    async scheduleVisit(donor: string, bloodBank: string, visitDate: Date): Promise<Visit> {
        const visit = new this.visitModel({ donor, bloodBank, visitDate });
        return visit.save();
    }

    async findAll(): Promise<Visit[]> {
        return this.visitModel.find().populate('donor').populate('bloodBank').exec();
    }

    async update(id: string, createVisitDto: CreateVisitDto): Promise<Visit> {
        return this.visitModel.findByIdAndUpdate(id, createVisitDto, { new: true }).exec();
    }
}
