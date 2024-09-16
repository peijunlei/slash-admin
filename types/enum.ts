export enum BasicStatus {
  DISABLE,
  ENABLE,
}

export enum ResultEnum {
  SUCCESS = 'K-000000',
  FAIL = 'K-000001',
  TIMEOUT = 401,
}

export enum StorageEnum {
  FUNC_CODES = 'funcCodes',
  Menus = 'menus',
  User = 'user',
  Token = 'token',
  Settings = 'settings',
  I18N = 'i18nextLng',
}

export enum ThemeMode {
  Light = 'light',
  Dark = 'dark',
}

export enum ThemeLayout {
  /**
   * 垂直布局
   */
  Vertical = 'vertical',
  /**
   * 水平布局
   */
  Horizontal = 'horizontal',
  /**
   * 迷你布局
   */
  Mini = 'mini',
}

export enum ThemeColorPresets {
  Default = 'default',
  Cyan = 'cyan',
  Purple = 'purple',
  Blue = 'blue',
  Orange = 'orange',
  Red = 'red',
}

export enum LocalEnum {
  en_US = 'en_US',
  zh_CN = 'zh_CN',
}

export enum MultiTabOperation {
  FULLSCREEN = 'fullscreen',
  REFRESH = 'refresh',
  CLOSE = 'close',
  CLOSEOTHERS = 'closeOthers',
  CLOSEALL = 'closeAll',
  CLOSELEFT = 'closeLeft',
  CLOSERIGHT = 'closeRight',
}

export enum PermissionType {
  CATALOGUE,
  MENU,
  BUTTON,
  AUTH,
}
export enum MenuType {
  /**
   * 一级菜单
   */
  FIRST_MENU,
  /**
   * 二级菜单
   */
  SECOND_MENU,

  /**
   * 功能
   */
  FUNC,

  /**
   * 权限
   */
  AUTH,
}

export enum ApiMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}
