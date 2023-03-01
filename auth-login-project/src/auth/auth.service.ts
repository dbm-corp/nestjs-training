import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async validateUser(userName: string, password: string) {
    const user = await this.usersService.findUserByUsername(userName);
    const generatePassword = await this.usersService.generatePassword(password);
    if (user && user.password === generatePassword) {
      return user;
    }
    return null;
  }
}
