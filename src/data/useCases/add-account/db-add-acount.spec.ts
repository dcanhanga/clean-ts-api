import { DbAddAccount } from './db-add-account';

describe('DbAddAccount UseCase', () => {
  test('Should call Encrypt with correct password', async () => {
    class EncryptStub {
      async encrypt(value: string): Promise<string> {
        return await Promise.resolve('hashed_value');
      }
    }
    const encryptStub = new EncryptStub();
    const sut = new DbAddAccount(encryptStub);
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
