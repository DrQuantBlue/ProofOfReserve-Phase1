import request from 'supertest';
import app from 'app.js';

describe('Proof of Reserve API', () => {
  test('GET /por should return proofData.json content', async () => {
    const response = await request(app).get('/por');

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('accountName');
    expect(response.body).toHaveProperty('totalReserve');
  });

  test('POST /login should return a valid token', async () => {
    const response = await request(app)
      .post('/login')
      .send({ username: process.env.ADMIN_USER, password: process.env.ADMIN_PASS });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('token');
  });

  test('POST /issue-tokens should fail without token', async () => {
    const response = await request(app).post('/issue-tokens').send({ amount: 1000 });

    expect(response.statusCode).toBe(403);
    expect(response.body).toHaveProperty('error', 'Token required');
  });

  test('POST /issue-tokens should succeed with valid token', async () => {
    const loginResponse = await request(app)
      .post('/login')
      .send({ username: process.env.ADMIN_USER, password: process.env.ADMIN_PASS });

    const token = loginResponse.body.token;

    const response = await request(app)
      .post('/issue-tokens')
      .set('Authorization', `Bearer ${token}`)
      .send({ amount: 1000 });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('message', 'Tokens issued successfully.');
  });
});
