import { type ILogErrorRepository } from '../../data/protocols/log-error.repository';
import { serverError } from '../../presentation/helpers';
import { type IHttpRequest, type IHttpResponse } from '../../presentation/protocols';
import { type IController } from './../../presentation/protocols/controller';
import { LogControllerDecorator } from './log.decorator';

interface ISutType {
  sut: LogControllerDecorator;
  controllerStub: IController;
  logErrorRepositoryStub: ILogErrorRepository;
}
const makeLogErrorRepository = (): ILogErrorRepository => {
  class LogErrorRepositoryStub implements ILogErrorRepository {
    async log(stack: string): Promise<void> {
      await Promise.resolve();
    }
  }
  return new LogErrorRepositoryStub();
};
const makeControllerStub = (): IController => {
  class ControllerStub implements IController {
    async handle(request: IHttpRequest): Promise<IHttpResponse> {
      return await Promise.resolve({
        statusCode: 200,
        body: {
          id: 'valid_id',
          name: 'valid_name',
          email: 'valid_email@email.com',
          password: 'password'
        }
      });
    }
  }
  return new ControllerStub();
};
const makeSut = (): ISutType => {
  const controllerStub = makeControllerStub();
  const logErrorRepositoryStub = makeLogErrorRepository();
  const sut = new LogControllerDecorator(controllerStub, logErrorRepositoryStub);

  return { sut, controllerStub, logErrorRepositoryStub };
};
describe('LogController Decorator', () => {
  test('Should call controller handle', async () => {
    const { sut, controllerStub } = makeSut();
    const handleSpy = jest.spyOn(controllerStub, 'handle');
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@email.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    };
    await sut.handle(httpRequest);
    expect(handleSpy).toHaveBeenCalledWith(httpRequest);
  });
  test('Should return the same result of controller ', async () => {
    const { sut } = makeSut();

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@email.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual({
      statusCode: 200,
      body: {
        id: 'valid_id',
        name: 'valid_name',
        email: 'valid_email@email.com',
        password: 'password'
      }
    });
  });
  test('Should call LogErrorRepository with correct error  if controller returns a server error', async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut();
    const fakeError = new Error();
    fakeError.stack = 'any_stack';
    const error = serverError(fakeError);
    const logSpy = jest.spyOn(logErrorRepositoryStub, 'log');
    jest.spyOn(controllerStub, 'handle').mockReturnValueOnce(Promise.resolve(error));

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@email.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    };
    await sut.handle(httpRequest);
    expect(logSpy).toHaveBeenCalledWith('any_stack');
  });
});
