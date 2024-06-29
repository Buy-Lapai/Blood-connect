// jwt.middleware.ts
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { JwtService } from 'src/services/jwt.service';
import { IRequest } from 'src/interfaces/express';
import { UsersService } from 'src/modules/users/users.service';
import { HospitalsService } from 'src/modules/hospitals/hospitals.service';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(HospitalsService) private hospitalService: HospitalsService,
    @Inject(UsersService) private userService: UsersService,
  ) {}

  async use(req: IRequest, res: Response, next: NextFunction) {
    let token: null | string = null;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
      throw new HttpException(
        { message: 'Invalid token!' },
        HttpStatus.UNAUTHORIZED,
      );
    }
    let decoded: {
      id: string;
      type: 'hospital' | 'user';
    } | null = this.jwtService.verifyAccessToken(token);

    if (!decoded) {
      throw new HttpException(
        {
          message:
            'Invalid token or token has expired! Please log out and login again',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    if (decoded.type === 'hospital') {
      const hospital = await this.hospitalService.findOne({
        _id: decoded.id,
        accessToken: token,
      });
      if (!hospital) {
        throw new HttpException(
          { message: 'Invalid access token' },
          HttpStatus.UNAUTHORIZED,
        );
      }
      req.hospital = hospital;
    } else if (decoded.type === 'user') {
      const user = await this.userService.findOne({
        _id: decoded.id,
        accessToken: token,
      });

      if (!user) {
        throw new HttpException(
          { message: 'Invalid access token' },
          HttpStatus.UNAUTHORIZED,
        );
      }
      req.user = user;
    } else {
      throw new HttpException(
        { message: 'Invalid token!' },
        HttpStatus.UNAUTHORIZED,
      );
    }
    next();
  }
}
