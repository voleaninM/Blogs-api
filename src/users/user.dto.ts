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

export class LoginDto {
  @IsString()
  username: string;

  @IsString()
  password: string;
}
