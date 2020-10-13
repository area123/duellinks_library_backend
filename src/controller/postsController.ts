import { Context, Next } from 'koa';
import { getRepository } from 'typeorm';
import { Post } from '../entity/Post';
import { User } from '../entity/User';

// id에 맞는 post가 있으면 ctx.state에 post를 넣음
export const getPostById = async (ctx: Context, next: Next) => {
  const { id } = ctx.params;
  try {
    const post = await Post.findOne({
      where: {
        id: id,
      },
      relations: ['user'],
    });

    if (!post) {
      ctx.status = 404;
      return;
    }

    ctx.state.post = post;
    return next();
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const checkOwnPost = async (ctx: Context, next: Next) => {
  const { user, post } = ctx.state;
  if (post.user.id !== user.id) {
    ctx.status = 403;
    return;
  }
  return next();
};

export const write = async (ctx: Context) => {
  const { title, content, sort, tags } = ctx.request.body;
  const { id } = ctx.state.user;

  try {
    const user = await User.findOne({
      id: id,
    });

    const post = new Post();
    post.title = title;
    post.content = content;
    post.sort = sort;
    post.tags = tags;
    post.user = user!;

    await post.save();
    post.user.serialize();

    ctx.body = post;
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const list = async (ctx: Context) => {
  const page = parseInt(ctx.query.page || '1', 10);
  const sort = ctx.query.sort;

  if (page < 1) {
    ctx.status = 400;
    return;
  }

  try {
    if (sort === 'null') {
      const freeBoard = await Post.findBySort('자유게시판');
      const noticeBoard = await Post.findBySort('공지사항');
      const gameBoard = await Post.findBySort('게임');
      const consoleBoard = await Post.findBySort('콘솔');

      const posts = freeBoard.concat(noticeBoard, gameBoard, consoleBoard);

      for (let i = 0; i < posts.length; i++) {
        posts[i].user.serialize();
      }

      ctx.body = posts;
    } else {
      const posts = await Post.pagination(sort, page);

      for (let i = 0; i < posts.length; i++) {
        posts[i].user.serialize();
      }

      const count = await Post.count({
        where: {
          sort: sort,
        },
      });
      const lastPage = Math.ceil(count / 20);
      ctx.set('current-page', page.toString());
      ctx.set('last-page', lastPage.toString());
      ctx.body = posts;
    }
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const read = async (ctx: Context) => {
  ctx.body = ctx.state.post;
};

export const remove = async (ctx: Context) => {
  try {
    const post = ctx.state.post;
    await post.remove();
    ctx.status = 204;
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const update = async (ctx: Context) => {
  const { title, content, sort, tags } = ctx.request.body;
  try {
    const post = ctx.state.post;
    post.title = title;
    post.content = content;
    post.sort = sort;
    post.tags = tags;

    await post.save();
    post.user.serialize();

    ctx.body = post;
  } catch (e) {
    ctx.throw(500, e);
  }
};
