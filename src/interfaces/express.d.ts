import { Request } from 'express';
import { Hospital } from 'src/modules/hospitals/hospitals.schema';
import { User } from 'src/modules/users/user.schema';

export interface IRequest extends Request {
  hospital?: Hospital;
  user?: User;
}
