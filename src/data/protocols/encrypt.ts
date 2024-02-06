export interface IEncryptor {
  encrypt: (value: string) => Promise<string>;
}
