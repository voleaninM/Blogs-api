import { Injectable, NotFoundException } from '@nestjs/common';
import { Post } from './post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePostDto, FilterOptionsDto, UpdatePostDto } from './post.dto';
import { In } from 'typeorm';
import { TagsService } from '../tags/tags.service';

@Injectable()
export class PostsService {
  constructor(
    private tagService: TagsService,
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
  ) {}

  async getAll(query: FilterOptionsDto): Promise<Post[]> {
    if (!Object.values(query).length) return await this.postsRepository.find();
    else {
      return await this.postsRepository.find({
        where: {
          tags: {
            name: In(query.tag),
          },
        },
        relations: { tags: true },
      });
    }
  }

  async createPost(
    createPostDto: CreatePostDto,
    userId: number,
  ): Promise<Post> {
    createPostDto.userId = userId;
    const post = this.postsRepository.create(createPostDto);
    return await this.postsRepository.save(post);
  }

  async findPost(id: number): Promise<Post> {
    const post = await this.postsRepository.findOne({
      where: { id: id },
      relations: { comments: true, tags: true },
    });
    if (!post) {
      throw new NotFoundException();
    }
    return post;
  }

  async updatePost(id: number, updatePostDto: UpdatePostDto): Promise<Post> {
    const post = await this.findPost(id);
    const updatedPost = await this.postsRepository.save({
      ...post,
      ...updatePostDto,
    });
    return updatedPost;
  }

  async deletePost(id: number) {
    const result = await this.postsRepository.delete(id);
    if (!result.affected) {
      throw new NotFoundException();
    }
  }

  async getComments(id: number) {
    const post = await this.findPost(id);
    return post.comments;
  }
}
