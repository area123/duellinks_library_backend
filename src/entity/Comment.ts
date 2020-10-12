import {
  BaseEntity, Column, CreateDateColumn,
  Entity, ManyToOne, PrimaryGeneratedColumn,
} from 'typeorm';
import { Post } from './Post';
import { User } from './User';

@Entity()
export class Comment extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  content!: string;

  @Column({
    default: null,
  })
  parent!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @ManyToOne(type => User, user => user.comments)
  user!: User;

  @ManyToOne(type => Post, post => post.comments)
  post!: Post;
}
