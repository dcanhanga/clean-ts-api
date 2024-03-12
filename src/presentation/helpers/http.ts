import { type IHttpResponse } from '../protocols/http';

export const badRequest = (error: Error): IHttpResponse => ({
  body: error,
  statusCode: 400
});

export const serverError = (error: Error): IHttpResponse => ({
  body: error,
  statusCode: 500
});
