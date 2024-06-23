import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Put,
  Param,
} from '@nestjs/common';
import { VisitsService } from './visits.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateVisitDto } from './dto/create-visit.dto';

@Controller('visits')
export class VisitsController {
  constructor(private visitsService: VisitsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async scheduleVisit(
    @Body()
    createVisitDto: {
      donor: string;
      bloodBank: string;
      visitDate: Date;
    },
  ) {
    return this.visitsService.scheduleVisit(
      createVisitDto.donor,
      createVisitDto.bloodBank,
      createVisitDto.visitDate,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll() {
    return this.visitsService.findAll();
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() createVisitDto: CreateVisitDto,
  ) {
    return this.visitsService.update(id, createVisitDto);
  }
}
