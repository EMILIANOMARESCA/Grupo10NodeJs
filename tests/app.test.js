const request = require('supertest');
const app = require('../index');

describe('Baseline app behavior', () => {
  test('GET /auth/login responde 200', async () => {
    const response = await request(app).get('/auth/login');

    expect(response.statusCode).toBe(200);
  });

  test('GET /admin redirige a /auth/login si no hay sesión', async () => {
    const response = await request(app).get('/admin');

    expect(response.statusCode).toBe(302);
    expect(response.headers.location).toBe('/auth/login');
  });

  test('GET /ruta-inexistente responde 404', async () => {
    const response = await request(app).get('/ruta-inexistente');

    expect(response.statusCode).toBe(404);
  });

  test('POST /auth/login rechaza payload inválido', async () => {
    const response = await request(app).post('/auth/login').send({
      email: 'no-es-email',
      password: '123'
    });

    expect(response.statusCode).toBe(400);
    expect(Array.isArray(response.body.errors)).toBe(true);
  });
});
