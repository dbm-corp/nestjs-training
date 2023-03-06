import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: new Buffer(`${process.env.JWT_SECRET_KEY}`).toString(
        'base64',
      ),
    });
  }

  async validate(payload: any) {
    return { email: payload.sub, username: payload.username };
  }
}
