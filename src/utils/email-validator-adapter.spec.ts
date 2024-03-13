import { EmailValidatorAdapter } from './email-validator-adapter';

describe('EmailValidator Adapter', () => {
  test('Should return false if validator reruns false', () => {
    const sut = new EmailValidatorAdapter();
    const isValid = sut.isValid('invalid_email@email.com');
    expect(isValid).toBe(false);
  });
});
