import apiClient from '../apiClient';

import { UserInfo } from '#/entity';

export enum AuthApi {
  GetUserByToken = '/auth/getUserByToken',
  ResetPassword = '/auth/resetPassword',
}
type ResetPasswordReq = {
  token: string;
  password: string;
  passwordConfirm: string;
};
const getUserByToken = (token: string) =>
  apiClient.get<UserInfo>({ url: `${AuthApi.GetUserByToken}/${token}` });

const resetPassword = (data: ResetPasswordReq) =>
  apiClient.post({
    url: `${AuthApi.ResetPassword}/${data.token}`,
    data: { password: data.password, passwordConfirm: data.passwordConfirm },
  });

export default {
  getUserByToken,
  resetPassword,
};
