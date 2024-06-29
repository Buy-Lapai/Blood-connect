import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { LoginUserDto } from './dto/login-user.dto';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { HospitalsService } from '../hospitals/hospitals.service';
import { JwtService } from 'src/services/jwt.service';
import { CreateHospitalDto } from '../hospitals/dto/create-hospital.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private hospitalService: HospitalsService,
  ) {}

  async login(loginUserDto: LoginUserDto) {
    const user = await this.usersService.findOneByEmail(loginUserDto.email);
    if (!user) {
      throw new NotFoundException('Email does not exist on this platform');
    }
    const isPasswordCorrect = bcrypt.compareSync(
      loginUserDto.password,
      user.password,
    );
    if (!isPasswordCorrect) {
      throw new UnauthorizedException(
        'Incorrect password. Please confirm your password and try again.',
      );
    }

    return {
      accessToken: this.jwtService.GenerateAccessToken({
        id: user.id,
        type: 'user',
      }),
    };
  }

  async hospitalLogin(loginUserDto: LoginUserDto) {
    const hospital = await this.hospitalService.findOne({
      email: loginUserDto.email.toLocaleLowerCase(),
    });
    if (!hospital) {
      throw new NotFoundException(
        'This email is not registered to any hospital on this platform',
      );
    }
    const isPasswordCorrect = bcrypt.compareSync(
      loginUserDto.password,
      hospital.password,
    );
    if (!isPasswordCorrect) {
      throw new UnauthorizedException(
        'Incorrect password. Please confirm your password and try again.',
      );
    }
    const accessToken = this.jwtService.GenerateAccessToken({
      id: hospital.id,
      type: 'hospital',
    });
    hospital.accessToken = accessToken;
    await hospital.save();
    return {
      accessToken,
    };
  }

  async registerHospital(payload: CreateHospitalDto) {
    const [nameExists, emailExists] = await Promise.all([
      this.hospitalService.findOne({
        name: new RegExp(`^${payload.name}`, 'i'),
      }),
      this.hospitalService.findOne({
        email: payload.email.toLocaleLowerCase(),
      }),
    ]);
    if (nameExists)
      throw new BadRequestException('An hospital with this name already exist');
    if (emailExists)
      throw new BadRequestException(
        'An hospital with this email already exist',
      );
    const hospital = await this.hospitalService.create({
      ...payload,
      password: bcrypt.hashSync(payload.password, 12),
      email: payload.email.toLocaleLowerCase(),
    });
    return {
      accessToken: this.jwtService.GenerateAccessToken({
        id: hospital.id,
        type: 'hospital',
      }),
    };
  }
}
