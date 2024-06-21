import { Injectable, BadRequestException, ArgumentMetadata } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginUserDto } from '../users/dto/login-user.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { validate } from 'class-validator';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private configService: ConfigService
    ) {}

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.usersService.findOneByEmail(email);
        if (user && user.password === pass) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(loginUserDto: LoginUserDto) {
        const user = await this.validateUser(loginUserDto.email, loginUserDto.password);
        if (!user) {
            return null;
        }
        const payload = { username: user.username, sub: user._id };
        return {
            access_token: this.jwtService.sign(payload, { secret: this.configService.get<string>('JWT_SECRET') }),
        };
    }

    async register(createUserDto: CreateUserDto) {

        if (!createUserDto.email) {
            throw new BadRequestException('Email field cannot be empty');
        }
        if (!createUserDto.first_name) {
            throw new BadRequestException('First name field cannot be empty');
        }
        if (!createUserDto.last_name) {
            throw new BadRequestException('Last name field cannot be empty');
        }
        if (!createUserDto.password) {
            throw new BadRequestException('Password field cannot be empty');
        }
        if (!createUserDto.username) {
            throw new BadRequestException('Username field cannot be empty');
        }
        if (!createUserDto.bloodType) {
            throw new BadRequestException('BloodType field cannot be empty');
        }
        if (!this.isValidEmail(createUserDto.email)) {
            throw new BadRequestException('Invalid email format');
        }
        const errors = await validate(createUserDto);
        if (errors.length > 0) {
            throw new BadRequestException(errors);
        }

        

        await this.validateUserDto(createUserDto);

        const existingEmail = await this.usersService.findOneByEmail(createUserDto.email);

        const existingUsername = await this.usersService.findOneByUsername(createUserDto.username);

        if (existingEmail) {
            throw new BadRequestException('Email already taken');
        }
        if (existingUsername){
            throw new BadRequestException('Username already taken');
        }

        const newUser = await this.usersService.create(createUserDto);

        const payload = { username: newUser.username, sub: newUser._id };
        return {
            access_token: this.jwtService.sign(payload, { secret: this.configService.get<string>('JWT_SECRET') }),
        };
    }

    private async validateUserDto(dto: CreateUserDto) {
        try {
            const metadata: ArgumentMetadata = { type: 'body' };
            await new ValidationPipe().transform(dto, metadata);
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }
    isValidEmail(email: string): boolean {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
}