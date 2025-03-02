import type { ApiMethod, ExtraMenuType, MenuType, UserRole } from './enum';

declare global {
  // 基础模型接口
  interface BaseModel {
    /** 主键 */
    id: string;
    /** 创建时间 */
    createTime?: string;
    /** 更新时间 */
    updateTime?: string;
  }

  // API接口模型
  interface IApi extends BaseModel {
    /** 接口名称 */
    apiName: string;
    /** 接口URL */
    apiUrl: string;
    /** 接口方法 */
    method: ApiMethod;
  }
  // 用户模型
  interface IUser extends BaseModel {
    /** 手机 */
    phone?: string | null;
    /** 邮箱 */
    email: string;
    /** 年龄 */
    age?: number | null;
    /** 角色id集合 */
    roleIds: string[];
    /** 身份 */
    role: UserRole;
    /** 角色集合 */
    roles?: IRole[]; // 虚拟字段
  }

  // 角色模型
  interface IRole extends BaseModel {
    /** 名称 */
    name: string;
    /** 描述 */
    description?: string | null;
    /** 菜单id集合 */
    menus: string[];
    /** 功能id集合 */
    funcs: string[];
    /** 排序 */
    order?: number | null;
    /** 禁用 */
    disabled: boolean;
  }
  // 菜单模型
  interface IMenu extends BaseModel {
    /** 菜单名称 */
    label: string;
    /** 路由 */
    route: string;
    /** 父级ID */
    parentId?: string | null;
    /** 图标 */
    icon?: string | null;
    /** 类型 */
    type: MenuType | ExtraMenuType;
    /** 排序 */
    order?: number | null;
    /** 隐藏 */
    hide: boolean;
    /** 禁用 */
    disabled: boolean;
    /** 新功能 */
    newFeature: boolean;
  }
  // 功能模型
  interface IFunc extends BaseModel {
    /** 菜单id */
    menuId: string;
    /** 接口id集合 */
    apiIds: string[];
    /** 接口集合 */
    apis: IApi[];
    /** 功能名称 */
    functionName: string;
    /** 功能编码 */
    functionCode: string;
    /** 排序 */
    order?: number;
  }
  /** 菜单功能模型 */
  type MenuFunc = IMenu & IFunc;
  /** 菜单功能接口模型 */
  type MenuFuncApi = IMenu & IFunc & IApi;
}
export {};
