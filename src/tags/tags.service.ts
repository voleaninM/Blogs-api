import { Injectable, NotFoundException } from '@nestjs/common';
import { Tag } from './tag.entity';
import { CreateTagDto } from './tag.dto';
import { Repository, ILike } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private tagsRepository: Repository<Tag>,
  ) {}

  async createTag(tagDto: CreateTagDto): Promise<Tag> {
    const tag = this.tagsRepository.create(tagDto);
    return await this.tagsRepository.save(tag);
  }

  async deleteTag(id: number) {
    const result = await this.tagsRepository.delete(id);
    if (!result.affected) {
      throw new NotFoundException();
    }
  }

  async findTagByName(tagName: string): Promise<Tag> {
    return await this.tagsRepository.findOneBy({
      name: ILike(`%${tagName}%`),
    });
  }

  async findOrCreateTags(tagNames: string[]): Promise<Tag[]> {
    const tags = [];
    for (const tagName of tagNames) {
      let tag = await this.findTagByName(tagName);
      if (!tag) {
        tag = await this.createTag({ name: tagName });
      }
      tags.push(tag);
    }
    return tags;
  }
}
