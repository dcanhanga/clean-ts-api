import { ServerError } from '../errors/server-error';
import { type IHttpResponse } from '../protocols/http';

export const badRequest = <T extends Error>(error: T): IHttpResponse<T> => ({
  statusCode: 400,
  body: error
});

export const serverError = (): IHttpResponse<ServerError> => ({
  statusCode: 500,
  body: new ServerError()
});

export const ok = <T>(data: T): IHttpResponse<T> => ({
  statusCode: 200,
  body: data
});
