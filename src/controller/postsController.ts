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
  try {
    const postRepository = await getRepository(Post);
    const userRepository = await getRepository(User);

    const { title, content, sort, tags } = ctx.request.body;
    const { id } = ctx.state.user;

    const user = await userRepository.findOne({
      id: id,
    });

    const post = new Post();
    post.title = title;
    post.content = content;
    post.sort = sort;
    post.tags = tags;
    post.user = user!;

    ctx.body = await postRepository.save(post);
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

  const { tag, email } = ctx.query;

  try {
    const postRepository = await getRepository(Post);

    if (sort === 'null') {
      const freeBoard = await postRepository.find({
        where: [
          {
            ...(email ? { 'user.email': email } : {}),
            ...(tag ? { tags: tag } : {}),
            sort: '자유게시판',
          },
        ],
        order: {
          id: 'DESC',
        },
        take: 10,
        relations: ['user'],
      });

      const noticeBoard = await postRepository.find({
        where: [
          {
            ...(email ? { 'user.email': email } : {}),
            ...(tag ? { tags: tag } : {}),
            sort: '공지사항',
          },
        ],
        order: {
          id: 'DESC',
        },
        take: 10,
        relations: ['user'],
      });

      const gameBoard = await postRepository.find({
        where: [
          {
            ...(email ? { 'user.email': email } : {}),
            ...(tag ? { tags: tag } : {}),
            sort: '게임',
          },
        ],
        order: {
          id: 'DESC',
        },
        take: 10,
        relations: ['user'],
      });

      const consoleBoard = await postRepository.find({
        where: [
          {
            ...(email ? { 'user.email': email } : {}),
            ...(tag ? { tags: tag } : {}),
            sort: '콘솔',
          },
        ],
        order: {
          id: 'DESC',
        },
        take: 10,
        relations: ['user'],
      });

      const posts = freeBoard.concat(noticeBoard, gameBoard, consoleBoard);

      for (let i = 0; i < posts.length; i++) {
        // @ts-ignore
        delete posts[i].user.password;
      }

      ctx.body = posts;
    } else {
      const posts = await Post.find({
        where: [
          {
            sort: sort,
          },
        ],
        order: {
          id: 'DESC',
        },
        take: 20,
        skip: ((page - 1) * 20),
        relations: ['user'],
      });

      for (let i = 0; i < posts.length; i++) {
        // @ts-ignore
        delete posts[i].user.password;
      }

      const count = await Post.count({
        where: {
          sort: sort
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
    const postRepository = await getRepository(Post);
    const post = ctx.state.post;
    await postRepository.remove(post);
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

    ctx.body = await Post.save(post);
  } catch (e) {
    ctx.throw(500, e);
  }
};
