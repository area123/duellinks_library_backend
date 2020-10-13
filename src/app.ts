import 'reflect-metadata';
import { createConnection } from 'typeorm';
import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';

import api from './api';
import jwtMiddleware from './lib/jwtMiddleware';

(async () => {
  try {
    await createConnection();
    console.log('데이터베이스가 연결되었습니다 :)');
  } catch (e) {
    console.log('데이터베이스의 연결에 문제가 생겼습니다. ㅠㅠ');
    console.log(e);
  }
})();

const app = new Koa();
const router = new Router();

router.use('/api', api.routes());

app.use(bodyParser());
app.use(jwtMiddleware);
app.use(router.routes()).use(router.allowedMethods());

export default app;
