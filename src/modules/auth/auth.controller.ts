import { Controller, Post, Body, HttpStatus, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { CreateHospitalDto } from '../hospitals/dto/create-hospital.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() signInDto: LoginUserDto) {
    return this.authService.login(signInDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login/hospital')
  async hospitalLogin(@Body() signInDto: LoginUserDto) {
    return this.authService.hospitalLogin(signInDto);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('register/hospital')
  async hospitalSignup(@Body() body: CreateHospitalDto) {
    return this.authService.registerHospital(body);
  }
}
