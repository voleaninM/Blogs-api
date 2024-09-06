import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Tag } from './tag.entity';
import { TagsService } from './tags.service';
import { CreateTagDto } from './tag.dto';

@ApiTags('tags')
@Controller()
export class TagsController {
  constructor(private readonly tagService: TagsService) {}
  @Post('tags')
  createTag(@Body() tagDto: CreateTagDto): Promise<Tag> {
    return this.tagService.createTag(tagDto);
  }

  @Delete('tags/:id')
  delete(@Param('id') id: number) {
    return this.tagService.deleteTag(id);
  }
}
