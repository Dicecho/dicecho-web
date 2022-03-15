import axios, { AxiosRequestConfig, AxiosResponse, AxiosError, AxiosInstance, AxiosPromise } from "axios";
import { Response, RequestConfig, ResponseError } from "@/interfaces/response";
import { message } from "antd";
import { keysToCamel } from "@/utils/helper";
import { STORAGE_KEYS } from 'shared/constants/storage';
import { sleepAsync, parseJwt } from './utils';
import { IRefreshApiResponse } from '@/interfaces/shared/api/auth';
import { AuthErrorCode } from '@/interfaces/shared/errorcode/auth';

/**
 * accessToken 有效期短，过期后需要用 refreshToken 刷新
 * refreshToken 会缓存在用户本地，如果刷新失败则让用户重新登录
 */
let isLoading = false;
let accessToken: string | void = '';
// let accessTokenExpiredAt = 0;
let refreshTokenCache: string | null = '';

export function setAccessToken(token: string) {
  accessToken = token;
  console.log(`[request] access token 已更新: ${token}`);
}

/**
 * 前端 access token 会比后端早过期，避免请求发出时 token 已过期
 */
export function accessTokenExpired() {
  if (!accessToken) {
    return true;
  }

  const currentSecond = Math.floor(Date.now() / 1000);
  return currentSecond + 15 >= parseInt(parseJwt(accessToken)['exp']);
}

export async function getRefreshToken() {
  if (refreshTokenCache) {
    // console.log('refresh token 已找到：' + refreshTokenCache)
    return Promise.resolve(refreshTokenCache);
  }

  const value = localStorage.getItem(STORAGE_KEYS.UserRefreshToken);
  console.log('localStorage 中获取到 refresh token：' + value)

  refreshTokenCache = value;
  return refreshTokenCache;
}

let refreshPromise: Promise<IRefreshApiResponse> | undefined = undefined;

async function _refreshTokens() {
  const refreshToken = await getRefreshToken();
  if (!refreshToken || refreshToken === undefined || refreshToken === 'undefined') {
    console.log('[request] 缺少 refresh token');
    return Promise.reject({ detail: '请登录后再试' });
  }
  console.log('[request] 已获得 refresh token ' + refreshToken);

  if (refreshPromise) {
    return refreshPromise;
  }

  return refreshPromise = baseProvider
    .post<IRefreshApiResponse>(
      '/api/auth/refresh-token/',
      {
        refreshToken: refreshToken,
      },
      {
        withToken: false,
      },
    )
    .then(async (res) => {
      setAccessToken(res.data.accessToken);
      await setRefreshToken(res.data.refreshToken);
      console.log('[request] refresh token 刷新成功');
      return res.data;
    })
    .catch((err: ResponseError) => {
      console.log('[request] token 刷新失败');
      return Promise.reject(err);
    })
    .finally(() => {
      refreshPromise = undefined;
    });
}

export async function refreshTokens() {
  console.log('[request] 开始刷新 token');
  while (isLoading) {
    console.log('[request] 等待刷新 token');
    await sleepAsync(500);
  }
  isLoading = true;
  await _refreshTokens().finally(() => (isLoading = false));
}

export async function setRefreshToken(token: string) {
  localStorage.setItem(STORAGE_KEYS.UserRefreshToken, token);
  refreshTokenCache = token;
  console.log(`[request] refresh token 已更新: ${token}`);
}

export async function clearRefreshToken() {
  const refreshToken = await getRefreshToken();
  if (refreshToken && refreshToken !== undefined && refreshToken !== 'undefined') {
    await baseProvider.post(
      '/api/auth/logout/',
      {
        refreshToken: refreshToken,
      },
      {
        withToken: false,
      },
    )
  }
  localStorage.removeItem(STORAGE_KEYS.UserRefreshToken);
  refreshTokenCache = '';
  console.log(`[request] refresh token 清除`);
}

