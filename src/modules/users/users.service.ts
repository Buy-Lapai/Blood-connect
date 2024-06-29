import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { User, UserDocument } from './user.schema';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    return this.userModel.create(createUserDto);
  }

  async findOneByEmail(email: string): Promise<User | undefined> {
    return this.userModel.findOne({ email: email.toLocaleLowerCase() }).exec();
  }

  async findOneByUsername(username: string): Promise<User | undefined> {
    return this.userModel.findOne({ username }).exec();
  }

  async find(
    query: FilterQuery<User>,
    skip?: number,
    limit?: number,
    select?: string,
  ): Promise<User[]> {
    return this.userModel.find(query).skip(skip).limit(limit).select(select);
  }

  async findOne(query: FilterQuery<User>): Promise<User | undefined> {
    return this.userModel.findOne(query);
  }

  async createUser(payload: CreateUserDto): Promise<User | undefined> {
    const [emailExist, ninExist, phoneNumberExist] = await Promise.all([
      payload.email
        ? this.userModel.findOne({
            email: new RegExp(payload.email, 'i'),
          })
        : null,
      this.userModel.findOne({
        nin: payload.nin,
      }),
      this.userModel.findOne({
        phoneNumber: payload.phoneNumber,
      }),
    ]);
    if (emailExist)
      throw new BadRequestException(
        'A donor with this email already exist on our platform',
      );
    if (phoneNumberExist)
      throw new BadRequestException(
        'A donor with this phone number already exist on our platform',
      );
    if (ninExist)
      throw new BadRequestException(
        'A donor with this NIN already exist on our platform',
      );
    return this.create({
      ...payload,
      gender: payload.gender.toLocaleLowerCase(),
    });
  }
}
