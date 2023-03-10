import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(protected configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: new Buffer(
        configService.get<string>('JWT_ACCESS_SECRET'),
      ).toString('base64'),
      usernameField: 'userName',
    });
  }

  async validate(payload: any) {
    return {
      email: payload.sub,
      username: payload.username,
      userId: payload.userId,
      refreshToken: payload.refreshToken,
    };
  }
}