export const onRequestFulfilled: (
  config: RequestConfig,
) => Promise<RequestConfig> = async config => {
  console.log(
    `[request][${config.method}] 开始请求 ${config.url} [body] ${JSON.stringify(
      config.data,
    )}`,
  );

  const refreshToken = await getRefreshToken();
  let hadRefreshed = false;
  let _accessToken = accessToken;
  if (refreshToken && (config.withToken === undefined || config.withToken)) {
    if (accessTokenExpired()) {
      console.log(`[request] 请求 ${config.url} 时 access token 过期`);
      _accessToken = await _refreshTokens().then((res => res.accessToken)).catch();
      hadRefreshed = true;
    }
    if (_accessToken) {
      if (hadRefreshed) {
        console.log(`[request] 重新请求 ${config.url}`);
      }
      return Promise.resolve({
        ...config,
        headers: {
          ...config.headers,
          Authorization: `Bearer ${_accessToken}`,
        },
      });
    }
    console.log(`[request] 刷新 access token 失败`);
  }

  return Promise.resolve({
    ...config,
  });
};

export const onRequestRejected: (error: any) => any = error => {
  message.error('请求已取消');
  return Promise.reject(error);
};


const onResponseFulfilled: (value: AxiosResponse<Response>) => any = (
  response
) => {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data
  if (!response.data.success) {
    console.log(
      `[request][${response.request._method}] 请求失败 ${
        response.request._url
      } [body] ${JSON.stringify(response.data)}`,
    );
    return Promise.reject(keysToCamel(response));
  }

  return Promise.resolve(keysToCamel(response));
};

/**
 * 2xx 以外的 HTTP 响应以及服务器不成功的响应都会经过这边
 * 如果需要使用非标准的接口，可单独创建实例与拦截器
 */
async function onResponseRejected(error?: AxiosError): Promise<any> {
  console.log(`onResponseRejected`);
  if (!error) {
    return Promise.reject({ detail: "发生未知错误" });
  }

  if (!error.response) {
    message.error("服务器开小差啦");
    return Promise.reject(keysToCamel(error));
  }

  if (error.response.data.code) {
    const code = parseInt(error.response.data.code);
    console.log(`[request] error code: ${code}`);

    if (code === AuthErrorCode.REFRESH_TOKEN_DISABLES) {
      await clearRefreshToken();
    }
  }

  if (error.response.data.detail) {
    message.error(error.response.data.detail);
  }

  return Promise.reject(keysToCamel(error));
};

class BaseProvider {
  provider: AxiosInstance;
  constructor() {
    this.provider = axios.create({
      withCredentials: true,
      timeout: 15000,
    });
    this.provider.interceptors.request.use(
      onRequestFulfilled,
      onRequestRejected,
    );
    this.provider.interceptors.response.use(
      onResponseFulfilled,
      onResponseRejected,
    );
  }
  request<T = any>(config: AxiosRequestConfig): AxiosPromise<Response<T>> {
    return this.provider
      .request(config)
      .then((res) => {
        return keysToCamel(res.data);
      });
  }

  get<R = any>(url: string, config?: RequestConfig): Promise<Response<R>> {
    return this.provider.get(url, config).then((res) => {
      return res.data
    });
  }

  // get<T = any>(url: string, config?: AxiosRequestConfig): Promise<Response<T>> {
  //   return this.provider.get(url, config).then((data) => );
  // }

  post<T = any>(...args: any[]): Promise<Response<T>> {
    return this.provider
      .post(
        ...(args as [string, any | undefined, AxiosRequestConfig | undefined])
      )
      .then((res) => {
        return res.data;
      });
  }

  put<T = any>(...args: any[]): Promise<Response<T>> {
    return this.provider
      .put(
        ...(args as [string, any | undefined, AxiosRequestConfig | undefined])
      )
      .then((res) => {
        return res.data;
      });
  }

  patch<T = any>(...args: any[]): Promise<Response<T>> {
    return this.provider
      .patch(
        ...(args as [string, any | undefined, AxiosRequestConfig | undefined])
      )
      .then((res) => {
        return res.data;
      });
  }

  delete<T = any>(...args: any[]): Promise<Response<T>> {
    return this.provider
      .delete(...(args as [string, AxiosRequestConfig | undefined]))
      .then((res) => {
        return res.data;
      });
  }

  head<T = any>(...args: any[]): Promise<Response<T>> {
    return this.provider
      .head(...(args as [string, AxiosRequestConfig | undefined]))
      .then((res) => {
        return res.data;
      });
  }
}

let baseProvider = new BaseProvider();

export default baseProvider;
