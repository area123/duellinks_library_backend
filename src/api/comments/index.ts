import Router from 'koa-router';
import * as cmtCtrl from '../../controller/commentsController';
import checkLoggedIn from '../../lib/checkLoggedIn';
import { checkOwnPost, getPostById } from '../../controller/postsController';

const comments = new Router();

// 댓글 리스트 가져오기
comments.get('/', cmtCtrl.list);
// 댓글 생성
comments.post('/', checkLoggedIn, cmtCtrl.write);

const comment = new Router();

// 댓글 삭제
comment.delete('/', checkLoggedIn, cmtCtrl.remove);

// 댓글 변경
comment.patch('/', checkLoggedIn, cmtCtrl.update);

comments.use('/:id', comment.routes());

export default comments;
