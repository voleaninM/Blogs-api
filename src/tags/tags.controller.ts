import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Param,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Tag } from './tag.entity';
import { TagsService } from './tags.service';
import { CreateTagDto } from './tag.dto';

@ApiTags('tags')
@Controller()
export class TagsController {
  constructor(private readonly tagService: TagsService) {}
  @Post('tags')
  async createTag(@Body() tagDto: CreateTagDto): Promise<Tag> {
    const { name } = tagDto;
    const existingTag = await this.tagService.findTagByName(name);

    if (existingTag) {
      throw new BadRequestException('Tag with this name already exists');
    }
    return this.tagService.createTag(tagDto);
  }

  @Delete('tags/:id')
  delete(@Param('id') id: number) {
    return this.tagService.deleteTag(id);
  }
}
