import 'reflect-metadata';
import { Connection, createConnection } from 'typeorm';
import { factory, runSeeder, tearDownDatabase, useRefreshDatabase, useSeeding } from 'typeorm-seeding';
import { User } from '../entity/User';
import CreateUsers from '../seeds/create-users.seed';

describe('UserService', () => {
  let connection: Connection;
  beforeAll(async (done) => {
    connection = await useRefreshDatabase({ connection: 'mariadb' });
    await useSeeding();

    const user = await factory(User)().make();
    const createdUser = await factory(User)().create();

    await runSeeder(CreateUsers);
  });

  afterAll(async (done) => {
    await tearDownDatabase();
    done();
  });
});
