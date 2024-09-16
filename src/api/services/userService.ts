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
export enum UserApi {
  SignIn = '/users/login',
  SignUp = '/users/registerByCode',
  SendCode = '/users/sendCode',
  Permission = '/menus/permission',
  Logout = '/auth/logout',
  Refresh = '/auth/refresh',
  User = '/user',
  AllUsers = '/users',
  AddUser = '/users/add',
  DelUser = '/users',
  UpdateUser = '/users',
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
  }>({ url: UserApi.AllUsers, params: data });

const addUser = (data: UserInfo) => apiClient.post({ url: UserApi.AddUser, data });
const delUser = (id: string) => apiClient.delete({ url: `${UserApi.DelUser}/${id}` });
const updateUser = (id: string, data: UserInfo) =>
  apiClient.put({ url: `${UserApi.UpdateUser}/${id}`, data });
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
