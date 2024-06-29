import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IRequest } from '../interfaces/express';

@Injectable()
export class HospitalGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const req: IRequest = context.switchToHttp().getRequest();
    const hospital = req.hospital;

    if (!hospital) {
      throw new HttpException(
        { message: 'You do not have the permission to carry out this request' },
        HttpStatus.FORBIDDEN,
      );
    }

    return true;
  }
}
