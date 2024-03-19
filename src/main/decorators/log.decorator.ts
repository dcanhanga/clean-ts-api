import { type ILogErrorRepository } from '../../data/protocols/log-error.repository';
import {
  type IHttpRequest,
  type IController,
  type IHttpResponse
} from '../../presentation/protocols';

export class LogControllerDecorator implements IController {
  constructor(
    private readonly controller: IController,
    private readonly logErrorRepository: ILogErrorRepository
  ) {}

  async handle(request: IHttpRequest): Promise<IHttpResponse> {
    const httpResponse = await this.controller.handle(request);
    if (httpResponse.statusCode === 500) {
      await this.logErrorRepository.logError(httpResponse.body.stack as string);
    }
    return httpResponse;
  }
}
