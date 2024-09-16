import apiClient from '../apiClient';

export enum FuncApi {
  AddFunc = '/funcs',
  DelFunc = '/funcs',
  UpdateFunc = '/funcs',
  Permission = '/funcs/permission',
}

const addFunc = (data: any) => apiClient.post({ url: FuncApi.AddFunc, data });
const delFunc = (id: string) => apiClient.delete({ url: `${FuncApi.DelFunc}/${id}` });
const updateFunc = (id: string, data: any) =>
  apiClient.put({ url: `${FuncApi.UpdateFunc}/${id}`, data });

const fetchFuncPermissions = () => apiClient.get<string[]>({ url: FuncApi.Permission });
export default {
  addFunc,
  delFunc,
  updateFunc,
  fetchFuncPermissions,
};
