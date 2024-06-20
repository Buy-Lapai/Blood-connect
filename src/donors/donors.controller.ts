import { Controller, Get } from '@nestjs/common';
import { DonorsService } from './donors.service';

@Controller('donors')
export class DonorsController {
    constructor(private donorsService: DonorsService) {}

    @Get()
    async findAll() {
        return this.donorsService.findAll();
    }
}
