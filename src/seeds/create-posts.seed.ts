import { Seeder, Factory } from 'typeorm-seeding';
import { Post } from '../entity/Post';

export default class CreatePosts implements Seeder {
  public async run(factory: Factory): Promise<void> {
    const sort = ['자유게시판', '공지사항', '게임', '콘솔'];

    for (let i = 0; i < 4; i++) {
      await factory(Post)().createMany(20, {
        sort: sort[i],
      });
    }
  }
}
