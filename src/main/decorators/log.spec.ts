import { type IHttpRequest, type IHttpResponse } from '../../presentation/protocols';
import { type IController } from './../../presentation/protocols/controller';
import { LogControllerDecorator } from './log.decorator';

interface ISutType {
  sut: LogControllerDecorator;
  controllerStub: IController;
}
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
  const sut = new LogControllerDecorator(controllerStub);
  return { sut, controllerStub };
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
});