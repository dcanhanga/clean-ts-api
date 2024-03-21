import { MissingParamError } from '../../errors';
import { RequiredFieldsValidation } from './required-fields-validation';

describe('RequiredField Validation', () => {
  test('Should return a MissingParamError if validation fails', () => {
    const sut = new RequiredFieldsValidation('field');
    const error = sut.validate({ name: 'any_name' });
    expect(error).toEqual(new MissingParamError('field'));
  });
  test('Should not return if validation succeeds', () => {
    const sut = new RequiredFieldsValidation('field');
    const error = sut.validate({ field: 'any_value' });
    expect(error).toBeFalsy();
  });
});
