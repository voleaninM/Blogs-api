import { PartialType } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  username: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsEmail()
  email: string;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}

export class LoginDto {
  @IsString()
  username: string;

  @IsString()
  password: string;
}

export class UserResponseDto {
  @IsString()
  username: string;

  @IsEmail()
  email: string;
}
