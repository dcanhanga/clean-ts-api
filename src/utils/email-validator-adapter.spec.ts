import { type IEmailValidator } from '../presentation/protocols';
import { EmailValidatorAdapter } from './email-validator.adapter';
import validator from 'validator';
const makeSut = (): IEmailValidator => {
  const sut = new EmailValidatorAdapter();
  return sut;
};
describe('EmailValidator Adapter', () => {
  jest.mock('validator', () => {
    return true;
  });
  test('Should return false if validator reruns false', () => {
    const sut = makeSut();
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false);
    const isValid = sut.isValid('invalid_email@email.com');
    expect(isValid).toBe(false);
  });
  test('Should return true if validator reruns true', () => {
    const sut = makeSut();
    const isValid = sut.isValid('valid_email@email.com');
    expect(isValid).toBe(true);
  });
  test('Should call validator with correct email', () => {
    const sut = makeSut();
    const isEmail = jest.spyOn(validator, 'isEmail');
    sut.isValid('any_email@email.com');
    expect(isEmail).toHaveBeenCalledWith('any_email@email.com');
  });
});
