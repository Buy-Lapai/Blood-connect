// src/users/users.controller.ts

import { Controller, Post, Body, UseGuards, Get, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { HospitalGuard } from 'src/guards/hospital.guard';
import { FindUsersDto } from './dto/find-user.dto';

@ApiTags('Users')
@Controller('users')
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(HospitalGuard)
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Get()
  async getMany(@Query() query: FindUsersDto) {
    return this.usersService.findMany(query);
  }
}
