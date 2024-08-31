import { BasicStatus, PermissionType } from './enum';

export interface UserToken {
  accessToken?: string;
  refreshToken?: string;
}

export interface UserInfo {
  id: string;
  email: string;
  phone?: string;
  username?: string;
  password?: string;
  avatar?: string;
  role?: Role;
  status?: BasicStatus;
  permissions?: Permission[];
}

export interface Organization {
  id: string;
  name: string;
  status: 'enable' | 'disable';
  desc?: string;
  order?: number;
  children?: Organization[];
}

export interface Permission {
  id: string;
  parentId: string;
  name?: string;
  label: string;
  type: PermissionType;
  route: string;
  /**
   * 是否禁用
   */
  disabled?: boolean;
  order?: number;
  icon?: string;
  component?: string;
  hide?: boolean;
  frameSrc?: string;
  /**
   * 是否是新功能 会在菜单上显示一个 new 标签
   */
  newFeature?: boolean;
  children?: Permission[];
}

export interface Role {
  id: string;
  name: string;
  label: string;
  status: BasicStatus;
  order?: number;
  desc?: string;
  menus?: string[];
  permission?: Permission[];
}

export interface Menu {
  newFeature?: boolean;
  functionName?: null;
  authUrl?: null;
  authMethod?: null;
  label: string;
  route: string;
  parentId?: string;
  icon?: null;
  type: number;
  order: number;
  path?: string;
  hide?: boolean;
  disabled?: boolean;
  delflag: boolean;
  createTime: Date;
  updateTime: Date;
  id: string;
  menuId?: string;
}
