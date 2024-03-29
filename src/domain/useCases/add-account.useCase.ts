import { type IAccountModel } from '../model';

export interface IAddAccountModel {
  name: string;
  email: string;
  password: string;
}
export interface IAddAccount {
  add: (accountData: IAddAccountModel) => Promise<IAccountModel>;
}
