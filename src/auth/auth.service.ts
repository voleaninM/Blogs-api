import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto, LoginDto } from '../users/user.dto';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';
import { HashService } from '../hash/hash.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private hashService: HashService,
  ) {}

  async validateUser(loginDto: LoginDto): Promise<User> {
    const { username, password } = loginDto;
    const user = await this.usersService.findByUsername(username);

    if (
      user &&
      (await this.hashService.validatePassword(password, user.password))
    ) {
      return user;
    } else {
      throw new BadRequestException('Wrong data');
    }
  }

  async login(user: User) {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async signUp(createUserDto: CreateUserDto) {
    const { password, username } = createUserDto;
    const hashedPassword = await this.hashService.hashPassword(password);
    const userDtoWithHashedPassword = {
      ...createUserDto,
      password: hashedPassword,
    };
    const existingUser = await this.usersService.findByUsername(username);

    if (existingUser) {
      throw new BadRequestException('User with this username already exists');
    }
    const createdUser = await this.usersService.createUser(
      userDtoWithHashedPassword,
    );
    const payload = { username: createdUser.username, sub: createdUser.id };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
