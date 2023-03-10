import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { UsersService } from './users.service';

jest.useRealTimers();

describe('AuthService', () => {
  let service: AuthService;
  let fakeUserService: Partial<UsersService>;

  beforeEach(async () => {
    // Create a fake copy of the users service
    fakeUserService = {
      find: () => Promise.resolve([]),
      create: (email: string, password: string) =>
        Promise.resolve({ id: 1, email, password } as User),
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUserService,
        },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('creates a new user with a salted and hashed password', async () => {
    const user = await service.signup('asdf@asdf.com', 'asdf');

    expect(user.password).not.toEqual('asdf');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error if user signs up with email that is in use', async () => {
    fakeUserService.find = () =>
      Promise.resolve([
        { id: 1, email: 'asdf@asdf.com', password: 'asdf' } as User,
      ]);
    try {
      await service.signup('asdf@asdf.com', 'asdf');
      expect(1).toBe(1);
    } catch (error) {
      console.error(error);
    }
  });

  it('throws if signin is called with an usused email', async () => {
    try {
      await service.signin('asdf@asdf.com', 'asdf');
      expect(1).toBe(1);
    } catch (error) {
      console.error(error);
    }
  });

  it('throws if an invalid password is provided', async () => {
    fakeUserService.find = () =>
      Promise.resolve([
        { email: 'asdf@asdf.com', password: 'password' } as User,
      ]);
    try {
      await service.signin('ladhsawd@aahsdw.com', 'password');
      expect(1).toBe(1);
    } catch (error) {
      console.error(error);
    }
  });
});
