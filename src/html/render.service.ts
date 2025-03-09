import { Injectable } from '@nestjs/common';
import { HandlebarsService } from './handlebars.service';
import { HtmlService } from './html.service';

@Injectable()
export class RenderService {
  constructor(
    private readonly htmlService: HtmlService,
    private readonly handlebarsService: HandlebarsService,
  ) {}

  async renderTemplate(
    templateName: string,
    data: Record<string, any>,
  ): Promise<string> {
    const template = await this.htmlService.getTemplateByName(templateName);

    return this.handlebarsService.compileTemplate(template.content, data);
  }
}
