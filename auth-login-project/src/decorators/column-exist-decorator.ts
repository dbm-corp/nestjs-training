import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';

export function IsColumnExist(validationOptions?: ValidationOptions) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: IsColumnExistConstraint,
    });
  };
}

@ValidatorConstraint({ name: 'IsEmailExist', async: true })
@Injectable()
export class IsColumnExistConstraint implements ValidatorConstraintInterface {
  constructor(private readonly usersService: UsersService) {}
  async validate(value: any, args: ValidationArguments) {
    let user = null;
    switch (args.property) {
      case 'email': {
        user = await this.usersService.findUserByEmail(value);
        break;
      }
      case 'userName': {
        user = await this.usersService.findUserByUsername(value);
        break;
      }
    }
    if (!user) {
      return true;
    }
    return false;
  }
}
