import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { HtmlService } from './html.service';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/decorators/public.decorator';
import { CreateDataDto, CreateHTMLDto } from './html.entity';
import { RenderService } from './render.service';

@Controller('templates')
@ApiTags('templates')
@Public()
export class HtmlController {
  constructor(
    private readonly htmlService: HtmlService,
    private readonly renderService: RenderService,
  ) {}

  @Post()
  createTemplate(@Body() createTemplateDto: CreateHTMLDto) {
    return this.htmlService.createTemplate(
      createTemplateDto.name,
      createTemplateDto.content,
    );
  }

  @Get('template/:name')
  getTemplateByName(@Param('name') name: string) {
    return this.htmlService.getTemplateByName(name);
  }

  @Get('/render:templateName')
  @ApiQuery({
    name: 'inviteeName',
    required: false,
    type: String,
    description: 'Data to pass to the template as a JSON string',
  })
  @ApiQuery({
    name: 'inviterName',
    required: false,
    type: String,
    description: 'Data to pass to the template as a JSON string',
  })
  @ApiQuery({
    name: 'eventName',
    required: false,
    type: String,
    description: 'Data to pass to the template as a JSON string',
  })
  @ApiQuery({
    name: 'eventDescription',
    required: false,
    type: String,
    description: 'Data to pass to the template as a JSON string',
  })
  @ApiQuery({
    name: 'invitationLink',
    required: false,
    type: String,
    description: 'Data to pass to the template as a JSON string',
  })
  render(
    @Param('templateName') templateName: string,
    @Query() data: Record<string, any>,
  ): Promise<string> {
    console.log(data);

    return this.renderService.renderTemplate(templateName, data);
  }
}
