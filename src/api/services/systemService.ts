import apiClient from '../apiClient';

export enum SystemApi {
  Menus = '/menus',
}

const fetchAllMenus = () =>
  apiClient.get<{
    list: any[];
    total: number;
  }>({ url: SystemApi.Menus });

export default {
  fetchAllMenus,
};
