import { MenuType } from '#/enum';

export const MENU_TYPE_ENUM = [
  {
    label: '一级菜单',
    value: MenuType.FIRST_MENU,
  },
  {
    label: '二级菜单',
    value: MenuType.SECOND_MENU,
  },
];

export const MENU_TYPE_MAP = {
  [MenuType.FIRST_MENU]: '一级菜单',
  [MenuType.SECOND_MENU]: '二级菜单',
};
