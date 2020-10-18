import 'dotenv/config';
import { createConnection, ConnectionOptions } from 'typeorm';
import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import serve from 'koa-static';
import path from 'path';
import send from 'koa-send';

import api from './api';
import jwtMiddleware from './lib/jwtMiddleware';
import { User } from './entity/User';
import { Post } from './entity/Post';
import { Comment } from './entity/Comment';

const option: ConnectionOptions = {
  type: 'mariadb',
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  port: parseInt(process.env.DB_PORT!, 10),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  synchronize: true,
  logging: false,
  entities: [User, Post, Comment],
};

(async () => {
  try {
    await createConnection(option);
    console.log('데이터베이스가 연결되었습니다 :)');
  } catch (e) {
    console.log('데이터베이스의 연결에 문제가 생겼습니다. ㅠㅠ');
    console.log(e);
    console.log(option);
  }
})();

const app = new Koa();
const router = new Router();

router.use('/api', api.routes());

app.use(bodyParser());
app.use(jwtMiddleware);
app.use(router.routes()).use(router.allowedMethods());

const buildDirectory = path.resolve(__dirname, '../public');
app.use(serve(buildDirectory));

app.use(async ctx => {
  if (ctx.status === 404 && ctx.path.indexOf('/api') !== 0) {
    await send(ctx, 'index.html', { root: buildDirectory });
  }
});

export default app;
