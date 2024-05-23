import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from '../users/user.dto';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { User } from '../users/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}
  private async validatePassword(
    password: string,
    hashedPass: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashedPass);
  }
  async validateUser(loginDto: LoginDto): Promise<User> {
    const { username, password } = loginDto;
    const user = await this.usersService.findByUsername(username);

    if (user && (await this.validatePassword(password, user.password))) {
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
}
