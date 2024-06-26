import { Module } from '@nestjs/common';
import { HospitalsService } from './hospitals.service';
import { HospitalsController } from './hospitals.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Hospital, HospitalSchema } from './hospitals.schema';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Hospital.name, schema: HospitalSchema },
    ]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
    ConfigModule.forRoot(),
  ],
  providers: [HospitalsService],
  controllers: [HospitalsController],
  exports: [HospitalsService],
})
export class HospitalModule {}
