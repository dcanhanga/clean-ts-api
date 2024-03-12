import { InvalidParamError, MissingParamError, ServerError } from '../errors';
import { badRequest, serverError } from '../helpers';
import {
  type IController,
  type IEmailValidator,
  type IHttpRequest,
  type IHttpResponse
} from '../protocols';

export interface IRequest {
  fullName: string;
  email: string;
  password: string;
  passwordConfirmation: string;
}
type Field = 'name' | 'email' | 'password' | 'passwordConfirmation';
export class SignUpController implements IController {
  constructor(private readonly emailValidator: IEmailValidator) {}
  async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      this.validateRequiredFields(httpRequest);
      const email = httpRequest.body.email as string;
      const isValidEmail = this.emailValidator.isValid(email);
      if (!isValidEmail) {
        throw new InvalidParamError('email');
      }
      const passwordMatch = httpRequest.body.password === httpRequest.body.passwordConfirmation;
      if (!passwordMatch) {
        throw new InvalidParamError('Password not match');
      }
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
