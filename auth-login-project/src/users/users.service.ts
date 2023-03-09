import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Like, Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Pagination, PaginationOptionsInterface } from '../paginate';

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
    const result = await bcrypt.hash(password, 12);
    return result;
  }

  async createUser(
    userName: string,
    email: string,
    password: string,
  ): Promise<User> {
    const result = await bcrypt.hash(password, 12);
    // Create a new user and save it
    const user = await this.userRepo.create({
      userName,
      email,
      password: result,
      refreshToken: '',
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

  async updateUser(id: number, attrs: Partial<User>) {
    const user = await this.userRepo.findOneBy({ id });

    if (!user) {
      throw new NotFoundException('User not found');
    }
    Object.assign(user, attrs);

    return this.userRepo.save(user);
  }

  async removeUser(id: number) {
    const user = await this.findUserById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.userRepo.remove(user);
  }
}
