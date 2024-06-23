import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Donor, DonorSchema } from './donor.schema';
import { DonorsService } from './donors.service';
import { DonorsController } from './donors.controller';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Donor.name, schema: DonorSchema }]),
    ],
    providers: [DonorsService],
    controllers: [DonorsController],
})
export class DonorsModule {}
