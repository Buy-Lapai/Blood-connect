import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, PopulateOptions } from 'mongoose';
import { User, UserCreate, UserDocument } from './user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { FindUsersDto } from './dto/find-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: UserCreate): Promise<User> {
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
    return this.userModel
      .find(query)
      .skip(skip)
      .limit(limit)
      .select(select)
      .sort({ firstName: 'asc', lastName: 'asc' });
  }

  async count(
    query: FilterQuery<User>,
    skip?: number,
    limit?: number,
    select?: string,
  ) {
    return this.userModel.countDocuments(query);
  }

  async findOne(query: FilterQuery<User>): Promise<User | undefined> {
    return this.userModel.findOne(query);
  }

  async populate(data: any[], option: PopulateOptions) {
    return this.userModel.populate(data, option);
  }

  async generateUserID() {
    const usersCount = await this.count({});
    return `BC${usersCount < 10 ? `00${usersCount + 1}` : usersCount < 100 ? `0${usersCount + 1}` : `${usersCount + 1}`}`;
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
    const bcID = await this.generateUserID();
    return this.create({
      ...payload,
      gender: payload.gender.toLocaleLowerCase(),
      bcID,
    });
  }

  async findMany(payload: FindUsersDto) {
    const query: FilterQuery<User> = {};
    if (payload.search)
      query.$or = [
        { firstName: new RegExp(`^${payload.search}`, 'i') },
        { lastName: new RegExp(`^${payload.search}`, 'i') },
        { email: new RegExp(`^${payload.search}`, 'i') },
        { phoneNumber: new RegExp(`^${payload.search}`, 'i') },
        { nin: new RegExp(`^${payload.search}`, 'i') },
        { address: new RegExp(`^${payload.search}`, 'i') },
        { gender: new RegExp(`^${payload.search}`, 'i') },
      ];
    const [users, total] = await Promise.all([
      this.find(
        query,
        (Number(payload.page) - 1) * Number(payload.perPage),
        Number(payload.perPage),
        '-__v -_id',
      ),
      this.count(query),
    ]);
    return { users, total };
  }
}
