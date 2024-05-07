import { Injectable, NotFoundException } from '@nestjs/common';
import { Post } from './post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePostDto, FilterOptionsDto, UpdatePostDto } from './post.dto';
import { Tag } from 'src/tags/tag.entity';
import { In } from 'typeorm';
import { capitalizeName } from 'src/utils';
import { TagsService } from 'src/tags/tags.service';

@Injectable()
export class PostsService {
  constructor(
    private tagService: TagsService,
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
  ) {}

  async getAll(query: FilterOptionsDto): Promise<Post[]> {
    if (Object.values(query).length === 0)
      return await this.postsRepository.find();
    else {
      return await this.postsRepository.find({
        where: {
          tags: {
            name: In(query.tag),
          },
        },
        relations: { comments: true, tags: true },
      });
    }
  }

  async createPost(
    createPostDto: CreatePostDto,
    userId: number,
  ): Promise<Post> {
    const tags = [];
    if (createPostDto.tags) {
      const lowerCaseTags = createPostDto.tags.map(capitalizeName);
      for (const tagName of lowerCaseTags) {
        const existingTag = await this.tagService.findTag(tagName);
        if (existingTag) {
          tags.push(existingTag);
        } else {
          const newTag = await this.tagService.createTag({ name: tagName });
          tags.push(newTag);
        }
      }
    }
    createPostDto.userId = userId;
    const post = this.postsRepository.create({ ...createPostDto, tags });

    return await this.postsRepository.save(post);
  }

  async findPost(id: number): Promise<Post> {
    const post = await this.postsRepository.findOne({
      where: { id: id },
      relations: { comments: true, tags: true },
    });
    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
    return post;
  }

  async updatePost(id: number, updatePostDto: UpdatePostDto): Promise<Post> {
    const post = await this.postsRepository.findOne({ where: { id: id } });
    if (!post) {
      throw new NotFoundException(`A Post with ID ${id} was not found`);
    }
    const { tags, ...postData } = updatePostDto;
    const useTags = [];

    if (tags) {
      for (const tagName of tags) {
        const existingTag = await this.tagService.findTag(tagName);
        if (existingTag) {
          useTags.push(existingTag);
        } else {
          const newTag = this.tagService.createTag({ name: tagName });
          useTags.push(newTag);
        }
      }
    }

    const updatedPost = { ...post, ...postData };
    updatedPost.tags = useTags;

    return await this.postsRepository.save(updatedPost);
  }

  async deletePost(id: number) {
    const result = await this.postsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`A Post "${id}" was not found`);
    }
    return { message: 'Post successfully deleted' };
  }
}
