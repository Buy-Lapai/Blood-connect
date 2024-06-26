import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { Hospital, HospitalDocument } from './hospitals.schema';
import { CreateHospitalDto } from './dto/create-hospital';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class HospitalsService {
  constructor(
    @InjectModel(Hospital.name) private hospitalModel: Model<HospitalDocument>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async create(payload: CreateHospitalDto): Promise<Hospital> {
    return this.hospitalModel.create(payload);
  }

  async findOne(
    query: FilterQuery<HospitalDocument>,
  ): Promise<Hospital | null> {
    return this.hospitalModel.findOne(query);
  }

  async register(payload: CreateHospitalDto) {
    const [nameExists, emailExists] = await Promise.all([
      this.findOne({ name: new RegExp(`^${payload.name}`, 'i') }),
      this.findOne({ email: payload.email.toLocaleLowerCase() }),
    ]);
    if (nameExists)
      throw new BadRequestException(
        'An hospital with this name already exist',
      );
    if (emailExists)
      throw new BadRequestException(
        'An hospital with this email already exist',
      );
    const hospital = await this.create({
      ...payload,
      password: bcrypt.hashSync(payload.password, 12),
      email: payload.email.toLocaleLowerCase(),
    });
    return {
      accessToken: this.jwtService.sign(
        { email: hospital.email, sub: hospital._id },
        {
          secret: this.configService.get<string>('JWT_SECRET'),
        },
      ),
    };
  }
}
