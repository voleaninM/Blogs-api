import {
  ConflictException,
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
      throw new ConflictException('Tag with this name already exists');
    }
    const tag = this.tagsRepository.create(tagDto);

    return await this.tagsRepository.save(tag);
  }

  async deleteTag(id: number) {
    const result = await this.tagsRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`A Tag ${id} was not found`);
    }
    return { message: 'Tag successfully deleted' };
  }

  async findTagByName(tagName: string): Promise<Tag> {
    return await this.tagsRepository.findOneBy({
      name: ILike(`%${tagName}%`),
    });
  }
}
