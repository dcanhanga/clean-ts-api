import {
  type IAddAccountModel,
  type IAccountModel,
  type IAddAccount,
  type IEmailValidator
} from './sign-up-protocols';
import { SignUpController } from './signup.controller';
import { InvalidParamError, MissingParamError, ServerError } from '../../errors';

const makeAddAccount = (): IAddAccount => {
  class AddAccountStub implements IAddAccount {
    add(account: IAddAccountModel): IAccountModel {
      const fakeAccount = {
        id: 'valid_id',
        name: 'valid_name',
        email: 'valid_email@mail.com'
      };
      return fakeAccount;
    }
  }
  return new AddAccountStub();
};

const makeEmailValidator = (): IEmailValidator => {
  class EmailValidatorStub implements IEmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }
  return new EmailValidatorStub();
};

interface ISutType {
  sut: SignUpController;
  emailValidatorStub: IEmailValidator;
  addAccountStub: IAddAccount;
}
const makeSut = (): ISutType => {
  const emailValidatorStub = makeEmailValidator();
  const addAccountStub = makeAddAccount();
  const sut = new SignUpController(emailValidatorStub, addAccountStub);
  return { sut, emailValidatorStub, addAccountStub };
};

describe('SignUp Controller', () => {
  test('Should return 400 if no name is provided', () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        email: 'any_email@email',
        password: 'any_password',
        password_confirmation: 'any_password'
      }
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse?.statusCode).toBe(400);
    expect(httpResponse?.body).toEqual(new MissingParamError('name'));
  });

  test('Should return 400 if no email is provided', () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: 'any_name',
        password: 'any_password',
        password_confirmation: 'any_password'
      }
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse?.statusCode).toBe(400);
    expect(httpResponse?.body).toEqual(new MissingParamError('email'));
  });
  test('Should return 400 if no password is provided', () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@email',
        password_confirmation: 'any_password'
      }
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse?.statusCode).toBe(400);
    expect(httpResponse?.body).toEqual(new MissingParamError('password'));
  });
  test('Should return 400 if no password confirmation is provided', () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@email',
        password: 'any_password'
      }
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse?.statusCode).toBe(400);
    expect(httpResponse?.body).toEqual(new MissingParamError('password_confirmation'));
  });

  test('Should return 400 if password confirmation fails', () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@email',
        password: 'any_password',
        password_confirmation: 'invalid_password'
      }
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse?.statusCode).toBe(400);
    expect(httpResponse?.body).toEqual(new InvalidParamError('password_confirmation'));
  });
  test('Should return 400 if an invalid email  is provided', () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false);
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'invalid_email',
        password: 'any_password',
        password_confirmation: 'any_password'
      }
    };

    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse?.statusCode).toBe(400);
    expect(httpResponse?.body).toEqual(new InvalidParamError('email'));
  });

  test('Should call EmailValidator with correct email', () => {
    const { sut, emailValidatorStub } = makeSut();
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid');
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        password_confirmation: 'any_password'
      }
    };
    sut.handle(httpRequest);
    expect(isValidSpy).toHaveBeenCalledWith('any_email@mail.com');
  });

  test('Should return 500 if EmailValidator throws', () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error();
    });
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@email.com',
        password: 'any_password',
        password_confirmation: 'any_password'
      }
    };

    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
  });
  test('Should return 500 if AddAccount throws', () => {
    const { sut, addAccountStub } = makeSut();
    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(() => {
      throw new Error();
    });
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@email.com',
        password: 'any_password',
        password_confirmation: 'any_password'
      }
    };

    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
  });
  test('Should call AddAccount with correct values', () => {
    const { sut, addAccountStub } = makeSut();
    const addSpy = jest.spyOn(addAccountStub, 'add').mockImplementationOnce(() => {
      throw new Error();
    });
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@email.com',
        password: 'any_password',
        password_confirmation: 'any_password'
      }
    };

    sut.handle(httpRequest);
    expect(addSpy).toHaveBeenLastCalledWith({
      name: 'any_name',
      email: 'any_email@email.com',
      password: 'any_password'
    });
  });
  test('Should return 200 if valid data is provided', () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: 'valid_name',
        email: 'valid_email@mail.com',
        password: 'valid_password',
        password_confirmation: 'valid_password'
      }
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(200);
    expect(httpResponse.body).toEqual({
      id: 'valid_id',
      name: 'valid_name',
      email: 'valid_email@mail.com'
    });
  });
});
