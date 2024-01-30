import { MissingParamError } from '../errors/missing-param-erro';
import { type IHttpResponse, type IHttpRequest } from '../protocols/http';

export class SignUpController {
  handle(httpRequest: IHttpRequest<any>): IHttpResponse<any> | undefined {
    if (!httpRequest.body.name) {
      return {
        statusCode: 400,
        body: new MissingParamError('name')
      };
    }
    if (!httpRequest.body.email) {
      return {
        statusCode: 400,
        body: new MissingParamError('email')
      };
    }
  }
}
