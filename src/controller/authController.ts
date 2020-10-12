import { Context } from 'koa';
import { getRepository } from 'typeorm';
import { User } from '../entity/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const serialize = async (user: User) => {
  const data = user;
  // @ts-ignore
  delete data.password;
  return data;
};

export const generateToken = (id: number, email: string) => {
  return jwt.sign(
    {
      id: id,
      email: email,
    },
    process.env.JWT_SECRET!,
    {
      expiresIn: '7d',
    },
  );
};

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

    const data = await User.save(user);

    ctx.body = serialize(user);
    const token = generateToken(data.id, data.email);
    ctx.cookies.set('access_token', token, {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true,
    });
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const login = async (ctx: Context) => {
  const userRepository = await getRepository(User);

  const { email, password } = ctx.request.body;

  if (!email || !password) {
    ctx.status = 401;
    return;
  }

  try {
    const user = await userRepository.findOne({ email: email });
    if (!user) {
      ctx.status = 401;
      return;
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      ctx.status = 401;
      return;
    }
    // @ts-ignore
    delete user.password;
    console.log(user);
    ctx.body = user;
    const token = generateToken(user!.id, user!.email);
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
