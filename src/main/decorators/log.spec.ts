import { type ILogErrorRepository } from '../../data/protocols/log-error.repository';
import { type IAccountModel } from '../../domain/model';
import { ok, serverError } from '../../presentation/helpers';
import { type IHttpRequest, type IHttpResponse } from '../../presentation/protocols';
import { type IController } from './../../presentation/protocols/controller';
import { LogControllerDecorator } from './log.decorator';

interface ISutType {
  sut: LogControllerDecorator;
  controllerStub: IController;
  logErrorRepositoryStub: ILogErrorRepository;
}
const makeFakeServerError = (): IHttpResponse => {
  const fakeError = new Error();
  fakeError.stack = 'any_stack';
  return serverError(fakeError);
};
const makeFakeRequest = (): IHttpRequest => ({
  body: {
    name: 'any_name',
    email: 'any_email@email.com',
    password: 'any_password',
    passwordConfirmation: 'any_password'
  }
});
const makeFakeAccount = (): IAccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@email.com',
  password: 'password'
});
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
      return await Promise.resolve(ok(makeFakeAccount()));
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
    const httpRequest = makeFakeRequest();
    await sut.handle(httpRequest);
    expect(handleSpy).toHaveBeenCalledWith(httpRequest);
  });
  test('Should return the same result of controller', async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(ok(makeFakeAccount()));
  });
  test('Should call LogErrorRepository with correct error  if controller returns a server error', async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut();

    const logSpy = jest.spyOn(logErrorRepositoryStub, 'log');
    jest
      .spyOn(controllerStub, 'handle')
      .mockReturnValueOnce(Promise.resolve(makeFakeServerError()));
    await sut.handle(makeFakeRequest());
    expect(logSpy).toHaveBeenCalledWith('any_stack');
  });
});
