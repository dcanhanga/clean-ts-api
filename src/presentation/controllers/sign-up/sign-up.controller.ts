import { type IAddAccount } from '../../../domain/useCases';
import { InvalidParamError } from '../../errors';
import { badRequest, type IValidation, ok, serverError } from '../../helpers';
import { type IController, type IHttpResponse, type IHttpRequest } from '../../protocols';

// interface ISignUpRequest {
//   name: string;
//   email: string;
//   password: string;
//   passwordConfirmation: string;
// }

// type Field = keyof ISignUpRequest;

export class SignUpController implements IController {
  constructor(
    private readonly addAccount: IAddAccount,
    private readonly validation: IValidation
  ) {}

  async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body);
      if (error) {
        return badRequest(error);
      }
      const { name, email, password } = httpRequest.body;

      const account = await this.addAccount.add({
        password,
        email,
        name
      });
      return ok(account);
    } catch (error) {
      if (error instanceof InvalidParamError) {
        return badRequest(error);
      }
      return serverError(error as Error);
    }
  }
}
