import { InvalidParamError } from '../../errors';
import { type IValidation } from './validation';

export class PasswordMatchValidation implements IValidation {
  constructor(
    private readonly password: string,
    private readonly passwordConfirmation: string
  ) {}

  validate(input: any): Error | null {
    const fieldsMatch = input[this.password] === input[this.passwordConfirmation];
    if (!fieldsMatch) {
      return new InvalidParamError('Password and password confirmation do not match');
    }
    return null;
  }
}
