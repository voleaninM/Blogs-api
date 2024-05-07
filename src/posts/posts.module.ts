import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './post.entity';
import { Tag } from 'src/tags/tag.entity';
import { User } from 'src/users/user.entity';

@Module({
  controllers: [PostsController],
  providers: [PostsService],
  imports: [TypeOrmModule.forFeature([Post, Tag])],
  exports: [],
})
export class PostsModule {}
