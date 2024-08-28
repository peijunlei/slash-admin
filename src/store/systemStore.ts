import { create } from 'zustand';
// devtools
import { devtools } from 'zustand/middleware';

import { setItem } from '@/utils/storage';

import { StorageEnum } from '#/enum';

type SystemStore = {
  // 使用 actions 命名空间来存放所有的 action
  actions: {
    setMenus: (menus: any[]) => void;
  };
};

const useStore = create<SystemStore>()(
  devtools((set) => ({
    actions: {
      setMenus: (menus) => {
        setItem(StorageEnum.Menus, menus);
      },
    },
  })),
);

export const useSystemActions = () => useStore((state) => state.actions);
