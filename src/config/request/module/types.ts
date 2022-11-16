import { CancelToken } from "axios";
export type Method = "GET" | "POST" | "PUT" | "DELETE";
export type ResponseType =
  | "arraybuffer"
  | "blob"
  | "document"
  | "json"
  | "text"
  | "stream";

export interface AxiosRequest {
  baseURL?: string;
  url?: string;
  data?: any;
  params?: any;
  method?: Method;
  headers?: any;
  timeout?: number;
  responseType?: ResponseType;
  cancelToken?: CancelToken;
  unTip?: boolean; //是否打印返回的提示
}

export interface AxiosResponse {
  data: any;
  headers: any;
  request?: any;
  status: number;
  statusText: string;
  config: AxiosRequest;
}

export interface CustomResponse {
  readonly status: boolean;
  readonly message: string;
  data?: any;
  origin?: any;
  ResultData?: any;
  hasMore?: number;
}
