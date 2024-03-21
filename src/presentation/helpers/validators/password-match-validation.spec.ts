import { InvalidParamError } from '../../errors';
import { PasswordMatchValidation } from './password-match-validation';

const makeSut = (): PasswordMatchValidation => {
  return new PasswordMatchValidation('password', 'passwordConfirmation');
};
describe('PasswordMatchValidation Validation', () => {
  test('Should return a InvalidParamError if validation fails', () => {
    const sut = makeSut();
    const error = sut.validate({ password: 'any_value', passwordConfirmation: 'any_value2' });
    expect(error).toEqual(new InvalidParamError('Password and password confirmation do not match'));
  });
  test('Should not return if validation succeeds', () => {
    const sut = makeSut();
    const error = sut.validate({ password: 'any_value', passwordConfirmation: 'any_value' });
    expect(error).toBeFalsy();
  });
});
