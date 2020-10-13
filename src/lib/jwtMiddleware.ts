import jwt from 'jsonwebtoken';
import { Context, Next } from 'koa';
import { User } from '../entity/User';

const jwtMiddleware = async (ctx: Context, next: Next) => {
  const token = ctx.cookies.get('access_token');
  if (!token) return next();
  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    ctx.state.user = {
      id: decoded.id,
      email: decoded.email,
    };
    const now = Math.floor(Date.now() / 1000);
    if (decoded.exp - now < 60 * 60 * 24 * 3.5) {
      const user = await User.findOne(decoded.id);
      const newToken = user!.generateToken();
      ctx.cookies.set('access_token', newToken, {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true,
      });
    }
    return next();
  } catch (e) {
    return next();
  }
};

export default jwtMiddleware;
