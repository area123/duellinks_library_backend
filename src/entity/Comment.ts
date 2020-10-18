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

  @Column()
  seq!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @ManyToOne(type => User, user => user.comments)
  user!: User;

  @ManyToOne(type => Post, post => post.comments)
  post!: Post;

  static findByPost(postId: number) {
    return this.createQueryBuilder("comment")
      .leftJoinAndSelect('comment.user', 'user')
      .where('comment.postId = :postId', { postId: postId })
      .orderBy('IF(ISNULL(comment.parent), comment.id, comment.parent), comment.seq')
      .getMany();
  }
}
