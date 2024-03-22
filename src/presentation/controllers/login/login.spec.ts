import {
  type IAuthentication,
  type ICredentialUser
} from '../../../domain/useCases/authentication.useCase';
import { MissingParamError, ServerError } from '../../errors';
import { UnauthorizedError } from '../../errors/unauthorized-error';
import { badRequest, type IValidation, ok, serverError, unauthorized } from '../../helpers';
import { type IController } from '../../protocols';
import { LoginController } from './login.controller';
interface ISutType {
  sut: IController;

  authenticationStub: IAuthentication;
  validationStub: IValidation;
}
interface IMakeRequest {
  body: {
    email: string;
    password: string;
  };
}

const makeValidation = (): IValidation => {
  class ValidationStub implements IValidation {
    validate(input: any): Error | null {
      return null;
    }
  }
  return new ValidationStub();
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

  const validationStub = makeValidation();
  const sut = new LoginController(authenticationStub, validationStub);
  return { sut, authenticationStub, validationStub };
};
const makeRequest = (): IMakeRequest => ({
  body: {
    email: 'any_email@email.com',
    password: 'any_password'
  }
});
describe('Login Controller', () => {
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
  test('Should return 200 if valid credentials are provided', async () => {
    const { sut } = makeSut();
    const httpRequest = makeRequest();

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(ok({ accessToken: 'any_token' }));
  });
  test('Should call Validation with correct value', async () => {
    const { sut, validationStub } = makeSut();
    const validateSpy = jest.spyOn(validationStub, 'validate');
    const httpRequest = makeRequest();
    await sut.handle(httpRequest);
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body);
  });
  test('Should return 400 if validation returns an error', async () => {
    const { sut, validationStub } = makeSut();
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('any_filed'));

    const httpResponse = await sut.handle(makeRequest());
    expect(httpResponse).toEqual(badRequest(new MissingParamError('any_filed')));
  });
});
