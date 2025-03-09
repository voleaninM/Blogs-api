import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { CreateCommentDto, UpdateCommentDto } from './comment.dto';
import { Comment } from './comment.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
  ) {}

  async getAll(): Promise<Comment[]> {
    return await this.commentsRepository.find();
  }

  async createComment(
    createCommentDto: CreateCommentDto,
    postId: number,
    id: number,
  ): Promise<Comment> {
    createCommentDto.userId = id;
    createCommentDto.postId = postId;
    const comment = this.commentsRepository.create(createCommentDto);

    return await this.commentsRepository.save(comment);
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
    await this.commentsRepository.update(id, updateCommentDto);
    const updatedComment = this.findComment(id);
    return updatedComment;
  }

  async deleteComment(id: number) {
    const result = await this.commentsRepository.delete(id);

    if (!result.affected) {
      throw new NotFoundException();
    }
  }
}
