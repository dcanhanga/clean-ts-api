import { MissingParamError } from '../errors/missing-param-erro';
import { badRequest } from '../helpers/http-helper';
import { type IHttpResponse, type IHttpRequest } from '../protocols/http';

export class SignUpController {
  handle(httpRequest: IHttpRequest<any>): IHttpResponse<any> {
    const requiredFields = ['name', 'email'];
    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field));
      }
    }
    return {
      statusCode: 200,
      body: { message: 'User created successfully' }
    };
  }
}
