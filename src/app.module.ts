import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { DonorsModule } from './donors/donors.module';
import { BloodBanksModule } from './blood-banks/blood-banks.module';

@Module({
    imports: [
        MongooseModule.forRoot(''),
        AuthModule,
        UsersModule,
        DonorsModule,
        BloodBanksModule,
    ],
})
export class AppModule {}
