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
import { FindDonationsDto, FindTopDonorsDto } from './dto/find-donation.dto';
import { CreateDonationDto } from './dto/create-donation.dto';
import { IRequest } from 'src/interfaces/express';
import { HospitalGuard } from 'src/guards/hospital.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Donations')
@Controller('donations')
export class DonationsController {
  constructor(private donationsService: DonationsService) {}

  @ApiBearerAuth()
  @Get()
  async findAll(@Query() query: FindDonationsDto, @Req() req: IRequest) {
    return this.donationsService.findDonations(query, req.hospital);
  }

  @ApiBearerAuth()
  @UseGuards(HospitalGuard)
  @Post()
  async create(@Body() body: CreateDonationDto, @Req() req: IRequest) {
    return this.donationsService.createDonation(body, req.hospital!);
  }

  @ApiBearerAuth()
  @Get('users')
  async userDonationsSummary(
    @Query() query: FindDonationsDto,
    @Req() req: IRequest,
  ) {
    return this.donationsService.aggregateDonations(query, req.hospital);
  }

  @Get('top-donors')
  async topDonors(@Query() query: FindTopDonorsDto) {
    return this.donationsService.topDonors(query);
  }
}
