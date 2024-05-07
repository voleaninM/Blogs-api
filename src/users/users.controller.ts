import {
  Body,
  Controller,
  Patch,
  Post,
  Request,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserDto, UpdateUserDto, UserResponseDto } from './user.dto';
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
  ): Promise<UserResponseDto> {
    return this.usersService.createUser(createUserDto);
  }

  @Patch('/update')
  updateUser(
    @Body(new ValidationPipe()) updateUserDto: UpdateUserDto,
    @Request() req,
  ): Promise<UserResponseDto> {
    const { id: userId } = req.user;
    return this.usersService.updateUser(updateUserDto, userId);
  }
}
