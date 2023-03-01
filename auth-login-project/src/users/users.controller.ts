import { Controller, Get, Post, Body, Request } from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import { Pagination } from 'src/paginate';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async index(@Request() request): Promise<Pagination<User>> {
    // TODO make PaginationOptionsInterface an object so it can be defaulted
    return await this.usersService.paginate({
      keyword: request.query.hasOwnProperty('keyword')
        ? request.query.keyword
        : 0,
      limit: request.query.hasOwnProperty('limit') ? request.query.limit : 10,
      page: request.query.hasOwnProperty('page') ? request.query.page : 0,
    });
  }

  @Post('/create')
  async createUser(@Body() body: CreateUserDto): Promise<User> {
    const user = await this.usersService.createUser(
      body.userName,
      body.email,
      body.password,
    );
    return user;
  }
}
