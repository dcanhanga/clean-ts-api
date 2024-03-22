import { DbAddAccount } from '../../../data/useCases/add-account/db-add-account.useCase';
import { BcryptAdapter } from '../../../infra/cryptography/bcrypt.adapter';
import { AccountMongoRepository } from '../../../infra/db/mongodb/repositories/account/account.repository';
import { LogMongoRepository } from '../../../infra/db/mongodb/repositories/log/log-error.repository';
import { LogControllerDecorator } from '../../decorators/log.decorator';
import { type IController } from '../../../presentation/protocols';
import { SignUpController } from '../../../presentation/controllers/sign-up/sign-up.controller';
import { makeSignUpValidation } from './sign-up-validation';

export const makeSignUpController = (): IController => {
  const saltOrRounds = 12;

  const bcryptAdapter = new BcryptAdapter(saltOrRounds);
  const addAccountRepository = new AccountMongoRepository();
  const logMongoRepository = new LogMongoRepository();
  const dbAddAccount = new DbAddAccount(bcryptAdapter, addAccountRepository);
  const validationComposite = makeSignUpValidation();
  const signUpController = new SignUpController(dbAddAccount, validationComposite);
  return new LogControllerDecorator(signUpController, logMongoRepository);
};
