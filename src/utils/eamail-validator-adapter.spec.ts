import { EmailValidatorAdapter } from './email-validator';

describe('EmailValidatorAdapter', () => {
  test('Should return false it validator returns false', () => {
    const sut = new EmailValidatorAdapter();
    const isValid = sut.isValid('invalid_email@email.com');
    expect(isValid).toBe(false);
  });
});