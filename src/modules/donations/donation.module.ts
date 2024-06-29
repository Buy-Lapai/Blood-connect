import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Donation, DonationSchema } from './donation.schema';
import { DonationsService } from './donation.service';
import { DonationsController } from './donation.controller';
import { UsersModule } from '../users/users.module';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Donation.name, schema: DonationSchema }]),
        UsersModule
    ],
    providers: [DonationsService],
    controllers: [DonationsController],
})
export class DonationsModule {}
