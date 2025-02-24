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
  Permission = '/menus/permission',
  Logout = '/auth/logout',
  Refresh = '/auth/refresh',
  User = '/user',
}

const signin = (data: SignInReq) => apiClient.post<SignInRes>({ url: UserApi.SignIn, data });
const signup = (data: SignUpReq) => apiClient.post<SignInRes>({ url: UserApi.SignUp, data });
const sendCode = (email: string) => apiClient.post({ url: UserApi.SendCode, data: { email } });
const logout = () => apiClient.get({ url: UserApi.Logout });
const fetchMenuPermissions = () =>
  apiClient.get<{ list: any[]; total: number }>({ url: UserApi.Permission });
const findById = (id: string) => apiClient.get<UserInfo[]>({ url: `${UserApi.User}/${id}` });

const fetchAllUsers = (data: FetAllUsersReq) =>
  apiClient.get<{
    list: UserInfo[];
    total: number;
  }>({ url: Users, params: data });

const addUser = (data: UserInfo) => apiClient.post({ url: Users, data });
const delUser = (id: string) => apiClient.delete({ url: `${Users}/${id}` });
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
};
