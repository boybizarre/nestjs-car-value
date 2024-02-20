import { Test } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    // create a fake copy of the users service
    const users: User[] = [];
    fakeUsersService = {
      find: (email: string) => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 99999),
          email,
          password,
        } as User;
        users.push(user);
        return Promise.resolve(user);
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('creates a new user with salted and hashed password', async () => {
    const user = await service.signUp('user@gmail.com', 'candidatePassword');

    expect(user.password).not.toEqual('password');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error if user signs up with email that is in use', async () => {
    await service.signUp('klaus@gmail.com', 'candidatePassword');
    await expect(
      service.signUp('klaus@gmail.com', 'candidatePassword'),
    ).rejects.toThrow(BadRequestException);
  });

  it('throws if signIn is called with an unused email', async () => {
    await expect(
      service.signIn('ashdok@gmail.com', 'candidatePassword'),
    ).rejects.toThrow(NotFoundException);
  });

  it('throws if an invalid password is provided', async () => {
    await service.signUp('jfsadkodsaf@gmail.com', 'candidatePassword')
    await expect(
      service.signIn('jfsadkodsaf@gmail.com', 'wrongPassword'),
    ).rejects.toThrow(BadRequestException);
  });

  it('returns a user if correct password is provided', async () => {
    // fakeUsersService.find = () =>
    //   Promise.resolve([
    //     {
    //       email: 'test@test.com',
    //       password:
    //         '4d68f1fe7011ed3f.9915afc294968b7dfeb31638b59d8c09ec4caeafe6988da73b528006d010f04f',
    //     } as User,
    //   ]);

    await service.signUp('peak@gmail.com', 'candidatePassword');

    const user = await service.signIn('peak@gmail.com', 'candidatePassword');
    console.log(user);

    expect(user).toBeDefined();
  });
});
