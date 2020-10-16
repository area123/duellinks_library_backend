import { Context, Next } from 'koa';
import { User } from '../entity/User';
import { Comment } from '../entity/Comment';
import { Post } from '../entity/Post';

// id에 맞는 댓글이 있는지 확인하는 미들웨어
export const getCommentsById = async (ctx: Context, next: Next) => {
  const { id } = ctx.params;
  try {
    const comment = await Comment.findOne({
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

// 사용자가 작성한 댓글인지 확인하는 미들웨어
export const checkOwnComment = async (ctx: Context, next: Next) => {
  const { user, comment } = ctx.state;
  if (comment.user.id !== user.id) {
    ctx.status = 403;
    return;
  }
  return next();
};

export const write = async (ctx: Context) => {
  const { content, postId, parent, seq } = ctx.request.body;
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
    if (user && post) {
      comment.user = user;
      comment.post = post;
    } else {
      ctx.status = 404;
    }
    comment.parent = parent;
    comment.seq = seq;

    await comment.save();
    comment.user.serialize();

    ctx.body = comment;
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
    const comments = await Comment.findByPost(postId);

    for (let i = 0; i < comments.length; i++) {
      comments[i].user.serialize();
    }

    ctx.body = comments;
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const remove = async (ctx: Context) => {
  try {
    const comment: Comment = ctx.state.comment;
    await comment.remove();
    ctx.status = 204;
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const update = async (ctx: Context) => {
  const { content, parent, seq } = ctx.request.body;
  try {
    const comment: Comment = ctx.state.comment;
    comment.content = content;
    comment.parent = parent;
    comment.seq = seq;

    await comment.save();
    comment.user.serialize();

    ctx.body = comment;
  } catch (e) {
    ctx.throw(500, e);
  }
};
