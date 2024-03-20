import { InvalidParamError, MissingParamError, ServerError } from '../../errors';
import { badRequest, serverError } from '../../helpers';
import { type IEmailValidator, type IController } from '../../protocols';
import { LoginController } from './login.controller';
interface ISutType {
  sut: IController;
  emailValidatorStub: IEmailValidator;
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
const makeSut = (): ISutType => {
  const emailValidatorStub = makeEmailValidator();
  const sut = new LoginController(emailValidatorStub);
  return { sut, emailValidatorStub };
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
    const sypIsValid = jest.spyOn(emailValidatorStub, 'isValid');
    const httpRequest = makeRequest();
    await sut.handle(httpRequest);
    expect(sypIsValid).toHaveBeenCalledWith(httpRequest.body.email);
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
});
