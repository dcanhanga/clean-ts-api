import { type IAccountModel } from '../../../domain/models/account';
import {
  type IAddAccount,
  type IAddAccountModel
} from '../../../domain/useCases/add-account.useCase';
import { type IEncryptor } from '../../protocols/encrypt';

export class DbAddAccount implements IAddAccount {
  constructor(private readonly encryptor: IEncryptor) {}
  async add(account: IAddAccountModel): Promise<IAccountModel> {
    await this.encryptor.encrypt(account.password);
    return await Promise.resolve({ id: 'string', name: 'string', email: 'string' });
  }
}
