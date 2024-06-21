import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { DonorsService } from './donors.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Controller('donors')
export class DonorsController {
    constructor(private donorsService: DonorsService) {}

    @UseGuards(JwtAuthGuard)
    @Get()
    async findAll() {
        return this.donorsService.findAll();
    }

    @Post()
    async create(@Body() createUserDto: CreateUserDto) {
        return this.donorsService.create(createUserDto);
    }
}
