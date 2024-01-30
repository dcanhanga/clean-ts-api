import { type IHttpResponse } from '../protocols/http';

export const badRequest = <T extends Error>(error: T): IHttpResponse<T> => ({
  statusCode: 400,
  body: error
});
