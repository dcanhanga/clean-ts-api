import { SignUpController } from './../../presentation/controllers/sign-up.controller';
import { DbAddAccount } from '../../data/useCases/add-account/db-add-account.useCase';
import { EmailValidatorAdapter } from '../../utils/email-validator-adapter';
import { BcryptAdapter } from '../../infra/cryptography/bcrypt-adapter';
import { AccountMongoRepository } from '../../infra/db/mongodb/repositories/account/account.repository';

export const makeSignUpController = (): SignUpController => {
  const saltOrRounds = 12;
  const emailValidatorAdapter = new EmailValidatorAdapter();
  const bcryptAdapter = new BcryptAdapter(saltOrRounds);
  const addAccountRepository = new AccountMongoRepository();
  const dbAddAccount = new DbAddAccount(bcryptAdapter, addAccountRepository);
  return new SignUpController(emailValidatorAdapter, dbAddAccount);
};
