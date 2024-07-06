import { Controller, Post, Body, Get, Query, Param } from '@nestjs/common';
import { HospitalsService } from './hospitals.service';
import { CreateHospitalDto } from './dto/create-hospital.dto';
import { ApiTags } from '@nestjs/swagger';
import {
  FindAllBloodBanksDto,
  FindAllBloodBanksNearMeDto,
  FindHospitalDto,
} from './dto/find-hospitals.dto';

@ApiTags('Hospitals')
@Controller('hospitals')
export class HospitalsController {
  constructor(private readonly hospitaService: HospitalsService) {}

  @Get()
  async findAll(@Query() query: FindAllBloodBanksDto) {
    return this.hospitaService.getBloodBanks(query);
  }

  @Get('near-me')
  async findAllNearMe(@Query() query: FindAllBloodBanksNearMeDto) {
    return this.hospitaService.getBloodBanksNearMe(query);
  }

  @Get(':id/single')
  async getHospital(@Param() param: FindHospitalDto) {
    return this.hospitaService.getHospital(param.id);
  }
}
