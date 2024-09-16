import { message as Message } from 'antd';
import axios, { AxiosRequestConfig, AxiosError, AxiosResponse } from 'axios';
import { isEmpty } from 'ramda';

import { t } from '@/locales/i18n';
import { getItem, removeItem } from '@/utils/storage';

import { Result } from '#/api';
import { ResultEnum, StorageEnum } from '#/enum';

// 创建 axios 实例
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API as string,
  timeout: 50000,
  headers: {
    'Content-Type': 'application/json;charset=utf-8',
  },
});

// 请求拦截
axiosInstance.interceptors.request.use(
  (config) => {
    const token = (getItem(StorageEnum.Token) as any)?.accessToken || '';
    // 在请求被发送之前做些什么
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    // 请求错误时做些什么
    return Promise.reject(error);
  },
);

// 响应拦截
axiosInstance.interceptors.response.use(
  (res: AxiosResponse<Result>) => {
    if (!res.data) throw new Error(t('sys.api.apiRequestFailed'));

    const { code, data, message } = res.data;
    // 业务请求成功
    if (code === ResultEnum.SUCCESS) {
      return data;
    }

    // 业务请求错误
    throw new Error(message || t('sys.api.apiRequestFailed'));
  },
  (error: AxiosError<Result>) => {
    const { response, message } = error || {};
    let errMsg = response?.data?.message || message;
    // 对响应错误做点什么
    if (isEmpty(errMsg)) {
      errMsg = t('sys.api.errorMessage');
    }
    Message.error(errMsg);
    const status = response?.status;

    switch (status) {
      case 401:
        // 跳转登录页
        removeItem(StorageEnum.Token);
        window.location.href = '/login';
        break;
      default:
        break;
    }
    return Promise.reject(error);
  },
);

class APIClient {
  get<T = any>(config: AxiosRequestConfig): Promise<T> {
    return this.request({ ...config, method: 'GET' });
  }

  post<T = any>(config: AxiosRequestConfig): Promise<T> {
    return this.request({ ...config, method: 'POST' });
  }

  put<T = any>(config: AxiosRequestConfig): Promise<T> {
    return this.request({ ...config, method: 'PUT' });
  }

  delete<T = any>(config: AxiosRequestConfig): Promise<T> {
    return this.request({ ...config, method: 'DELETE' });
  }

  request<T = any>(config: AxiosRequestConfig): Promise<T> {
    return new Promise((resolve, reject) => {
      axiosInstance
        .request<any, AxiosResponse<Result>>(config)
        .then((res: AxiosResponse<Result>) => {
          resolve(res as unknown as Promise<T>);
        })
        .catch((e: Error | AxiosError) => {
          reject(e);
        });
    });
  }
}
export default new APIClient();
