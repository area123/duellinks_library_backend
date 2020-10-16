import request from 'supertest';

describe('commentsController /api/comments/', () => {
  const server = request.agent('http://localhost:4000/api/');
  let commentId: number;
  beforeAll(async () => {
    await server
      .post('auth/login')
      .send({
        email: 'test@test.com',
        password: 'password',
      })
      .set('Accept', 'application/json');
  });

  it('list', async () => {
    const response = await server
      .get('comments?postId=4338');
    expect(response.status).toBe(200);
    expect(response.body.length > 1).toBe(true);
    expect('password' in response.body[0].user).toBe(false);
  });

  it('write', async () => {
    const data = {
      content: '댓글 테스트',
      postId: 325,
      parent: null,
    };
    const response = await server
      .post('comments')
      .send(data)
      .set('Accept', 'application/json');
    commentId = response.body.id;
    expect(response.status).toBe(200);
    expect('password' in response.body.user).toBe(false);
  });

  it('update', async () => {
    const data = {
      content: '댓글 변경하기',
      postId: 325,
      parent: null,
    };
    const response = await server
      .patch(`comments/${commentId}`)
      .send(data)
      .set('Accept', 'application/json');
    expect(response.status).toBe(200);
    expect('password' in response.body.user).toBe(false);
  });

  it('delete', async () => {
    const response = await server
      .delete(`comments/${commentId}`)
    expect(response.status).toBe(204);
  });
});
