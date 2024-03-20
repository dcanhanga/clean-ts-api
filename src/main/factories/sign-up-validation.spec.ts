import { type IValidation } from '../../presentation/helpers';
import { RequiredFieldsValidation } from '../../presentation/helpers/validators/required-fields-validation';
import { ValidationComposite } from '../../presentation/helpers/validators/validation-composite';
import { makeSignUpValidation } from './sign-up-validation';
jest.mock('../../presentation/helpers/validators/validation-composite');
describe('SignUpValidation Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeSignUpValidation();
    const validations: IValidation[] = [];
    for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
      validations.push(new RequiredFieldsValidation(field));
    }
    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
