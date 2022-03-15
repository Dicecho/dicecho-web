import { AxiosResponse, AxiosRequestConfig } from 'axios';

export interface RequestConfig extends AxiosRequestConfig {
  /**
   * withToken 为 true 时尝试往 Header 中加入 access token
   */
  withToken?: boolean;
}

// export type Response<D = any> = D;
export type Response<D = any> = {
  success: boolean;
  code: number;
  data: D;
  detail?: string;
  fields?: any[];
  [filed: string]: any;
};

export type Error = {
  success: string;
  code: number;
  data?: any;
  detail: string;
  fields: any[];
};

export type ResponseError = {
  config: AxiosRequestConfig;
  code?: string;
  request?: any;
  response?: AxiosResponse<Error>;
};
