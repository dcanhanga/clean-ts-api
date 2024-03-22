import { type IAuthentication } from '../../../domain/useCases/authentication.useCase';
import { InvalidParamError, MissingParamError, UnauthorizedError } from '../../errors';
import { badRequest, type IValidation, ok, serverError, unauthorized } from '../../helpers';
import { type IHttpRequest, type IHttpResponse, type IController } from '../../protocols';
interface ILoginRequest {
  email: string;
  password: string;
}

// type Field = keyof ILoginRequest;
export class LoginController implements IController {
  constructor(
    private readonly authentication: IAuthentication,
    private readonly validation: IValidation
  ) {}

  async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body);
      if (error) {
        throw error;
      }

      const accessToken = await this.authentication.auth(httpRequest.body as ILoginRequest);
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
}
