import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Request,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { User } from 'src/entities/user.entity';
import { Pagination } from 'src/paginate';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
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

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  async detailUser(@Param('id') id: string) {
    return await this.usersService.findUserById(parseInt(id));
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

  @Put('update/:id')
  @UseGuards(JwtAuthGuard)
  async updateUser(
    @Param('id') id: string,
    @Body() body: CreateUserDto,
  ): Promise<User> {
    return await this.usersService.updateUser(parseInt(id), body);
  }

  @Delete('delete/:id')
  @UseGuards(JwtAuthGuard)
  async deleteUser(@Param('id') id: string): Promise<User> {
    return this.usersService.removeUser(parseInt(id));
  }
}
