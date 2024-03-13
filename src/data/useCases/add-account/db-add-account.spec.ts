import {
  type IEncryptor,
  type IAddAccount,
  type IAddAccountRepository,
  type IAddAccountModel,
  type IAccountModel
} from './db-add-account-protocols';
import { DbAddAccount } from './db-add-account.useCase';

interface ISutType {
  sut: IAddAccount;
  encryptorStub: IEncryptor;
  addAccountRepositoryStub: IAddAccountRepository;
}
const makeEncryptorStub = (): IEncryptor => {
  class EncryptorStub implements IEncryptor {
    async encrypt(value: string): Promise<string> {
      return await Promise.resolve('hashed_password');
    }
  }

  return new EncryptorStub();
};

const makeAddAccountRepository = (): IAddAccountRepository => {
  class AddAccountRepositoryStud implements IAddAccountRepository {
    async add(accountData: IAddAccountModel): Promise<IAccountModel> {
      const fakeAccount = {
        id: 'valid_id',
        name: 'valid_name',
        email: 'valid_email',
        password: 'hashed_password'
      };
      return await Promise.resolve(fakeAccount);
    }
  }

  return new AddAccountRepositoryStud();
};

const makeSut = (): ISutType => {
  const encryptorStub = makeEncryptorStub();
  const addAccountRepositoryStub = makeAddAccountRepository();
  const sut = new DbAddAccount(encryptorStub, addAccountRepositoryStub);
  return { sut, encryptorStub, addAccountRepositoryStub };
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

  test('Should throw if Encryptor throw', async () => {
    const { sut, encryptorStub } = makeSut();
    jest.spyOn(encryptorStub, 'encrypt').mockResolvedValueOnce(Promise.reject(new Error()));
    const accountData = {
      name: 'valid_name',
      email: 'valid_name',
      password: 'valid_password'
    };
    const promise = sut.add(accountData);
    await expect(promise).rejects.toThrow();
  });
  test('Should call AddAccountRepositor with correct values', async () => {
    const { sut, addAccountRepositoryStub } = makeSut();
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add');
    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'hashed_password'
    };
    await sut.add(accountData);
    expect(addSpy).toHaveBeenLastCalledWith(accountData);
  });
  test('Should throw if AddAccountRepository throw', async () => {
    const { sut, addAccountRepositoryStub } = makeSut();
    jest.spyOn(addAccountRepositoryStub, 'add').mockResolvedValueOnce(Promise.reject(new Error()));
    const accountData = {
      name: 'valid_name',
      email: 'valid_name',
      password: 'valid_password'
    };
    const promise = sut.add(accountData);
    await expect(promise).rejects.toThrow();
  });
});
