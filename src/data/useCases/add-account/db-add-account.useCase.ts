import {
  type IAddAccount,
  type IAccountModel,
  type IAddAccountModel,
  type IAddAccountRepository,
  type IEncryptor
} from './db-add-account-protocols';

export class DbAddAccount implements IAddAccount {
  constructor(
    private readonly encryptor: IEncryptor,
    private readonly addAccountRepository: IAddAccountRepository
  ) {}

  async add(accountData: IAddAccountModel): Promise<IAccountModel> {
    const { email, name, password } = accountData;
    const passwordHashed = await this.encryptor.encrypt(password);
    const account = await this.addAccountRepository.add({ email, name, password: passwordHashed });
    return account;
  }
}
