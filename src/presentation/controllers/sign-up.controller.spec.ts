import { SignUpController } from './sign-up.controller';
import { MissingParamError } from '../errors/missing-param-error';
import { InvalidParamError } from '../errors/invalid-param-error';
import { type IEmailValidator } from '../protocols/email-validator';
interface ISutType {
  sut: SignUpController;
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
  const sut = new SignUpController(emailValidatorStub);
  return { sut, emailValidatorStub };
};

describe('SignUp Controller', () => {
  describe('Missing Param', () => {
    test('Should return 400 if no name is provided', async () => {
      const { sut } = makeSut();
      const httpRequest = {
        body: {
          email: 'any_email@email.com',
          password: 'any_password',
          passwordConfirmation: 'any_password'
        }
      };
      const httpResponse = await sut.handle(httpRequest);
      expect(httpResponse.statusCode).toBe(400);
      expect(httpResponse.body).toEqual(new MissingParamError('name'));
    });
    test('Should return 400 if no email is provided', async () => {
      const { sut } = makeSut();
      const httpRequest = {
        body: {
          name: 'any_name',
          password: 'any_password',
          passwordConfirmation: 'any_password'
        }
      };
      const httpResponse = await sut.handle(httpRequest);
      expect(httpResponse.statusCode).toBe(400);
      expect(httpResponse.body).toEqual(new MissingParamError('email'));
    });
    test('Should return 400 if no password is provided', async () => {
      const sut = new SignUpController();
      const httpRequest = {
        body: {
          name: 'any_name',
          email: 'any_email@email.com',
          passwordConfirmation: 'any_password'
        }
      };
      const httpResponse = await sut.handle(httpRequest);
      expect(httpResponse.statusCode).toBe(400);
      expect(httpResponse.body).toEqual(new MissingParamError('password'));
    });
    test('Should return 400 if no passwordConfirmation is provided', async () => {
      const { sut } = makeSut();
      const httpRequest = {
        body: {
          name: 'any_name',
          email: 'any_email@email.com',
          password: 'any_password'
        }
      };
      const httpResponse = await sut.handle(httpRequest);
      expect(httpResponse.statusCode).toBe(400);
      expect(httpResponse.body).toEqual(new MissingParamError('passwordConfirmation'));
    });
  });
  describe('Invalid Param', () => {
    test('Should return 400 if an invalid email is provided', async () => {
      const { sut, emailValidatorStub } = makeSut();
      const httpRequest = {
        body: {
          name: 'any_name',
          email: 'invalid_email@email.com',
          password: 'any_password',
          passwordConfirmation: 'any_password'
        }
      };
      jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false);
      const httpResponse = await sut.handle(httpRequest);
      expect(httpResponse.statusCode).toBe(400);
      expect(httpResponse.body).toEqual(new InvalidParamError('email'));
    });
    test('Should should have call emailValidator with correct email', async () => {
      const { sut, emailValidatorStub } = makeSut();
      const httpRequest = {
        body: {
          name: 'any_name',
          email: 'valid_email@email.com',
          password: 'any_password',
          passwordConfirmation: 'any_password'
        }
      };
      const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid');
      await sut.handle(httpRequest);
      expect(isValidSpy).toHaveBeenCalledWith(httpRequest.body.email);
    });
  });
});
