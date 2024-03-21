import { InvalidParamError } from '../../errors';
import { type IEmailValidator } from '../../protocols';
import { EmailValidation } from './email-validation';

interface ISutType {
  sut: EmailValidation;
  emailValidatorStub: IEmailValidator;
}

const makeEmailValidator = (): IEmailValidator => {
  class EmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }
  return new EmailValidator();
};

const makeSut = (): ISutType => {
  const emailValidatorStub = makeEmailValidator();
  const sut = new EmailValidation('email', emailValidatorStub);
  return { sut, emailValidatorStub };
};

describe('SignUp Controller', () => {
  test('Should return an error if EmailValidator returns false', () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false);
    const error = sut.validate({ email: 'invalid' });
    expect(error).toEqual(new InvalidParamError('email'));
  });
  test('Should call EmailValidator with correct email', () => {
    const { emailValidatorStub, sut } = makeSut();
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid');
    sut.validate({ email: 'any_email@eamil.com' });
    expect(isValidSpy).toHaveBeenCalledWith('any_email@eamil.com');
  });
  test('Should return 500 if EmailValidator throws', () => {
    const { emailValidatorStub, sut } = makeSut();
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error();
    });

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(sut.validate).toThrow();
  });
});
