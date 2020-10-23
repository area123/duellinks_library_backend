import { Context, Next } from 'koa';
import logger from '../winston';

const checkLoggedIn = (ctx: Context, next: Next) => {
  if (!ctx.state.user) {
    ctx.status = 401;
    logger.info('로그인이 안되어 있습니다.');
    return;
  }
  return next();
};

export default checkLoggedIn;
