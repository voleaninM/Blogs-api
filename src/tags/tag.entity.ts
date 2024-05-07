import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
@Entity('tags')
export class Tag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'name' })
  name: string;
}
