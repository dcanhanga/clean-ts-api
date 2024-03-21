import { type IValidation } from '../../presentation/helpers';
import { PasswordMatchValidation } from '../../presentation/helpers/validators/password-match-validation';
import { EmailValidation } from '../../presentation/helpers/validators/email-validation';
import { RequiredFieldsValidation } from '../../presentation/helpers/validators/required-fields-validation';
import { ValidationComposite } from '../../presentation/helpers/validators/validation-composite';
import { EmailValidatorAdapter } from '../../utils/email-validator.adapter';

export const makeSignUpValidation = (): IValidation => {
  const validations: IValidation[] = [];
  for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
    validations.push(new RequiredFieldsValidation(field));
  }
  validations.push(new EmailValidation('email', new EmailValidatorAdapter()));
  validations.push(new PasswordMatchValidation('password', 'passwordConfirmation'));
  const validationComposite = new ValidationComposite(validations);
  return validationComposite;
};
