import request from 'supertest';
import app from '../config/app';
describe('CORS  Middleware', () => {
  test('Should enable Cors', async () => {
    app.post('/test_cors', (req, res) => {
      res.send();
    });
    await request(app)
      .get('/test_body_parser')
      .send({ name: 'Zinga' })
      .expect('access-control-allow-origin', '*')
      .expect('access-control-allow-methods', '*')
      .expect('access-control-allow-header', '*');
  });
});
