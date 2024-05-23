import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/user.entity';
import { LoginDto } from 'src/users/user.dto';
import * as bcrypt from 'bcrypt';
import { BadRequestException } from '@nestjs/common';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  const fakeUsers: User[] = [
    { id: 1, username: 'max', password: 'hashedPass', email: 'email' },
  ];

  const fakeUsersService = {
    createUser: jest.fn(),
    deleteUser: jest.fn(),
    findByUsername: jest.fn(),
    updateUser: jest.fn(),
  };
  const fakeJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
        {
          provide: JwtService,
          useValue: fakeJwtService,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  it('should validate a user and return it', async () => {
    //arrage
    const expectedResult = fakeUsers[0];
    //act
    jest
      .spyOn(usersService, 'findByUsername')
      .mockResolvedValueOnce(fakeUsers[0]);
    jest
      .spyOn(bcrypt, 'compare')
      .mockImplementation(() => Promise.resolve(true));

    const result = await authService.validateUser({
      password: '323232',
    } as LoginDto);

    //assert
    expect(result).toEqual(expectedResult);
  });

  it('should throw 400 if no such user', async () => {
    //arrange
    const expectedResult = { message: 'Wrong data' };

    //act
    jest.spyOn(usersService, 'findByUsername').mockResolvedValueOnce(null);
    const result = authService.validateUser({
      password: '323232',
    } as LoginDto);

    //assert
    await expect(result).rejects.toThrow(
      new BadRequestException(expectedResult),
    );
  });

  it('should login user', async () => {
    //arrange
    const expectedResult = { access_token: 'accessToken' };

    //act
    (jwtService.sign as jest.Mock).mockReturnValue('accessToken');

    const result = await authService.login({} as User);

    //assert
    expect(result).toEqual(expectedResult);
  });
});
