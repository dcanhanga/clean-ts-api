import { MissingParamError } from '../../errors';
import { badRequest } from '../../helpers';
import { type IHttpRequest, type IHttpResponse, type IController } from '../../protocols';
export class LoginController implements IController {
  async handle(request: IHttpRequest): Promise<IHttpResponse> {
    return await Promise.resolve(badRequest(new MissingParamError('email')));
  }
}
