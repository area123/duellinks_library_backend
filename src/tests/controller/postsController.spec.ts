import request from 'supertest';

describe('postsController /api/posts/', () => {
  const server = request.agent('http://localhost:4000/api/');
  let postId: number;
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
      .get('posts?page=1&sort=null');
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(40);
    expect('password' in response.body[0].user).toBe(false);
  });

  it('pagination', async () => {
    const sort = encodeURI('자유게시판');
    const response = await server
      .get(`posts?page=1&sort=${sort}`);
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(20);
    expect('password' in response.body[0].user).toBe(false);
  });

  it('write', async () => {
    const data = {
      title: '테스트 제목',
      content: '<p>테스트 컨텐트</p>',
      sort: '자유게시판',
      tags: '태그1 태그2',
    };
    const response = await server
      .post('posts/')
      .send(data)
      .set('Accept', 'application/json');
    postId = response.body.id;
    expect(response.status).toBe(200);
    expect('password' in response.body.user).toBe(false);
  });

  it('update', async () => {
    const data = {
      title: '제목 업데이트',
      content: '<p>컨텐트 업데이트</p>',
      sort: '자유게시판',
      tags: 'tag1 tag2',
    };
    const response = await server
      .patch(`posts/${postId}`)
      .send(data)
      .set('Accept', 'application/json');
    expect(response.status).toBe(200);
    console.log(response.body);
    expect('password' in response.body.user).toBe(false);
  });

  it('remove', async () => {
    const response = await server
      .delete(`posts/${postId}`);
    expect(response.status).toBe(204);
  });
});
