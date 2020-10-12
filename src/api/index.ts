import Router from 'koa-router';
import auth from './auth';
import posts from './posts';
import comments from './comments';

const api = new Router();

api.use('/auth', auth.routes());
api.use('/posts', posts.routes());
api.use('/comments', comments.routes());

export default api;
