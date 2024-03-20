export interface ICredentialUser {
  email: string;
  password: string;
}
export interface IAuthentication {
  auth: (data: ICredentialUser) => Promise<string | null>;
}
