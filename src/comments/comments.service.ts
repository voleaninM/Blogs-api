import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { CreateCommentDto, UpdateCommentDto } from './comment.dto';
import { Comment } from './comment.entity';
import { PostsService } from '../posts/posts.service';

@Injectable()
export class CommentsService {
  constructor(
    private postsService: PostsService,
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
  ) {}

  async getAll(): Promise<Comment[]> {
    return await this.commentsRepository.find();
  }

  async getPostComments(postId: number): Promise<Comment[]> {
    const comments = await this.commentsRepository.findBy({ postId: postId });

    if (!comments.length) {
      throw new NotFoundException();
    }
    return comments;
  }

  async createComment(
    createCommentDto: CreateCommentDto,
    postId: number,
    id: number,
  ): Promise<Comment> {
    const post = await this.postsService.findPost(postId);
    if (!post) {
      throw new NotFoundException();
    } else {
      createCommentDto.userId = id;
      createCommentDto.postId = postId;
      const comment = this.commentsRepository.create(createCommentDto);
      return await this.commentsRepository.save(comment);
    }
  }

  async findComment(id: number): Promise<Comment> {
    const comment = await this.commentsRepository.findOneBy({ id: id });

    if (!comment) {
      throw new NotFoundException();
    }
    return comment;
  }

  async updateComment(
    id: number,
    updateCommentDto: UpdateCommentDto,
  ): Promise<Comment> {
    const comment = await this.commentsRepository.findOneBy({ id: id });
    const updatedComment = { ...comment, ...updateCommentDto };
    return await this.commentsRepository.save(updatedComment);
  }

  async deleteComment(id: number) {
    const result = await this.commentsRepository.delete(id);

    if (!result.affected) {
      throw new NotFoundException();
    }
  }
}
