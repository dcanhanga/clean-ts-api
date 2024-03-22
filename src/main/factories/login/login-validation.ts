import { type IValidation } from '../../../presentation/helpers';

import { EmailValidation } from '../../../presentation/helpers/validators/email-validation';
import { RequiredFieldsValidation } from '../../../presentation/helpers/validators/required-fields-validation';
import { ValidationComposite } from '../../../presentation/helpers/validators/validation-composite';
import { EmailValidatorAdapter } from '../../../utils/email-validator.adapter';

export const makeLoginValidation = (): IValidation => {
  const validations: IValidation[] = [];
  for (const field of ['email', 'password']) {
    validations.push(new RequiredFieldsValidation(field));
  }
  validations.push(new EmailValidation('email', new EmailValidatorAdapter()));
  const validationComposite = new ValidationComposite(validations);
  return validationComposite;
};
