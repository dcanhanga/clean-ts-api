import { ServerError } from '../../errors';
import { type IHttpResponse } from '../../protocols/http';

export const badRequest = (error: Error): IHttpResponse => ({
  body: error,
  statusCode: 400
});
export const unauthorized = (error: Error): IHttpResponse => ({
  body: error,
  statusCode: 401
});

export const serverError = (error: Error): IHttpResponse => ({
  body: new ServerError(error.stack),
  statusCode: 500
});

export const ok = (data: any): IHttpResponse => ({ body: data, statusCode: 200 });
