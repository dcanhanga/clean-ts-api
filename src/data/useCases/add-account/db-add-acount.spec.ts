import { DbAddAccount } from './db-add-account';
import { type IEncryptor } from '../../protocols/encrypt';

interface ISuTypes {
  sut: DbAddAccount;
  encryptStub: IEncryptor;
}
const makeSut = (): ISuTypes => {
  class EncryptStub {
    async encrypt(value: string): Promise<string> {
      return await Promise.resolve('hashed_value');
    }
  }
  const encryptStub = new EncryptStub();
  const sut = new DbAddAccount(encryptStub);
  return {
    sut,
    encryptStub
  };
};
describe('DbAddAccount UseCase', () => {
  test('Should call Encrypt with correct password', async () => {
    const { encryptStub, sut } = makeSut();
    const encryptSpy = jest.spyOn(encryptStub, 'encrypt');
    const accountData = {
      name: 'Valid_name',
      email: 'Valid_name',
      password: 'Valid_password'
    };
    await sut.add(accountData);
    expect(encryptSpy).toHaveBeenCalledWith('Valid_password');
  });
});
