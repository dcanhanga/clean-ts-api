import { type IHttpRequest, type IHttpResponse } from './http';
export interface IController {
  handle: (request: IHttpRequest) => Promise<IHttpResponse>;
}
