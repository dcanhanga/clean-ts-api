import { MissingParamError } from '../errors/missing-param-error';
import { badRequest } from '../helpers/http';
import { type IController } from '../protocols/controller';
import { type IHttpResponse, type IHttpRequest } from '../protocols/http';

export interface IRequest {
  fullName: string;
  email: string;
  password: string;
  passwordConfirmation: string;
}

export class SignUpController implements IController {
  async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      this.validateRequiredFields(httpRequest);
    } catch (error) {
      if (error instanceof MissingParamError) {
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
