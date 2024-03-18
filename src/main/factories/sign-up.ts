import { SignUpController } from './../../presentation/controllers/sign-up.controller';
import { DbAddAccount } from '../../data/useCases/add-account/db-add-account.useCase';
import { EmailValidatorAdapter } from '../../utils/email-validator.adapter';
import { BcryptAdapter } from '../../infra/cryptography/bcrypt.adapter';
import { AccountMongoRepository } from '../../infra/db/mongodb/repositories/account/account.repository';

import { LogControllerDecorator } from '../decorators/log.decorator';
import { type IController } from '../../presentation/protocols';

export const makeSignUpController = (): IController => {
  const saltOrRounds = 12;
  const emailValidatorAdapter = new EmailValidatorAdapter();
  const bcryptAdapter = new BcryptAdapter(saltOrRounds);
  const addAccountRepository = new AccountMongoRepository();
  const dbAddAccount = new DbAddAccount(bcryptAdapter, addAccountRepository);
  const signUpController = new SignUpController(emailValidatorAdapter, dbAddAccount);
  return new LogControllerDecorator(signUpController);
};
