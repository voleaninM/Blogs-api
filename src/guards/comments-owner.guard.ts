import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from '../comments/comment.entity';

@Injectable()
export class CommentOwnerGuard implements CanActivate {
  constructor(
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const requestUserId = request.user.id;
    const requestParam = request.params.id;
    const comment = await this.commentsRepository.findOne({
      where: { id: requestParam },
    });
    console.log(comment.userId, requestUserId);

    return comment.userId === requestUserId;
  }
}
