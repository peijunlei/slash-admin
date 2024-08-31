import apiClient from '../apiClient';

import { Menu } from '#/entity';

export enum MenuApi {
  Menus = '/menus',
  AddMenu = '/menus',
  DelMenu = '/menus',
  UpdateMenu = '/menus',
  ExchangeOrder = '/menus/exchangeOrder',
}
const addMenu = (data: any) => apiClient.post({ url: MenuApi.AddMenu, data });
const delMenu = (id: string) => apiClient.delete({ url: `${MenuApi.DelMenu}/${id}` });
const updateMenu = (id: string, data: any) =>
  apiClient.put({ url: `${MenuApi.UpdateMenu}/${id}`, data });
const fetchAllMenus = () =>
  apiClient.get<{
    list: Menu[];
    total: number;
  }>({ url: MenuApi.Menus });

const exchangeOrder = (data: { id: string; targetId: string }) =>
  apiClient.post({ url: MenuApi.ExchangeOrder, data });
export default {
  fetchAllMenus,
  addMenu,
  delMenu,
  updateMenu,
  exchangeOrder,
};
