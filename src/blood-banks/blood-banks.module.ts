import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BloodBank, BloodBankSchema } from './blood-bank.schema';
import { BloodBanksService } from './blood-banks.service';
import { BloodBanksController } from './blood-banks.controller';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: BloodBank.name, schema: BloodBankSchema }]),
    ],
    providers: [BloodBanksService],
    controllers: [BloodBanksController],
})
export class BloodBanksModule {}
