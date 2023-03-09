import {
  Injectable,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(userName: string, password: string) {
    const user = await this.usersService.findUserByUsername(userName);
    const comparePassword = await bcrypt.compare(password, user.password);
    if (user && comparePassword) {
      return user;
    }
    return null;
  }

  async signUp(createUserDto: CreateUserDto): Promise<any> {
    // Check if user exists
    const userExists = await this.usersService.findUserByUsername(
      createUserDto.userName,
    );
    if (userExists) {
      throw new BadRequestException('User already exists');
    }

    // Hash password
    const newUser = await this.usersService.createUser(
      createUserDto.userName,
      createUserDto.email,
      createUserDto.password,
    );
    const tokens = await this.getTokens(newUser);
    await this.updateRefreshToken(newUser.id.toString(), tokens.refreshToken);
    return tokens;
  }

  async getTokens(user: any) {
    const payload = {
      username: user.userName,
      sub: user.email,
      userId: user.id,
    };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: new Buffer(
          this.configService.get<string>('JWT_ACCESS_SECRET'),
        ).toString('base64'),
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(payload, {
        secret: new Buffer(
          this.configService.get<string>('JWT_REFRESH_SECRET'),
        ).toString('base64'),
        expiresIn: '7d',
      }),
    ]);
    return {
      accessToken,
      refreshToken,
    };
  }

  // hashData(data: string) {
  //   return argon2.hash(data);
  // }

  async updateRefreshToken(userId: string, refreshToken: string) {
    await this.usersService.updateUser(parseInt(userId), {
      refreshToken: refreshToken,
    });
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.usersService.findUserById(parseInt(userId));
    if (!user || !user?.refreshToken)
      throw new ForbiddenException('Access denied');
    if (user.refreshToken !== refreshToken)
      throw new ForbiddenException('Access denied');
    const tokens = await this.getTokens(user);
    await this.updateRefreshToken(user.id.toString(), tokens.refreshToken);
    return tokens;
  }

  // async logout() {
  //   return this.jwtService.destroy
  // }
}
