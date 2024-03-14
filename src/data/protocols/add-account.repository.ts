import { type IAccountModel } from '../../domain/model';
import { type IAddAccountModel } from '../../domain/useCases';

export interface IAddAccountRepository {
  add: (accountData: IAddAccountModel) => Promise<IAccountModel>;
}
