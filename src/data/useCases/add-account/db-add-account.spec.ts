import { DbAddAccount } from './db-add-account.useCase';

describe('DbAddAccount UseCase', () => {
  test('Should call Encryptor with correct password', async () => {
    class EncryptorStub {
      async encrypt(value: string): Promise<string> {
        return await Promise.resolve('hashed_password');
      }
    }
    const encryptorStub = new EncryptorStub();
    const sut = new DbAddAccount(encryptorStub);
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
