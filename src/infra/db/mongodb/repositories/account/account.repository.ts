import { type IAddAccountRepository } from '../../../../../data/protocols';
import { type IAccountModel } from '../../../../../domain/model';
import { type IAddAccountModel } from '../../../../../domain/useCases';
import { MongoHelper } from '../../helpers/mongo-helper';

export class AccountMongoRepository implements IAddAccountRepository {
  async add(accountData: IAddAccountModel): Promise<IAccountModel> {
    const accountCollection = MongoHelper.getCollection('accounts');
    const insertedId = await accountCollection.insertOne(accountData);
    const insertedDocument = await accountCollection.findOne({ _id: insertedId.insertedId });
    return MongoHelper.map<IAccountModel>(insertedDocument);
  }
}
