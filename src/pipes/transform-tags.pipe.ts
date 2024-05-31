import { PipeTransform, Injectable } from '@nestjs/common';
import { Tag } from '../tags/tag.entity';
import { TagsService } from '../tags/tags.service';

@Injectable()
export class TransformTagsPipe implements PipeTransform {
  constructor(private readonly tagsService: TagsService) {}

  async transform(value: any): Promise<any> {
    if (Array.isArray(value.tags)) {
      const tagNames = value.tags;
      const createdTags: Tag[] =
        await this.tagsService.findOrCreateTags(tagNames);
      value.tags = createdTags;
      return value;
    }
    return value;
  }
}
