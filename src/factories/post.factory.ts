import { define, factory } from 'typeorm-seeding';
import { Post } from '../entity/Post';
import Faker from 'faker';
import { User } from '../entity/User';

define(Post, (faker: typeof Faker) => {
  const title = faker.random.word();
  const content =
    '하나에 멀리 별빛이 하나 그리워 풀이 거외다. 속의 우는 밤을 시와 책상을 벌써 새워 버리었습니다. 이름자 이름자를 시인의 릴케 나의 된 계십니다. 이웃 옥 않은 이국 봅니다. 토끼, 하나의 나의 노루, 북간도에 헤는 아스라히 까닭입니다. 이름자를 묻힌 나의 이네들은 이 이름과, 슬퍼하는 어머니, 봄이 듯합니다. 같이 가슴속에 별이 오는 이 멀리 계절이 당신은 봅니다. 걱정도 파란 어머니, 봅니다. 둘 아침이 내린 소녀들의 토끼, 아스라히 듯합니다. 남은 가난한 이름을 당신은 애기 동경과 버리었습니다.<br>' +
    '이름자 많은 사람들의 겨울이 봅니다. 흙으로 마리아 파란 추억과 책상을 벌레는 프랑시스 계십니다. 계절이 때 내일 이런 마리아 듯합니다. 릴케 우는 프랑시스 내 봅니다. 별에도 애기 마디씩 묻힌 별 가을 아름다운 이름과, 있습니다. 쓸쓸함과 많은 가을 어머님, 하나에 거외다. 나의 다하지 그리워 덮어 한 무덤 이름과, 듯합니다. 계절이 마디씩 내 내린 듯합니다. 밤이 어머니, 이름을 멀리 거외다. 마리아 흙으로 가난한 내일 이런 않은 계십니다. 비둘기, 마디씩 이제 이웃 새워 오면 까닭입니다.<br>' +
    '아스라히 했던 벌써 이름과, 내린 별에도 비둘기, 추억과 거외다. 언덕 같이 까닭이요, 별들을 이름을 이국 있습니다. 별 별빛이 어머니, 이름과, 나는 이네들은 당신은 까닭입니다. 동경과 잠, 흙으로 어머니 이름과, 위에 나는 이름과 덮어 계십니다. 없이 아무 못 내 헤일 딴은 우는 나는 까닭입니다. 멀리 남은 이름자를 다하지 쉬이 덮어 나는 새워 라이너 버리었습니다. 노루, 지나고 소학교 하나에 하늘에는 있습니다. 까닭이요, 아스라히 당신은 밤이 있습니다. 위에 이런 별 이런 토끼, 나는 별 까닭이요, 까닭입니다. 언덕 잠, 별 이름과, 노새, 하나에 거외다. 언덕 이제 잔디가 별이 옥 쉬이 위에도 계십니다.';
  const sort = '자유게시판';
  const random = Math.floor(Math.random() * 10);
  let tags = '';
  if (!(random < 1)) {
    for (let i = 0; i < random; i++) {
      if (tags === '') {
        tags = faker.random.word();
      } else {
        tags = `${tags} ${faker.random.word()}`;
      }
    }
  }

  const post = new Post();
  post.title = title;
  post.content = content;
  post.sort = sort;
  post.tags = tags;
  post.user = factory(User)() as any;

  return post;
});
