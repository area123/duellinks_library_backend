import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity, ManyToOne, CreateDateColumn, OneToMany,
} from 'typeorm';
import { User } from './User';
import { Comment } from './Comment';

// export type sortType = '자유게시판' | '공지사항' | '게임' | '콘솔';

@Entity()
export class Post extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column('text')
  content!: string;

  @Column()
  sort!: string;

  @Column()
  tags!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @ManyToOne(type => User, user => user.posts)
  user!: User;

  @OneToMany(type => Comment, comment => comment.post)
  comments!: Comment[];

  static findBySort(sort: string) {
    return this.find({
      where: [
        {
          sort: sort,
        },
      ],
      order: {
        id: 'DESC',
      },
      take: 10,
      relations: ['user'],
    });
  }

  static pagination(sort: string, page: number) {
    return this.find({
      where: [
        {
          sort: sort,
        },
      ],
      order: {
        id: 'DESC',
      },
      take: 20,
      skip: ((page - 1) * 20),
      relations: ['user'],
    });
  }
}
