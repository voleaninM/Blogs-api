import { PipeTransform, Injectable } from '@nestjs/common';
import { FilterOptionsDto } from '../posts/post.dto';
@Injectable()
export class NormalizeQueryPipe implements PipeTransform {
  transform(query: FilterOptionsDto): FilterOptionsDto {
    for (const key of Object.keys(query)) {
      const values = Array.isArray(query[key]) ? query[key] : [query[key]];
      const normalizedValues = values.map((value) => value.toLowerCase());
      query[key] = normalizedValues;
    }

    return query;
  }
}
