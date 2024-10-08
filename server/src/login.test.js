const request = require('supertest');
const app = require('./app'); 

describe('POST /login', () => {
  it('Deve retornar erro, login inválido.', async () => {
    const response = await request(app)
      .post('/login')
      .send({ user: 'testuser', pass: 'password123' });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Unauthorized');
  });
});

describe('POST /register', () => {
  it('Deve registrar um novo usuário.', async () => {
    const response = await request(app)
      .post('/register')
      .send({ user: 'newuser', pass: 'newpassword' });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('User registered successfully');
  });
});
