import { Injectable } from '@nestjs/common';
import { sign, verify } from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtService {
  constructor(private readonly configService: ConfigService) {} // Inject secret from config

  GenerateAccessToken(payload: { id: string; type: 'hospital' | 'user' }) {
    return sign(
      payload,
      this.configService.get<string>('JWT_SECRET_KEY') as string,
      {
        expiresIn: this.configService.get<string>('JWT_EXPIRES_IN'),
      },
    );
  }

  verifyAccessToken(token: string) {
    try {
      const decoded = verify(
        token,
        this.configService.get<string>('JWT_SECRET_KEY') as string,
      ) as {
        id: string;
        type: 'hospital' | 'user';
      } | null;
      return decoded;
    } catch (error) {
      return null;
    }
  }
}
