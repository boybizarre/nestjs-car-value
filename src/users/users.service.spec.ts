import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { Repository } from 'typeorm';
import { User } from './user.entity';

describe('UsersService', () => {
  let service: Partial<UsersService>;
  let fakeRepo: Partial<Repository<User>>;

  beforeEach(async () => {

    fakeRepo = {};

    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, {
        provide: Repository,
        useValue: fakeRepo
      }],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
