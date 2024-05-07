import { Post } from 'src/posts/post.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'content' })
  content: string;

  @Column({ name: 'userId' })
  userId: number;

  @Column({ name: 'postId' })
  postId: number;

  @ManyToOne(() => Post, (post) => post.comments, {
    orphanedRowAction: 'delete',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  post: Post;
}
