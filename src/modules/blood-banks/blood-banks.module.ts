import { MiddlewareConsumer, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from '../users/users.module';
import { JwtMiddleware } from 'src/middlewares/jwt.middleware';
import { GlobalModule } from 'src/global.module';
import { BloodBank, BloodBankSchema } from './blood-banks.schema';
import { BloodBanksService } from './blood-banks.service';
import { BloodBanksController } from './blood-banks.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: BloodBank.name, schema: BloodBankSchema },
    ]),
    UsersModule,
    GlobalModule,
  ],
  providers: [BloodBanksService],
  controllers: [BloodBanksController],
})
export class BloodBanksModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtMiddleware).forRoutes('bloodbanks');
  }
}
