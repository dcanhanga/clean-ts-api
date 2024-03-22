import { type IValidation } from '../../protocols/validation';
import { InvalidParamError } from '../../errors';
import { type IEmailValidator } from '../../protocols';
export class EmailValidation implements IValidation {
  constructor(
    private readonly fieldName: string,
    private readonly emailValidator: IEmailValidator
  ) {}

  validate(input: any): Error | null {
    const isValid = this.emailValidator.isValid(input[this.fieldName] as string);
    if (!isValid) {
      return new InvalidParamError(this.fieldName);
    }
    return null;
  }
}
