import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './modules/users/user.schema';
import { Hospital, HospitalSchema } from './modules/hospitals/hospitals.schema';
import { Donation, DonationSchema } from './modules/donations/donation.schema';
import { JwtService } from './services/jwt.service';
import { JwtMiddleware } from './middlewares/jwt.middleware';
import { HospitalsService } from './modules/hospitals/hospitals.service';
import { UsersService } from './modules/users/users.service';
import { BloodBanksService } from './modules/blood-banks/blood-banks.service';
import {
  BloodBank,
  BloodBankSchema,
} from './modules/blood-banks/blood-banks.schema';
import { Appointment, AppointmentSchema } from './modules/appointments/appointment.schema';
import { AppointmentsService } from './modules/appointments/appointment.service';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Hospital.name, schema: HospitalSchema },
      { name: Donation.name, schema: DonationSchema },
      { name: BloodBank.name, schema: BloodBankSchema },
      { name: Appointment.name, schema: AppointmentSchema },
    ]),
  ],
  controllers: [],
  providers: [
    JwtService,
    JwtMiddleware,
    HospitalsService,
    UsersService,
    BloodBanksService,
    AppointmentsService
  ],
  exports: [
    JwtService,
    JwtMiddleware,
    UsersService,
    HospitalsService,
    BloodBanksService,
    AppointmentsService
  ],
})
export class GlobalModule {}
