import { Context, Next } from 'koa';

const checkLoggedIn = (ctx: Context, next: Next) => {
  console.log('시작');
  console.log(ctx.state.user);
  if (!ctx.state.user) {
    ctx.status = 401;
    return;
  }
  return next();
};

export default checkLoggedIn;
