import * as Handlebars from 'handlebars';
import { Injectable } from '@nestjs/common';

@Injectable()
export class HandlebarsService {
  compileTemplate(content: string, data: Record<string, any>): string {
    const template = Handlebars.compile(content);
    console.log(data);

    return template(data);
  }
}
