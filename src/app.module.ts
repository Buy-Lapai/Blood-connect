import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { DonorsModule } from './donors/donors.module';
import { BloodBanksModule } from './blood-banks/blood-banks.module';
import { VisitsModule } from './visits/visits.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [
        MongooseModule.forRoot('mongodb://localhost:27017/BloodConnectDB'),
        JwtModule.register({
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: '1d' },
      }),
        AuthModule,
        UsersModule,
        DonorsModule,
        BloodBanksModule,
        VisitsModule,
    ],
})
export class AppModule {}
