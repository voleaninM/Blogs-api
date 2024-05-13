import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { FilterOptionsDto } from 'src/posts/post.dto';
import { capitalizeName } from 'src/utils';
@Injectable()
export class CapitalizeQueryPipe implements PipeTransform {
  transform(query: FilterOptionsDto): FilterOptionsDto {
    for (const key of Object.keys(query)) {
      const values = Array.isArray(query[key]) ? query[key] : [query[key]];
      const capitalizedValues = values.map(capitalizeName);
      query[key] = capitalizedValues;
    }

    return query;
  }
}
