export interface ICrypto {
  encrypt: (value: string) => Promise<string>;
}
