import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(userName: string, password: string) {
    const user = await this.usersService.findUserByUsername(userName);
    // const generatePassword = await this.usersService.generatePassword(password);
    if (user && user.password) {
      return user;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.userName, sub: user.email };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
