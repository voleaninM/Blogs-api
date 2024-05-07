import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import {
  CommentsController,
  CommentsOperationsController,
} from './comments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './comment.entity';
import { Post } from 'src/posts/post.entity';

@Module({
  providers: [CommentsService],
  controllers: [CommentsController, CommentsOperationsController],
  exports: [CommentsService],
  imports: [TypeOrmModule.forFeature([Comment, Post])],
})
export class CommentsModule {}
