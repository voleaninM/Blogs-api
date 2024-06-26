import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto, UpdateUserDto, UserResponseDto } from './user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  private async hashPassword(password: string, salt: number): Promise<string> {
    return bcrypt.hash(password, salt);
  }

  async createUser(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const { email, password, username } = createUserDto;
    const existingUser = await this.findByUsername(username);

    if (existingUser) {
      throw new BadRequestException('User with this username already exists');
    }
    const user = this.usersRepository.create({
      email,
      username,
      password: await this.hashPassword(password, 10),
    });
    await this.usersRepository.save(user);
    const userResponse = new UserResponseDto();
    userResponse.email = email;
    userResponse.username = username;

    return userResponse;
  }

  async updateUser(
    updateUserDto: UpdateUserDto,
    userId: number,
  ): Promise<UserResponseDto> {
    if (Object.values(updateUserDto).length === 0) {
      throw new BadRequestException('Provide Data');
    }
    const { password, ...updateData } = updateUserDto;

    const user = await this.usersRepository.findOneBy({
      id: userId,
    });
    if (password) {
      user.password = await this.hashPassword(password, 10);
    }
    const updatedUser = await this.usersRepository.save({
      ...user,
      ...updateData,
    });
    const userResponse = new UserResponseDto();
    userResponse.email = updatedUser.email;
    userResponse.username = updatedUser.username;

    return userResponse;
  }

  async findByUsername(username: string): Promise<User | undefined> {
    return this.usersRepository.findOneBy({ username });
  }
}
