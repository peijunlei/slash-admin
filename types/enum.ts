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

/** 接口方法 */
export enum ApiMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}
/** 用户身份 */
export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  GUEST = 'guest',
}
/** 初始菜单类型 */
export enum MenuType {
  /**  一级菜单 */
  FIRST_MENU = 0,
  /**  二级菜单 */
  SECOND_MENU = 1,
}
/** 扩展菜单类型 */
export enum ExtraMenuType {
  /**  功能 */
  FUNCTION = 2,
}
