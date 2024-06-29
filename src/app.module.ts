import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { DonationsModule } from './modules/donations/donation.module';
import { VisitsModule } from './modules/visits/visits.module';
import { HospitalModule } from './modules/hospitals/hospitals.module';
import { GlobalModule } from './global.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ResponseInterceptor } from './interceptors/response.interceptor';
import { AllExceptionsFilter } from './filters/exception.filter';

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
  ],
  providers: [
    // {
    //   provide: 'APP_FILTER',
    //   useClass: AllExceptionsFilter,
    // },
    // {
    //   provide: 'APP_INTERCEPTOR',
    //   useClass: ResponseInterceptor,
    // },
  ],
})
export class AppModule {}
