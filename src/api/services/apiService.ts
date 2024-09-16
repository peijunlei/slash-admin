import apiClient from '../apiClient';

import { Api } from '#/entity';

export interface SignInReq {
  email: string;
  password: string;
}

export interface SignUpReq {
  email: string;
  code: string;
  password: string;
  passwordConfirm: string;
}
export type SignInRes = {
  token: string;
  Api: Api;
};
interface FetAllApisReq {
  pageNum: number;
  pageSize: number;
  email?: string;
  phone?: string;
}
export enum ApiApi {
  AllApis = '/apis',
  AddApi = '/apis',
  DelApi = '/apis',
  UpdateApi = '/apis',
}

const fetchAllApis = (data: FetAllApisReq) =>
  apiClient.get<{
    list: Api[];
    total: number;
  }>({ url: ApiApi.AllApis, params: data });

const addApi = (data: Api) => apiClient.post({ url: ApiApi.AddApi, data });
const delApi = (id: string) => apiClient.delete({ url: `${ApiApi.DelApi}/${id}` });
const updateApi = (id: string, data: Api) =>
  apiClient.put({ url: `${ApiApi.UpdateApi}/${id}`, data });
export default {
  fetchAllApis,
  addApi,
  delApi,
  updateApi,
};
