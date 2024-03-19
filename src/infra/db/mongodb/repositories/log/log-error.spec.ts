import { type Collection } from 'mongodb';
import { MongoHelper } from '../../helpers/mongo-helper';
import { LogMongoRepository } from './log-error.repository';

describe('Log Mongo Repository', () => {
  let errorsCollection: Collection;
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL!);
  });

  beforeEach(async () => {
    errorsCollection = await MongoHelper.getCollection('errors');
    await errorsCollection.deleteMany({});
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });
  test('Should create any error log on success', async () => {
    const sut = new LogMongoRepository();
    await sut.logError('any_error');
    const count = await errorsCollection.countDocuments();
    expect(count).toBe(1);
  });
});
