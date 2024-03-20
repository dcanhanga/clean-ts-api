import { type IAccountModel } from '../../domain/model';
import { type IAddAccountModel, type IAddAccount } from '../../domain/useCases';
import { InvalidParamError, MissingParamError, ServerError } from '../errors';
import { type IHttpRequest, type IEmailValidator } from '../protocols';
import { SignUpController } from './sign-up.controller';
import { ok, badRequest, serverError } from '../helpers/';
interface ISutType {
  sut: SignUpController;
  emailValidatorStub: IEmailValidator;
  addAccountStub: IAddAccount;
}
const makeFakeAccount = (): IAccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@email.com',
  password: 'password'
});
const makeAddAccount = (): IAddAccount => {
  class AddAccountStub implements IAddAccount {
    async add(account: IAddAccountModel): Promise<IAccountModel> {
      const fakeAccount = makeFakeAccount();
      return await Promise.resolve(fakeAccount);
    }
  }
  return new AddAccountStub();
};
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
  const addAccountStub = makeAddAccount();
  const sut = new SignUpController(emailValidatorStub, addAccountStub);
  return { sut, emailValidatorStub, addAccountStub };
};
const makeFakeRequest = (): IHttpRequest => ({
  body: {
    name: 'any_name',
    email: 'any_email@email.com',
    password: 'any_password',
    passwordConfirmation: 'any_password'
  }
});

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
      expect(httpResponse).toEqual(badRequest(new MissingParamError('name')));
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
      expect(httpResponse).toEqual(badRequest(new MissingParamError('email')));
    });
    test('Should return 400 if no password is provided', async () => {
      const { sut } = makeSut();
      const httpRequest = {
        body: {
          name: 'any_name',
          email: 'any_email@email.com',
          passwordConfirmation: 'any_password'
        }
      };
      const httpResponse = await sut.handle(httpRequest);
      expect(httpResponse).toEqual(badRequest(new MissingParamError('password')));
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
      expect(httpResponse).toEqual(badRequest(new MissingParamError('passwordConfirmation')));
    });
  });
  describe('Invalid Param', () => {
    test('Should return 400 if an invalid email is provided', async () => {
      const { sut, emailValidatorStub } = makeSut();
      const httpRequest = makeFakeRequest();
      jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false);
      const httpResponse = await sut.handle(httpRequest);
      expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')));
    });
    test('Should have call emailValidator with correct email', async () => {
      const { sut, emailValidatorStub } = makeSut();
      const httpRequest = makeFakeRequest();
      const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid');
      await sut.handle(httpRequest);
      expect(isValidSpy).toHaveBeenCalledWith(httpRequest.body.email);
    });
    test('Should return 400 if password and passwordConfirmation not match', async () => {
      const { sut } = makeSut();
      const httpRequest = {
        body: {
          name: 'any_name',
          email: 'any_email@email.com',
          password: 'any_password',
          passwordConfirmation: 'any_password2'
        }
      };
      const httpResponse = await sut.handle(httpRequest);
      expect(httpResponse).toEqual(
        badRequest(new InvalidParamError('Password and password confirmation do not match'))
      );
    });
  });
  describe('Server Error', () => {
    test('Should return 500 if email validator Throws', async () => {
      const { sut, emailValidatorStub } = makeSut();
      const httpRequest = makeFakeRequest();
      jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
        throw new Error();
      });
      const httpResponse = await sut.handle(httpRequest);
      expect(httpResponse).toEqual(serverError(new ServerError()));
    });
    test('Should return 500 if AddAccount Throws', async () => {
      const { sut, addAccountStub } = makeSut();
      const httpRequest = makeFakeRequest();
      jest
        .spyOn(addAccountStub, 'add')
        .mockImplementationOnce(async () => await Promise.reject(new Error()));
      const httpResponse = await sut.handle(httpRequest);
      expect(httpResponse).toEqual(serverError(new ServerError()));
    });
  });

  test('Should call AddAccount with correct values', async () => {
    const { sut, addAccountStub } = makeSut();
    const httpRequest = makeFakeRequest();
    const addSpy = jest.spyOn(addAccountStub, 'add');
    await sut.handle(httpRequest);
    expect(addSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email@email.com',
      password: 'any_password'
    });
  });
  test('Should return 200 if valid data is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = makeFakeRequest();
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(ok(makeFakeAccount()));
  });
});
