import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Donation, DonationSchema } from './donation.schema';
import { DonationsService } from './donation.service';
import { DonationsController } from './donation.controller';
import { JwtMiddleware } from 'src/middlewares/jwt.middleware';
import { GlobalModule } from 'src/global.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Donation.name, schema: DonationSchema },
    ]),
    GlobalModule,
  ],
  providers: [DonationsService],
  controllers: [DonationsController],
})
export class DonationsModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtMiddleware)
      .exclude({ path: 'donations/top-donors', method: RequestMethod.GET })
      .forRoutes('donations');
  }
}
