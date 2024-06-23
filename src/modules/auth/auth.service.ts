import {
  Injectable,
  BadRequestException,
  ArgumentMetadata,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginUserDto } from './dto/login-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { validate } from 'class-validator';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
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
    const payload = { email: user.email, sub: user._id };
    return {
      accessToken: this.jwtService.sign(payload, {
        secret: this.configService.get<string>('JWT_SECRET'),
      }),
    };
  }

  async register(createUserDto: CreateUserDto) {
    const user = await this.usersService.findOneByEmail(createUserDto.email);
    if (user) {
      throw new BadRequestException('Email already exists on this platform');
    }

    const newUser = await this.usersService.create({
      ...createUserDto,
      email: createUserDto.email.toLocaleLowerCase(),
      password: bcrypt.hashSync(createUserDto.password, 12),
    });

    const payload = { email: newUser.email, sub: newUser._id };
    return {
      accessToken: this.jwtService.sign(payload, {
        secret: this.configService.get<string>('JWT_SECRET'),
      }),
    };
  }
}
