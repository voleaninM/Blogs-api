import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './user.dto';
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

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { email, password, username } = createUserDto;
    const existingUser = await this.findByUsername(username);
    if (existingUser) {
      throw new ConflictException('User with this username already exists');
    }
    const user = this.usersRepository.create({
      email,
      username,
      password: await this.hashPassword(password, 10),
    });
    await this.usersRepository.save(user);
    return user;
  }

  async findByUsername(username: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { username } });
  }
}
