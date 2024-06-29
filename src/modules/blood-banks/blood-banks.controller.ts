import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { BloodBanksService } from './blood-banks.service';
import { HospitalGuard } from 'src/guards/hospital.guard';
import { IRequest } from 'src/interfaces/express';

@ApiTags('Blood Banks')
@ApiBearerAuth()
@Controller('bloodbanks')
export class BloodBanksController {
  constructor(private bloodbanksService: BloodBanksService) {}

  @UseGuards(HospitalGuard)
  @Get('')
  async getMany(@Req() req: IRequest) {
    return this.bloodbanksService.find({
      hospital: req.hospital!.id,
    });
  }
}
