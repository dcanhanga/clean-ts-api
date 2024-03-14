import { type IEncryptor } from '../../data/protocols';
import bcrypt from 'bcrypt';
export class BcryptAdapter implements IEncryptor {
  constructor(private readonly saltOrRounds: string | number) {}
  async encrypt(value: string): Promise<string> {
    const valueEncrypted = await bcrypt.hash(value, this.saltOrRounds);
    return valueEncrypted;
  }
}
