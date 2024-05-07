import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { CreateCommentDto, UpdateCommentDto } from './comment.dto';
import { Comment } from './comment.entity';
import { Post } from 'src/posts/post.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
    @InjectRepository(Post)
    private postsRepository: Repository<Comment>,
  ) {}

  async getAll(): Promise<Comment[]> {
    return await this.commentsRepository.find();
  }

  async getPostComments(postId: number): Promise<Comment[]> {
    const comments = await this.commentsRepository.find({
      where: { postId: postId },
    });
    if (comments.length === 0) {
      throw new NotFoundException(`Comments with Post ${postId} not found`);
    }
    return comments;
  }

  async createComment(
    createCommentDto: CreateCommentDto,
    postId: number,
    id: number,
  ): Promise<Comment> {
    const post = await this.postsRepository.findOne({
      where: { id: postId },
    });
    if (!post) {
      throw new NotFoundException(`Post ${postId} not found`);
    } else {
      createCommentDto.userId = id;
      const comment = {
        ...this.commentsRepository.create(createCommentDto),
        postId,
      };
      return await this.commentsRepository.save(comment);
    }
  }

  async findComment(id: number): Promise<Comment> {
    const comment = await this.commentsRepository.findOne({
      where: { id: id },
    });
    if (!comment) {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }
    return comment;
  }

  async updateComment(
    id: number,
    updateCommentDto: UpdateCommentDto,
  ): Promise<Comment> {
    const comment = await this.commentsRepository.findOne({
      where: { id: id },
    });
    const updatedComment = { ...comment, ...updateCommentDto };
    return await this.commentsRepository.save(updatedComment);
  }

  async deleteComment(id: number) {
    const result = await this.commentsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`A Comment ${id} was not found`);
    }
    return { message: 'Comment successfully deleted' };
  }
}
