import { Context, Next } from 'koa';

const checkLoggedIn = (ctx: Context, next: Next) => {
  if (!ctx.state.user) {
    ctx.status = 401;
    return;
  }
  return next();
};

export default checkLoggedIn;
