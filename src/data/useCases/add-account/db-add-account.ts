import { type IAccountModel } from '../../../domain/models/account';
import {
  type IAddAccount,
  type IAddAccountModel
} from '../../../domain/useCases/add-account.useCase';
import { type ICrypto } from '../../protocols/encrypt';

export class DbAddAccount implements IAddAccount {
  constructor(private readonly crypto: ICrypto) {}
  async add(account: IAddAccountModel): Promise<IAccountModel> {
    await this.crypto.encrypt(account.password);
    return await Promise.resolve({ id: 'string', name: 'string', email: 'string' });
  }
}
