import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { FilterOptionsDto } from 'src/posts/post.dto';
import { CreateTagDto } from 'src/tags/tag.dto';
import { capitalizeName } from 'src/utils';

@Injectable()
export class CapitalizeTagPipe implements PipeTransform {
  transform(value: CreateTagDto): CreateTagDto {
    value.name = capitalizeName(value.name);
    return value;
  }
}

@Injectable()
export class CapitalizeQueryPipe implements PipeTransform {
  transform(value: FilterOptionsDto): FilterOptionsDto {
    const tags = Array.isArray(value.tag) ? value.tag : [value.tag];
    const capitalizedTags = tags.map(capitalizeName);
    value.tag = capitalizedTags;
    return value;
  }
}
