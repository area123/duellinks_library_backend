import request from 'supertest';

describe('authController /api/auth/', () => {
  const server = request.agent('http://localhost:4000/api/auth/');
  let access_token = '';
  let cookie = '';
  it('register', async () => {
    const response = await server
      .post('register')
      .send({
        email: 'test100@test.com',
        password: 'password',
        nickname: 'kang',
      })
      .set('Accept', 'application/json');
    access_token = response.headers['set-cookie'][0].split('; ')[0].split('=')[1];
    cookie = response.headers['set-cookie'];
    expect(response.status).toBe(200);
    expect(access_token !== '').toBe(true);
    expect('password' in response.body).toBe(false);
  });

  it('login', async () => {
    const response = await server
      .post('login')
      .send({
        email: 'test@test.com',
        password: 'password',
      })
      .set('Accept', 'application/json');
    access_token = response.headers['set-cookie'][0].split('; ')[0].split('=')[1];
    cookie = response.headers['set-cookie'];
    expect(response.status).toBe(200);
    expect(access_token !== '').toBe(true);
    expect('password' in response.body).toBe(false);
  });

  it('check', async () => {
    const response = await server
      .get('check')
      .set('set-cookie', cookie);
    expect(response.status).toBe(200);
  });

  it('logout', async () => {
    const response = await server
      .post('logout')
      .set('Accept', 'application/json');
    access_token = response.headers['set-cookie'][0].split('; ')[0].split('=')[1];
    expect(response.status).toBe(204);
    expect(access_token === '').toBe(true);
  });
});
