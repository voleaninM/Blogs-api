import { Body, Controller, Delete, Param, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Tag } from './tag.entity';

import { TagsService } from './tags.service';
import { CreateTagDto } from './tag.dto';
import { CapitalizeTagPipe } from 'src/pipes/capitalize.pipe';

@ApiTags('tags')
@Controller()
export class TagsController {
  constructor(private readonly tagService: TagsService) {}
  @Post('tags')
  createTag(@Body(CapitalizeTagPipe) tagDto: CreateTagDto): Promise<Tag> {
    return this.tagService.createTag(tagDto);
  }

  @Delete('tags/:id')
  delete(@Param('id') id: number) {
    return this.tagService.deleteTag(id);
  }
}
