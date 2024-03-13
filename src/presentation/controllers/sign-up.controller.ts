import { type IAddAccount } from '../../domain/useCases';
import { InvalidParamError, MissingParamError, ServerError } from '../errors';
import { badRequest, ok, serverError } from '../helpers';
import {
  type IController,
  type IEmailValidator,
  type IHttpResponse,
  type IHttpRequest
} from '../protocols';

interface ISignUpRequest {
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
}

type Field = keyof ISignUpRequest;

export class SignUpController implements IController {
  constructor(
    private readonly emailValidator: IEmailValidator,
    private readonly addAccount: IAddAccount
  ) {}

  async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const { name, email, password, passwordConfirmation } = httpRequest.body;

      this.validateRequiredFields(httpRequest);

      if (!this.emailValidator.isValid(email as string)) {
        throw new InvalidParamError('email');
      }

      if (password !== passwordConfirmation) {
        throw new InvalidParamError('Password and password confirmation do not match');
      }
      const account = await this.addAccount.add({
        password,
        email,
        name
      });
      return ok(account);
    } catch (error) {
      if (error instanceof MissingParamError || error instanceof InvalidParamError) {
        return badRequest(error);
      }
      return serverError(new ServerError());
    }
  }

  private validateRequiredFields(httpRequest: IHttpRequest): void {
    const requiredFields: Field[] = ['name', 'email', 'password', 'passwordConfirmation'];

    for (const field of requiredFields) {
      if (httpRequest?.body[field] === undefined || httpRequest?.body[field] === null) {
        throw new MissingParamError(field);
      }
    }
  }
}
