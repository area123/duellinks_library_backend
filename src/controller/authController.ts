import { Context } from 'koa';
import { User } from '../entity/User';
import bcrypt from 'bcrypt';

export const register = async (ctx: Context) => {
  const { email, password, nickname } = ctx.request.body;
  try {
    const exists = await User.findOne({ email: email });
    if (exists) {
      ctx.status = 409;
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
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const login = async (ctx: Context) => {
  const { email, password } = ctx.request.body;

  if (!email || !password) {
    ctx.status = 401;
    return;
  }

  try {
    const user = await User.findOne({ email: email });
    console.log(user);
    if (!user) {
      ctx.status = 401;
      return;
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      ctx.status = 401;
      return;
    }
    user.serialize();
    ctx.body = user;
    const token = user.generateToken();
    ctx.cookies.set('access_token', token, {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true,
    });
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const check = async (ctx: Context) => {
  const { user } = ctx.state;
  if (!user) {
    ctx.status = 401;
    return;
  }
  ctx.body = user;
};

export const logout = async (ctx: Context) => {
  ctx.cookies.set('access_token');
  ctx.status = 204;
};
