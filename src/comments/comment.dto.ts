import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  content: string;

  @IsOptional()
  @IsNumber()
  postId: number;

  @IsOptional()
  @IsString()
  userId: number;
}

export class UpdateCommentDto {
  @IsString()
  content: string;
}
