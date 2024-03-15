import request from 'supertest';
import app from '../config/app';
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper';
describe('SingUp Routes', () => {
  beforeAll(async () => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    await MongoHelper.connect(process.env.MONGO_URL!);
  });

  beforeEach(async () => {
    const accountCollection = MongoHelper.getCollection('accounts');
    await accountCollection.deleteMany({});
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });
  test('Should return return an account on success', async () => {
    await request(app)
      .post('/api/signup')
      .send({
        name: 'Zinga',
        email: 'zinga@email.com',
        password: '123',
        passwordConfirmation: '123'
      })
      .expect(200);
  });
});
