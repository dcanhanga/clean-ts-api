import validator from 'validator';

import { EmailValidatorAdapter } from './email-validator-adapter';
jest.mock('validator', () => ({
  isEmail(): boolean {
    return true;
  }
}));
const makeSut = (): EmailValidatorAdapter => {
  return new EmailValidatorAdapter();
};
describe('EmailValidatorAdapter', () => {
  test('Should return false it validator returns false', () => {
    const sut = makeSut();
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false);
    const isValid = sut.isValid('invalid_email@email.com');
    expect(isValid).toBe(false);
  });

  test('Should return true it validator returns true', () => {
    const sut = makeSut();
    const isValid = sut.isValid('valid_email@email.com');
    expect(isValid).toBe(true);
  });
});
