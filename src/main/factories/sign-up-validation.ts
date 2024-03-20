import { type IValidation } from '../../presentation/helpers';
import { RequiredFieldsValidation } from '../../presentation/helpers/validators/required-fields-validation';
import { ValidationComposite } from '../../presentation/helpers/validators/validation-composite';

export const makeSignUpValidation = (): IValidation => {
  const validations: IValidation[] = [];
  for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
    validations.push(new RequiredFieldsValidation(field));
  }
  const validationComposite = new ValidationComposite(validations);
  return validationComposite;
};
