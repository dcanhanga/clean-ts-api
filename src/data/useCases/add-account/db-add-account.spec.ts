import { type IAddAccount } from '../../../domain/useCases';
import { type IEncryptor } from '../../protocols';
import { DbAddAccount } from './db-add-account.useCase';
interface ISutType {
  sut: IAddAccount;
  encryptorStub: IEncryptor;
}
const makeSut = (): ISutType => {
  class EncryptorStub {
    async encrypt(value: string): Promise<string> {
      return await Promise.resolve('hashed_password');
    }
  }

  const encryptorStub = new EncryptorStub();
  const sut = new DbAddAccount(encryptorStub);
  return { sut, encryptorStub };
};
describe('DbAddAccount UseCase', () => {
  test('Should call Encryptor with correct password', async () => {
    const { sut, encryptorStub } = makeSut();
    const encryptSpy = jest.spyOn(encryptorStub, 'encrypt');
    const accountData = {
      name: 'valid_name',
      email: 'valid_name',
      password: 'valid_password'
    };
    await sut.add(accountData);
    expect(encryptSpy).toHaveBeenCalledWith(accountData.password);
  });
});
