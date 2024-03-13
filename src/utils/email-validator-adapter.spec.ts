import { EmailValidatorAdapter } from './email-validator-adapter';
import validator from 'validator';
describe('EmailValidator Adapter', () => {
  test('Should return false if validator reruns false', () => {
    const sut = new EmailValidatorAdapter();
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false);
    const isValid = sut.isValid('invalid_email@email.com');
    expect(isValid).toBe(false);
  });
  test('Should return true if validator reruns true', () => {
    const sut = new EmailValidatorAdapter();
    const isValid = sut.isValid('valid_email@email.com');
    expect(isValid).toBe(true);
  });
});
