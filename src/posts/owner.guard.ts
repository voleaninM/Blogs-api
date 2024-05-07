import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './post.entity';

@Injectable()
export class OwnerGuard implements CanActivate {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const requestUserId = request.user.id;
    const requestParam = request.params.id;
    const post = await this.postsRepository.findOne({
      where: { id: requestParam },
    });
    console.log(post.userId, requestUserId);

    return post.userId === requestUserId;
  }
}
