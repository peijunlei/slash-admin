import { getItem } from './storage';

import { StorageEnum } from '#/enum';

export const checkAuth = (funcCode: string) => {
  const FUNC_CODES = getItem<string[]>(StorageEnum.FUNC_CODES) || [];
  return FUNC_CODES.includes(funcCode);
};
