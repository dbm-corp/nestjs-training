import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { Like, Repository } from 'typeorm';
import { promisify } from 'util';
import { User } from '../entities/user.entity';
import { Pagination, PaginationOptionsInterface } from '../paginate';

const scrypt = promisify(_scrypt);

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  async paginate(
    options: PaginationOptionsInterface,
  ): Promise<Pagination<User>> {
    const [results, total] = await this.userRepo.findAndCount({
      where: { userName: Like('%' + options.keyword + '%') },
      order: { userName: 'DESC' },
      take: options.limit,
      skip: options.page, // think this needs to be page * limit
    });
    // TODO add more tests for paginate

    return new Pagination<User>({
      results,
      total,
    });
  }

  async generatePassword(password: string) {
    // Hash the users password
    // Generate a salt
    const salt = randomBytes(8).toString('hex');

    // Hash the salt and the password together
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    // Join the hashed result and the salt together
    const result = salt + '.' + hash.toString('hex');
    return result;
  }

  async createUser(
    userName: string,
    email: string,
    password: string,
  ): Promise<User> {
    const result = await this.generatePassword(password);
    // Create a new user and save it
    const user = await this.userRepo.create({
      userName,
      email,
      password: result,
    });
    return this.userRepo.save(user);
  }

  async findUserById(id: number): Promise<User> {
    const user = await this.userRepo.findOneBy({ id });
    return user;
  }

  async findUserByUsername(userName: string): Promise<User> {
    const user = await this.userRepo.findOneBy({ userName });
    return user;
  }

  async findUserByEmail(email: string): Promise<User> {
    const user = await this.userRepo.findOneBy({ email });
    return user;
  }

  async removeUser(id: number) {
    const user = await this.findUserById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.userRepo.remove(user);
  }
}
