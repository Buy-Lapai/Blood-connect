import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { DonationsService } from './donation.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FindDonationsDto } from './dto/find-donation.dto';
import { CreateDonationDto } from './dto/create-donation.dto';
import { IRequest } from 'src/interfaces/express';
import { HospitalGuard } from 'src/guards/hospital.guard';

@Controller('donations')
export class DonationsController {
  constructor(private donationsService: DonationsService) {}

  @UseGuards(JwtAuthGuard)
  @UseGuards(HospitalGuard)
  @Get()
  async findAll(@Query() query: FindDonationsDto, @Req() req: IRequest) {
    return this.donationsService.findDonations(query, req.hospital);
  }

  @UseGuards(HospitalGuard)
  @Post()
  async create(@Body() body: CreateDonationDto, @Req() req: IRequest) {
    return this.donationsService.createDonation({
      ...body,
      hospital: req.hospital!.id,
    });
  }
}
