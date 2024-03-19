import { type Collection } from 'mongodb';
import { MongoHelper } from '../../helpers/mongo-helper';
import { LogMongoRepository } from './log-error.repository';
import { type ILogErrorRepository } from '../../../../../data/protocols/log-error.repository';
interface ISutType {
  sut: ILogErrorRepository;
}
const makeSut = (): ISutType => {
  const sut = new LogMongoRepository();
  return { sut };
};
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
    const { sut } = makeSut();
    await sut.logError('any_error');
    const count = await errorsCollection.countDocuments();
    expect(count).toBe(1);
  });
});
