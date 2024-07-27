import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Appointment, AppointmentSchema } from './appointment.schema';
import { AppointmentsService } from './appointment.service';
import { AppointmentsController } from './appointment.controller';
import { JwtMiddleware } from 'src/middlewares/jwt.middleware';
import { GlobalModule } from 'src/global.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Appointment.name, schema: AppointmentSchema },
    ]),
    GlobalModule,
  ],
  providers: [AppointmentsService],
  controllers: [AppointmentsController],
})
export class AppointmentsModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtMiddleware)
      .exclude({ path: 'appointments', method: RequestMethod.POST })
      .forRoutes('appointments');
  }
}
