export interface IHttpRequest<T> {
  body: T;
}
export interface IHttpResponse<T> {
  statusCode: number;
  body: T;
}
