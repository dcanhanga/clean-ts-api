import { SignUpController } from './sign-up.controller';
import { MissingParamError } from '../errors/missing-param-error';
interface ISutType {
  sut: SignUpController;
}
const makeSut = (): ISutType => {
  const sut = new SignUpController();
  return { sut };
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
});
