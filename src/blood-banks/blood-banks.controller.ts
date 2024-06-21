import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { BloodBanksService } from './blood-banks.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { BloodBankDto } from './dto/blood-bank.dto';

@Controller('blood-banks')
export class BloodBanksController {
    constructor(private bloodBanksService: BloodBanksService) {}

    @UseGuards(JwtAuthGuard)
    @Get()
    async findAll() {
        return this.bloodBanksService.findAll();
    }
    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.bloodBanksService.findOne(id);
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    async create(@Body() bloodBankDto: BloodBankDto) {
        return this.bloodBanksService.create(bloodBankDto);
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard)
    async update(@Param('id') id: string, @Body() bloodBankDto: BloodBankDto) {
        return this.bloodBanksService.update(id, bloodBankDto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    async delete(@Param('id') id: string) {
        return this.bloodBanksService.delete(id);
    }
}
