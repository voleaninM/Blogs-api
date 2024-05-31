import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto, UpdateUserDto } from './user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { email, password, username } = createUserDto;
    const user = this.usersRepository.create({
      email,
      username,
      password,
    });

    return await this.usersRepository.save(user);
  }

  async updateUser(
    updateUserDto: UpdateUserDto,
    userId: number,
  ): Promise<User> {
    await this.usersRepository.update(userId, updateUserDto);
    const updatedUser = await this.findById(userId);
    return updatedUser;
  }

  async findByUsername(username: string): Promise<User | undefined> {
    return this.usersRepository.findOneBy({ username });
  }

  async findById(id: number): Promise<User | undefined> {
    return this.usersRepository.findOneBy({ id });
  }
}
