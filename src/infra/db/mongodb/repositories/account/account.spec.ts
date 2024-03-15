import { type IAddAccountRepository } from '../../../../../data/protocols';
import { MongoHelper } from '../../helpers/mongo-helper';
import { AccountMongoRepository } from './account.repository';
const makeSut = (): IAddAccountRepository => {
  return new AccountMongoRepository();
};
describe('Account Mongo Repository', () => {
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

  test('Should return an account on success', async () => {
    const sut = makeSut();
    const account = await sut.add({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    });
    expect(account).toBeTruthy();
    expect(typeof account.id).toBe('string');
    expect(account.name).toBe('any_name');
    expect(account.email).toBe('any_email@mail.com');
    expect(account.password).toBe('any_password');
  });
});
