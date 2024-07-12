import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TemplateEntity } from './html.entity';

@Injectable()
export class HtmlService {
  constructor(
    @InjectRepository(TemplateEntity)
    private templateRepository: Repository<TemplateEntity>,
  ) {}

  async createTemplate(name: string, content: string): Promise<TemplateEntity> {
    const template = this.templateRepository.create({ name, content });
    return this.templateRepository.save(template);
  }

  async getTemplateByName(name: string): Promise<TemplateEntity> {
    return this.templateRepository.findOneBy({ name });
  }

  async deleteTemplate(id: string): Promise<void> {
    await this.templateRepository.delete(id);
  }
}
