import {
  type IHttpRequest,
  type IController,
  type IEmailValidator,
  type IHttpResponse,
  type IAddAccount
} from './sign-up-protocols';
import { MissingParamError, InvalidParamError } from '../../errors';
import { badRequest, serverError, ok } from '../../helpers/http-helper';

export class SignUpController implements IController<any> {
  constructor(
    private readonly emailValidator: IEmailValidator,
    private readonly addAccount: IAddAccount
  ) {}

  async handle(httpRequest: IHttpRequest<any>): Promise<IHttpResponse<any>> {
    try {
      const requiredFields = ['name', 'email', 'password', 'password_confirmation'];
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field));
        }
      }
      const { email, password, password_confirmation, name } = httpRequest?.body ?? {};
      if (password !== password_confirmation) {
        return badRequest(new InvalidParamError('password_confirmation'));
      }
      const emailCheck: string = typeof email === 'string' ? email : '';
      const isValid = this.emailValidator.isValid(emailCheck);

      if (!isValid) {
        return badRequest(new InvalidParamError('email'));
      }
      const account = await this.addAccount.add({
        name,
        email,
        password
      });

      return ok(account);
    } catch (error) {
      return serverError();
    }
  }
}
