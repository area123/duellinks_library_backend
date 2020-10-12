import { define } from 'typeorm-seeding';
import { User } from '../entity/User';
import Faker from 'faker';

define(User, (faker: typeof Faker) => {
  const email = faker.internet.email();
  const password = 'password';
  const nickname = faker.random.word();

  const user = new User();
  user.email = email;
  user.password = password;
  user.nickname = nickname;

  return user;
});
