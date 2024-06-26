import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { HospitalsService } from './hospitals.service';
import { CreateHospitalDto } from './dto/create-hospital.dto';
import { ApiTags } from '@nestjs/swagger';
import {
  FindAllBloodBanksDto,
  FindAllBloodBanksNearMeDto,
} from './dto/find-hospitals.dto';

@ApiTags('Hospitals')
@Controller('hospitals')
export class HospitalsController {
  constructor(private readonly hospitaService: HospitalsService) {}

  @Post()
  async create(@Body() payload: CreateHospitalDto) {
    return this.hospitaService.register(payload);
  }

  @Get()
  async findAll(@Query() query: FindAllBloodBanksDto) {
    return this.hospitaService.getBloodBanks(query);
  }

  @Get('near-me')
  async findAllNearMe(@Query() query: FindAllBloodBanksNearMeDto) {
    return this.hospitaService.getBloodBanksNearMe(query);
  }
}
