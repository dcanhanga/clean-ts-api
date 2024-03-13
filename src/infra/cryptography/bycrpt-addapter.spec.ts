import bcrypt from 'bcrypt';
import { BcryptAdapter } from './bcrypt-adapter';

describe('Bcrypt Adapter', () => {
  test('Should call bcrypt with correct value', async () => {
    const saltOrRounds = 12;
    const sut = new BcryptAdapter(saltOrRounds);
    const hashSpy = jest.spyOn(bcrypt, 'hash');
    await sut.encrypt('any_value');
    expect(hashSpy).toHaveBeenCalledWith('any_value', saltOrRounds);
  });
});
