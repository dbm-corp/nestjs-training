import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from 'nestjs-config';
import * as path from 'path';
import { AuthModule } from './auth/auth.module';
import { User } from './entities/user.entity';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.load(path.resolve(__dirname, 'config', '*.{ts,js}')),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'databases/database.sqlite',
      entities: [User],
      synchronize: true,
    }),
    AuthModule,
    UsersModule,
  ],
})
export class AppModule {}
