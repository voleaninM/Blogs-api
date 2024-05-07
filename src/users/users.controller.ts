import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './user.dto';
import { Public } from 'src/decorators/public.decorator';
import { User } from './user.entity';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Post('/register')
  createUser(
    @Body(new ValidationPipe()) createUserDto: CreateUserDto,
  ): Promise<User> {
    return this.usersService.createUser(createUserDto);
  }
}
