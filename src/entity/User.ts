import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity, OneToMany,
  CreateDateColumn, BeforeInsert,
} from 'typeorm';
import { Post } from './Post';
import bcrypt from 'bcrypt';
import { Comment } from './Comment';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column()
  nickname!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @OneToMany(type => Post, post => post.user)
  posts!: Post[];

  @OneToMany(type => Comment, comment => comment.user)
  comments!: Comment[];

  @BeforeInsert()
  async setPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
