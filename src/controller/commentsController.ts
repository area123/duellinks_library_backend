import { Context, Next } from 'koa';
import { User } from '../entity/User';
import { Comment } from '../entity/Comment';
import { Post } from '../entity/Post';

export const getCommentsById = async (ctx: Context, next: Next) => {
  const { id } = ctx.params;
  try {
    const comment = await Comment.find({
      where: {
        id: id,
      },
      relations: ['user', 'post'],
    });

    if (!comment) {
      ctx.status = 404;
      return;
    }

    ctx.state.comment = comment;
    return next();
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const write = async (ctx: Context) => {
  const { content, postId, parent } = ctx.request.body;
  const { id } = ctx.state.user;
  try {
    const user = await User.findOne({
      where: {
        id: id,
      },
    });

    const post = await Post.findOne({
      where: {
        id: postId,
      },
    });

    const comment = new Comment();
    comment.content = content;
    if (user) {
      comment.user = user;
    } else {
      ctx.status = 404;
    }
    if (post) {
      comment.post = post;
    } else {
      ctx.status = 404;
    }
    comment.parent = parent;

    const data = await comment.save();
    // @ts-ignore
    // delete data.user.password;

    ctx.body = data;
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const list = async (ctx: Context) => {
  const { postId } = ctx.request.query;
  try {
    const post = await Post.findOne({
      where: {
        id: postId,
      },
    });
    if (!post) {
      ctx.status = 404;
      return;
    }
    const comments = await Comment.find({
      where: {
        post: {
          id: postId,
        },
      },
      relations: ['user'],
    });
    console.log(comments.length);
    ctx.body = comments;
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const remove = async (ctx: Context) => {
  const { id } = ctx.params;
  try {
    const comment = await Comment.findOne(id);
    if (!comment) {
      ctx.status = 404;
      return;
    }
    comment?.remove();
    ctx.body = comment;
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const update = async (ctx: Context) => {
  const { content } = ctx.request.body;
  const { id } = ctx.params;
  try {
    const comment = await Comment.findOne(id);
    // @ts-ignore
    comment?.content = content;
    const data = await comment?.save();
    console.log(data);
    ctx.body = data;
  } catch (e) {
    ctx.throw(500, e);
  }
};
