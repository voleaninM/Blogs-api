import { IsNumber, IsString } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  content: string;

  @IsNumber()
  postId: number;

  @IsString()
  userId: number;
}

export class UpdateCommentDto {
  @IsString()
  content: string;
}
