import {
  IsString,
  IsEmail,
  IsStrongPassword,
  IsNotEmpty,
} from 'class-validator';
import { IsColumnExist } from '../../decorators/column-exist-decorator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @IsColumnExist({ message: 'username is exist' })
  userName: string;

  @IsNotEmpty()
  @IsEmail()
  @IsColumnExist({ message: 'email is exist' })
  email: string;

  @IsString()
  @IsStrongPassword()
  password: string;
}
