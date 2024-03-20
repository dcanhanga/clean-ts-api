import { MissingParamError } from '../../errors';
import { type IValidation } from './validation';

export class RequiredFieldsValidation implements IValidation {
  constructor(private readonly fieldName: string) {}
  validate(input: any): Error | null {
    if (!input[this.fieldName]) {
      return new MissingParamError(this.fieldName);
    }
    return null;
  }
}
