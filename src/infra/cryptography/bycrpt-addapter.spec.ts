import bcrypt from 'bcrypt';
import { BcryptAdapter } from './bcrypt.adapter';

describe('Bcrypt Adapter', () => {
  jest.mock('bcrypt', () => ({
    async async(): Promise<string> {
      return await Promise.resolve('$2b$12$ELRiGTH7XAPkVwgR404WIOmI1UTpGpyLAMhXIy6IS.55e7lfAi4ty');
    }
  }));
  test('Should call bcrypt with correct value', async () => {
    const saltOrRounds = 12;
    const sut = new BcryptAdapter(saltOrRounds);
    const hashSpy = jest.spyOn(bcrypt, 'hash');
    await sut.encrypt('any_value');
    expect(hashSpy).toHaveBeenCalledWith('any_value', saltOrRounds);
  });
  test('Should return a hash on success', async () => {
    const saltOrRounds = 12;
    const sut = new BcryptAdapter(saltOrRounds);

    const hash = await sut.encrypt('any_value');
    expect(hash).toBe(hash);
  });
});
