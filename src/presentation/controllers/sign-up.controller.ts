import { InvalidParamError } from '../errors/invalid-param-error';
import { MissingParamError } from '../errors/missing-param-error';
import { badRequest } from '../helpers/http';
import { type IController } from '../protocols/controller';
import { type IEmailValidator } from '../protocols/email-validator';
import { type IHttpResponse, type IHttpRequest } from '../protocols/http';

export interface IRequest {
  fullName: string;
  email: string;
  password: string;
  passwordConfirmation: string;
}

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
    } catch (error) {
      if (error instanceof MissingParamError || error instanceof InvalidParamError) {
        return badRequest(error);
      }
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
export type Field = 'name' | 'email' | 'password' | 'passwordConfirmation';
