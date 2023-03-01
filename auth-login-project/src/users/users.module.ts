import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from '../entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IsColumnExistConstraint } from '../decorators/column-exist-decorator';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  exports: [UsersService],
  providers: [UsersService, IsColumnExistConstraint],
  controllers: [UsersController],
})
export class UsersModule {}
