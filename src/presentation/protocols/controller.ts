import { type IHttpRequest, type IHttpResponse } from './http';
export interface IController<T> {
  handle: (httpRequest: IHttpRequest<T>) => Promise<IHttpResponse<T>>;
}
