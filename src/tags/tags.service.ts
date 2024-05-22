import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
    const { name } = tagDto;
    const existingTag = await this.findTagByName(name);

    if (existingTag) {
      throw new BadRequestException('Tag with this name already exists');
    }
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
}
