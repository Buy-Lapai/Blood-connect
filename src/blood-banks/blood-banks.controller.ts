import { Controller, Get } from '@nestjs/common';
import { BloodBanksService } from './blood-banks.service';

@Controller('blood-banks')
export class BloodBanksController {
    constructor(private bloodBanksService: BloodBanksService) {}

    @Get()
    async findAll() {
        return this.bloodBanksService.findAll();
    }
}
