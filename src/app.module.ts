import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { DonorsModule } from './modules/donors/donors.module';
import { VisitsModule } from './modules/visits/visits.module';
import { JwtModule } from '@nestjs/jwt';
import { HospitalModule } from './modules/hospitals/hospitals.module';

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
    VisitsModule,
    HospitalModule
  ],
})
export class AppModule {}
