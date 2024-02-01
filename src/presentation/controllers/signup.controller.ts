import { InvalidParamError } from '../errors/invalid-param-erro';
import { MissingParamError } from '../errors/missing-param-erro';
import { ServerError } from '../errors/server-error';
import { badRequest } from '../helpers/http-helper';
import { type IController } from '../protocols/controller';
import { type IEmailValidator } from '../protocols/email-validator';
import { type IHttpResponse, type IHttpRequest } from '../protocols/http';

export class SignUpController implements IController<any> {
  constructor(private readonly emailValidator: IEmailValidator) {}

  handle(httpRequest: IHttpRequest<any>): IHttpResponse<any> {
    try {
      const requiredFields = ['name', 'email', 'password', 'password_confirmation'];
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field));
        }
      }
      const email: string =
        typeof httpRequest?.body.email === 'string' ? httpRequest.body.email : '';
      const isValid = this.emailValidator.isValid(email);

      if (!isValid) {
        return badRequest(new InvalidParamError('email'));
      }
      return {
        statusCode: 200,
        body: { message: 'User created successfully' }
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: new ServerError()
      };
    }
  }
}