import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import {
  CommentsController,
  CommentsOperationsController,
} from './comments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './comment.entity';
import { Post } from '../posts/post.entity';
import { PostsModule } from '../posts/posts.module';

@Module({
  providers: [CommentsService],
  controllers: [CommentsController, CommentsOperationsController],
  exports: [CommentsService],
  imports: [TypeOrmModule.forFeature([Comment, Post]), PostsModule],
})
export class CommentsModule {}
