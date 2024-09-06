import {
  Injectable,
  CanActivate,
  ExecutionContext,
  NotFoundException,
} from '@nestjs/common';
import { CommentsService } from '../comments/comments.service';

@Injectable()
export class CommentOwnerGuard implements CanActivate {
  constructor(private commentsService: CommentsService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const requestUserId = request.user.id;
    const requestParam = request.params.id;
    const comment = await this.commentsService.findComment(requestParam);
    if (!comment) {
      throw new NotFoundException();
    }
    return comment.userId === requestUserId;
  }
}
