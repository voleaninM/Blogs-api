import { Exclude } from 'class-transformer';
import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';

@Unique(['username'])
@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'username' })
  username: string;

  @Column({ name: 'password' })
  @Exclude({ toPlainOnly: true })
  password: string;

  @Column({ name: 'email' })
  email: string;
}
