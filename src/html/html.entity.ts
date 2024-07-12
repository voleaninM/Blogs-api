import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('templates')
export class TemplateEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  content: string;
}
export class CreateHTMLDto {
  @IsString()
  @ApiProperty({ example: 'HTML content' })
  content: string;
  @IsString()
  @ApiProperty({ example: 'HTML Name' })
  name: string;
}
export class CreateDataDto {
  @IsString()
  @ApiProperty({ example: 'some custom data' })
  data: string;
}
