import { type IValidation } from '../../presentation/helpers';
import { PasswordMatchValidation } from '../../presentation/helpers/validators/password-match-validation';
import { EmailValidation } from '../../presentation/helpers/validators/email-validation';
import { RequiredFieldsValidation } from '../../presentation/helpers/validators/required-fields-validation';
import { ValidationComposite } from '../../presentation/helpers/validators/validation-composite';
import { type IEmailValidator } from '../../presentation/protocols';
import { makeSignUpValidation } from './sign-up-validation';
jest.mock('../../presentation/helpers/validators/validation-composite');
const makeEmailValidator = (): IEmailValidator => {
  class EmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }
  return new EmailValidator();
};
describe('SignUpValidation Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeSignUpValidation();
    const validations: IValidation[] = [];
    for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
      validations.push(new RequiredFieldsValidation(field));
    }
    validations.push(new EmailValidation('email', makeEmailValidator()));
    validations.push(new PasswordMatchValidation('password', 'passwordConfirmation'));
    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
