import { Context } from 'koa';
import { User } from '../entity/User';
import bcrypt from 'bcryptjs';
import logger from '../winston';

export const register = async (ctx: Context) => {
  const { email, password, nickname } = ctx.request.body;
  try {
    const exists = await User.findOne({ email: email });
    if (exists) {
      ctx.status = 409;
      logger.info('아이디가 종복되었습니다.');
      return;
    }
    const user = new User();
    user.email = email;
    user.password = password;
    user.nickname = nickname;

    await user.save();
    const token = user.generateToken();
    ctx.cookies.set('access_token', token, {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true,
    });

    user.serialize();

    ctx.body = user;
    logger.info('회원가입 성공');
  } catch (e) {
    ctx.throw(500, e);
    logger.error(`${ctx.url}에서 오류 발생`);
  }
};

export const login = async (ctx: Context) => {
  const { email, password } = ctx.request.body;

  if (!email || !password) {
    ctx.status = 401;
    logger.info('아이디와 비밀번호가 입력되지 않았습니다.');
    return;
  }

  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      ctx.status = 401;
      logger.info('아이디가 존재하지 않습니다.');
      return;
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      ctx.status = 401;
      logger.info('비밀번호가 맞지 않습니다.');
      return;
    }
    user.serialize();
    ctx.body = user;
    const token = user.generateToken();
    ctx.cookies.set('access_token', token, {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true,
    });
    logger.info('로그인 성공');
  } catch (e) {
    ctx.throw(500, e);
    logger.error(`${ctx.url}에서 오류 발생`);
  }
};

export const check = async (ctx: Context) => {
  const { user } = ctx.state;
  if (!user) {
    ctx.status = 401;
    logger.info('로그인을 하지 않았습니다.');
    return;
  }
  logger.info('토큰 갱신 성공');
  ctx.body = user;
};

export const logout = async (ctx: Context) => {
  ctx.cookies.set('access_token');
  ctx.status = 204;
  logger.info('로그아웃 성공');
};
