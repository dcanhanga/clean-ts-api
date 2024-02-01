import { MissingParamError, InvalidParamError } from '../errors';
import { badRequest, serverError } from '../helpers/http-helper';
import {
  type IController,
  type IEmailValidator,
  type IHttpResponse,
  type IHttpRequest
} from '../protocols';

export class SignUpController implements IController<any> {
  constructor(private readonly emailValidator: IEmailValidator) {}

  handle(httpRequest: IHttpRequest<any>): IHttpResponse<any> {
    const { email, password, password_confirmation } = httpRequest?.body ?? {};

    try {
      const requiredFields = ['name', 'email', 'password', 'password_confirmation'];
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field));
        }
      }
      if (password !== password_confirmation) {
        return badRequest(new InvalidParamError('password_confirmation'));
      }
      const emailCheck: string = typeof email === 'string' ? email : '';
      const isValid = this.emailValidator.isValid(emailCheck);

      if (!isValid) {
        return badRequest(new InvalidParamError('email'));
      }
      return {
        statusCode: 200,
        body: { message: 'User created successfully' }
      };
    } catch (error) {
      return serverError();
    }
  }
}
