import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { DonorsModule } from './modules/donors/donors.module';
import { BloodBanksModule } from './modules/blood-banks/blood-banks.module';
import { VisitsModule } from './modules/visits/visits.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.DB),
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
