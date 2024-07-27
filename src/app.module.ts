import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { DonationsModule } from './modules/donations/donation.module';
import { VisitsModule } from './modules/visits/visits.module';
import { HospitalModule } from './modules/hospitals/hospitals.module';
import { GlobalModule } from './global.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BloodBanksModule } from './modules/blood-banks/blood-banks.module';
import { AppointmentsModule } from './modules/appointments/appointment.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('DB'),
      }),
    }),
    GlobalModule,
    AuthModule,
    UsersModule,
    DonationsModule,
    VisitsModule,
    HospitalModule,
    BloodBanksModule,
    AppointmentsModule,
  ],
})
export class AppModule {}
