import { type IAuthentication } from '../../../domain/useCases/authentication.useCase';
import { InvalidParamError, MissingParamError } from '../../errors';
import { UnauthorizedError } from '../../errors/unauthorized-error';
import { badRequest, ok, serverError, unauthorized } from '../../helpers';
import {
  type IHttpRequest,
  type IHttpResponse,
  type IController,
  type IEmailValidator
} from '../../protocols';
interface ILoginRequest {
  email: string;
  password: string;
}

type Field = keyof ILoginRequest;
export class LoginController implements IController {
  constructor(
    private readonly emailValidator: IEmailValidator,
    private readonly authentication: IAuthentication
  ) {}

  async handle(request: IHttpRequest): Promise<IHttpResponse> {
    try {
      this.validateRequiredFields(request);
      const { email } = request.body;
      if (!this.emailValidator.isValid(email as string)) {
        throw new InvalidParamError('email');
      }
      const accessToken = await this.authentication.auth(request.body as ILoginRequest);
      if (!accessToken) {
        throw new UnauthorizedError();
      }
      return ok({ accessToken });
    } catch (error) {
      if (error instanceof MissingParamError || error instanceof InvalidParamError) {
        return badRequest(error);
      }
      if (error instanceof UnauthorizedError) {
        return unauthorized(error);
      }
      return serverError(error as Error);
    }
  }

  private validateRequiredFields(httpRequest: IHttpRequest): void {
    const requiredFields: Field[] = ['email', 'password'];

    for (const field of requiredFields) {
      if (httpRequest?.body[field] === undefined || httpRequest?.body[field] === null) {
        throw new MissingParamError(field);
      }
    }
  }
}
