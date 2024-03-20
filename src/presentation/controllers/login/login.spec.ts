import {
  type IAuthentication,
  type ICredentialUser
} from '../../../domain/useCases/authentication.useCase';
import { InvalidParamError, MissingParamError, ServerError } from '../../errors';
import { UnauthorizedError } from '../../errors/unauthorized-error';
import { badRequest, serverError, unauthorized } from '../../helpers';
import { type IEmailValidator, type IController } from '../../protocols';
import { LoginController } from './login.controller';
interface ISutType {
  sut: IController;
  emailValidatorStub: IEmailValidator;
  authenticationStub: IAuthentication;
}
interface IMakeRequest {
  body: {
    email: string;
    password: string;
  };
}
const makeEmailValidator = (): IEmailValidator => {
  class EmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }
  return new EmailValidator();
};
const makeAuthentication = (): IAuthentication => {
  class AuthenticationStub {
    async auth(data: ICredentialUser): Promise<string> {
      return 'any_token';
    }
  }
  return new AuthenticationStub();
};
const makeSut = (): ISutType => {
  const authenticationStub = makeAuthentication();
  const emailValidatorStub = makeEmailValidator();
  const sut = new LoginController(emailValidatorStub, authenticationStub);
  return { sut, emailValidatorStub, authenticationStub };
};
const makeRequest = (): IMakeRequest => ({
  body: {
    email: 'any_email@email.com',
    password: 'any_password'
  }
});
describe('Login Controller', () => {
  test('Should return 400 if no email is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        password: 'any_password'
      }
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')));
  });
  test('Should return 400 if no password is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        email: 'any_email@email.com'
      }
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')));
  });
  test('Should call EmailValidator with correct email', async () => {
    const { sut, emailValidatorStub } = makeSut();
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid');
    const httpRequest = makeRequest();
    await sut.handle(httpRequest);
    expect(isValidSpy).toHaveBeenCalledWith(httpRequest.body.email);
  });
  test('Should return 400 if email provided is invalid', async () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false);
    const httpRequest = makeRequest();
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')));
  });
  test('Should return 500 if email validator Throws', async () => {
    const { sut, emailValidatorStub } = makeSut();
    const httpRequest = makeRequest();
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error();
    });
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(serverError(new ServerError()));
  });
  test('Should call Authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut();
    const authSpy = jest.spyOn(authenticationStub, 'auth');
    const httpRequest = makeRequest();
    await sut.handle(httpRequest);
    expect(authSpy).toHaveBeenCalledWith(httpRequest.body);
  });
  test('Should return 401 if invalid credentials ate provided', async () => {
    const { sut, authenticationStub } = makeSut();
    jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(Promise.resolve(null));
    const httpRequest = makeRequest();
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(unauthorized(new UnauthorizedError()));
  });
  test('Should return 500 if AuthenticationT Throws', async () => {
    const { sut, authenticationStub } = makeSut();
    const httpRequest = makeRequest();
    jest
      .spyOn(authenticationStub, 'auth')
      .mockImplementationOnce(async () => await Promise.reject(new Error()));
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(serverError(new ServerError()));
  });
});
