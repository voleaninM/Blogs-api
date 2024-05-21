import { ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UpdateUserDto, UserResponseDto } from './user.dto';
import { User } from './user.entity';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let userService: UsersService;
  let usersRepoStab;

  const fakeUsers: User[] = [
    { id: 1, username: 'max', password: '323232', email: 'email' },
  ];

  const bcryptLib = {
    hash: jest.fn(),
  };

  beforeEach(async () => {
    usersRepoStab = {
      findBy: () => Promise.resolve(fakeUsers),
      create: () => fakeUsers[0],
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

  it('should create a comment', async () => {
    //arrange
    const expectedResult = {} as UserResponseDto;

    //act
    jest.spyOn(userService, 'findByUsername').mockResolvedValue(null);
    jest.spyOn(bcryptLib, 'hash').mockResolvedValue('323232');
    const result = await userService.createUser({ password: '32' } as User);

    //assert
    expect(result).toEqual(expectedResult);
  });

  it('should throw ConflictException if username already exists', async () => {
    //arrange
    const expectedResult = 'User with this username already exists';

    //act
    const result = userService.createUser(fakeUsers[0]);

    //assert
    await expect(result).rejects.toThrow(new ConflictException(expectedResult));
  });

  it('should update a user', async () => {
    //arrange
    const expectedResult = { email: 'email', username: 'max' };

    //act
    const result = await userService.updateUser(fakeUsers[0], 1);

    //assert
    expect(result).toEqual(expectedResult);
  });

  it('should throw ConflictException if no provided data', async () => {
    //arrange
    const expectedResult = 'Provide Data';

    //act
    const result = userService.updateUser({}, 1);

    //assert
    await expect(result).rejects.toThrow(new ConflictException(expectedResult));
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
