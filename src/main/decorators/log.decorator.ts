import {
  type IHttpRequest,
  type IController,
  type IHttpResponse
} from '../../presentation/protocols';

export class LogControllerDecorator implements IController {
  constructor(private readonly controller: IController) {}
  async handle(request: IHttpRequest): Promise<IHttpResponse> {
    await this.controller.handle(request);
    return await Promise.resolve(null);
  }
}
