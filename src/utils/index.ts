import { getItem } from './storage';

import { StorageEnum } from '#/enum';

export function getAllMenus() {
  const allMenus = (getItem(StorageEnum.Menus) as any[]) || [];
  return allMenus;
}
