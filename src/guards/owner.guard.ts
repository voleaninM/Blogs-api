import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { PostsService } from '../posts/posts.service';

@Injectable()
export class OwnerGuard implements CanActivate {
  constructor(private postsService: PostsService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const requestUserId = request.user.id;
    const requestParam = request.params.id;
    const post = await this.postsService.findPost(requestParam);

    return post.userId === requestUserId;
  }
}
