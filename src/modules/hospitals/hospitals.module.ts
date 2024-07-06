import { MiddlewareConsumer, Module } from '@nestjs/common';
import { HospitalsService } from './hospitals.service';
import { HospitalsController } from './hospitals.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Hospital, HospitalSchema } from './hospitals.schema';
import { ConfigModule } from '@nestjs/config';
import { JwtMiddleware } from 'src/middlewares/jwt.middleware';
import { JwtService } from 'src/services/jwt.service';
import { GlobalModule } from 'src/global.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Hospital.name, schema: HospitalSchema },
    ]),
    ConfigModule.forRoot(),
    GlobalModule
  ],
  providers: [HospitalsService, JwtService],
  controllers: [HospitalsController],
  exports: [HospitalsService],
})
export class HospitalModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply().forRoutes('hospitals');
  }
}
