import { Module } from '@nestjs/common';
import { PostsModule } from './posts/posts.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './posts/post.entity';
import { Comment } from './comments/comment.entity';
import { CommentsModule } from './comments/comments.module';
import { TagsModule } from './tags/tags.module';
import { Tag } from './tags/tag.entity';
import { User } from './users/user.entity';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { TagSubscriber } from './subscribers/tag-subscriber';
import { HashModule } from './hash/hash.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'sqlite',
        database: configService.get('DATABASE_NAME'),
        entities: [Post, Comment, Tag, User],
        synchronize: true,
        subscribers: [TagSubscriber],
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    PostsModule,
    CommentsModule,
    UsersModule,
    TagsModule,
    HashModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
