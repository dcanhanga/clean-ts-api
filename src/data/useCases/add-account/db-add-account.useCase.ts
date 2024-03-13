import { type IAccountModel } from '../../../domain/model';
import { type IAddAccountModel, type IAddAccount } from '../../../domain/useCases/add-account';
import { type IEncryptor } from '../../protocols/encryptor';
export class DbAddAccount implements IAddAccount {
  constructor(private readonly encryptor: IEncryptor) {}
  async add(account: IAddAccountModel): Promise<IAccountModel> {
    await this.encryptor.encrypt(account.password);
  }
}
