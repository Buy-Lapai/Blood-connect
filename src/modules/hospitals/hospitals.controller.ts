import { Controller, Post, Body } from '@nestjs/common';
import { HospitalsService } from './hospitals.service';
import { CreateHospitalDto } from './dto/create-hospital';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Hospitals')
@Controller('hospitals')
export class HospitalsController {
  constructor(private readonly hospitaService: HospitalsService) {}

  @Post('')
  async create(@Body() payload: CreateHospitalDto) {
    return this.hospitaService.register(payload);
  }
}
