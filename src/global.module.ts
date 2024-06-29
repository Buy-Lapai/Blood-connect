import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './modules/users/user.schema';
import { Hospital, HospitalSchema } from './modules/hospitals/hospitals.schema';
import { Donation, DonationSchema } from './modules/donations/donation.schema';
import { JwtService } from './services/jwt.service';
import { JwtMiddleware } from './middlewares/jwt.middleware';
import { HospitalsService } from './modules/hospitals/hospitals.service';
import { UsersService } from './modules/users/users.service';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Hospital.name, schema: HospitalSchema },
      { name: Donation.name, schema: DonationSchema },
    ]),
  ],
  controllers: [],
  providers: [JwtService, JwtMiddleware, HospitalsService, UsersService],
  exports: [JwtService, JwtMiddleware, UsersService],
})
export class GlobalModule {}
