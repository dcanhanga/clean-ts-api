import { MissingParamError } from '../errors/missing-param-erro';
import { badRequest } from '../helpers/http-helper';
import { type IController } from '../protocols/controller';
import { type IHttpResponse, type IHttpRequest } from '../protocols/http';

export class SignUpController implements IController<any> {
  handle(httpRequest: IHttpRequest<any>): IHttpResponse<any> {
    const requiredFields = ['name', 'email', 'password', 'password_confirmation'];
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
