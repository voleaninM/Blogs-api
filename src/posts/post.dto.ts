import { OmitType, PartialType } from '@nestjs/swagger';
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePostDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsArray()
  tags: string[];

  @IsOptional()
  @IsNumber()
  userId: number;
}

export class UpdatePostDto extends PartialType(
  OmitType(CreatePostDto, ['userId']),
) {}

export class FilterOptionsDto {
  @IsOptional()
  @IsString()
  tag: string[];
}
