import apiClient from '../apiClient';

import { UserInfo } from '#/entity';

export interface SignInReq {
  email: string;
  password: string;
}

export interface SignUpReq {
  email: string;
  code: string;
  password: string;
  passwordConfirm: string;
}
export type SignInRes = {
  token: string;
  userInfo: UserInfo;
};
interface FetAllUsersReq {
  pageNum: number;
  pageSize: number;
  email?: string;
  phone?: string;
}
const Users = '/users';
export enum UserApi {
  SignIn = '/auth/login',
  SignUp = '/auth/register',
  SendCode = '/auth/sendCode',
  // forgetPassword
  ForgetPassword = '/auth/forgetPassword',
  Permission = '/menus/permission',
  Logout = '/auth/logout',
  Refresh = '/auth/refresh',
  User = '/user',
}
/** 登录 */
const signin = (data: SignInReq) => apiClient.post<SignInRes>({ url: UserApi.SignIn, data });
/** 注册 */
const signup = (data: SignUpReq) => apiClient.post<SignInRes>({ url: UserApi.SignUp, data });
/** 发送验证码 */
const sendCode = (email: string) => apiClient.post({ url: UserApi.SendCode, data: { email } });
/** 忘记密码发送置密码链接 */
const forgetPassword = (data: { email: string }) =>
  apiClient.post({ url: UserApi.ForgetPassword, data });
/** 退出登录 */
const logout = () => apiClient.get({ url: UserApi.Logout });
/** 获取菜单权限 */
const fetchMenuPermissions = () =>
  apiClient.get<{ list: any[]; total: number }>({ url: UserApi.Permission });
/** 根据id获取用户信息 */
const findById = (id: string) => apiClient.get<UserInfo[]>({ url: `${UserApi.User}/${id}` });
/** 获取所有用户 */
const fetchAllUsers = (data: FetAllUsersReq) =>
  apiClient.get<{
    list: IUser[];
    total: number;
  }>({ url: Users, params: data });
/** 添加用户 */
const addUser = (data: UserInfo) => apiClient.post({ url: Users, data });
/** 删除用户 */
const delUser = (id: string) => apiClient.delete({ url: `${Users}/${id}` });
/** 更新用户 */
const updateUser = (id: string, data: UserInfo) => apiClient.put({ url: `${Users}/${id}`, data });
export default {
  signin,
  signup,
  findById,
  logout,
  sendCode,
  fetchMenuPermissions,
  fetchAllUsers,
  addUser,
  delUser,
  updateUser,
  forgetPassword,
};
