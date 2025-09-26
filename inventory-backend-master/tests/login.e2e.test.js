const request = require('supertest');
const app = require('../index'); // Adjust if your Express app is exported differently

describe('POST /api/login', () => {
  it('should login successfully with valid credentials', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({ username: 'admin', password: 'password123' });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });
});



