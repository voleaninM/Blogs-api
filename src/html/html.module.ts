import { Module } from '@nestjs/common';
import { HtmlController } from './html.controller';
import { HtmlService } from './html.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TemplateEntity } from './html.entity';
import { HandlebarsService } from './handlebars.service';
import { RenderService } from './render.service';

@Module({
  controllers: [HtmlController],
  providers: [HtmlService, HandlebarsService, RenderService],
  imports: [TypeOrmModule.forFeature([TemplateEntity])],
})
export class HtmlModule {}
