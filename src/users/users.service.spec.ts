import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let userService: UsersService;
  let usersRepoStab;

  const fakeUsers: User[] = [
    { id: 1, username: 'max', password: '323232', email: 'email' },
  ];

  beforeEach(async () => {
    usersRepoStab = {
      findBy: () => Promise.resolve(fakeUsers),
      create: () => fakeUsers[0],
      update: () => Promise.resolve(),
      save: () => Promise.resolve(fakeUsers[0]),
      findOneBy: () => Promise.resolve(fakeUsers[0]),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: usersRepoStab,
        },
      ],
    }).compile();

    userService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  it('should create a user', async () => {
    //arrange
    const expectedResult = fakeUsers[0];

    //act
    jest.spyOn(userService, 'findByUsername').mockResolvedValue(null);
    const result = await userService.createUser({ password: '323232' } as User);

    //assert
    expect(result).toEqual(expectedResult);
  });

  it('should update a user', async () => {
    //arrange
    const expectedResult = fakeUsers[0];

    //act
    const result = await userService.updateUser(fakeUsers[0], 1);

    //assert
    expect(result).toEqual(expectedResult);
  });

  it('should return a user by username', async () => {
    //arrange
    const expectedResult = fakeUsers[0];

    //act
    const result = await userService.findByUsername('max');

    //assert
    expect(result).toEqual(expectedResult);
  });
});
