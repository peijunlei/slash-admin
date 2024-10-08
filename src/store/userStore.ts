import { useMutation } from '@tanstack/react-query';
import { App } from 'antd';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import funcService from '@/api/services/funcService';
import userService, { SignInReq } from '@/api/services/userService';
import { getItem, removeItem, setItem } from '@/utils/storage';
import { arrayToTree } from '@/utils/tree';

import { UserInfo, UserToken } from '#/entity';
import { StorageEnum } from '#/enum';

const { VITE_APP_HOMEPAGE: HOMEPAGE } = import.meta.env;

type UserStore = {
  userInfo: Partial<UserInfo>;
  userToken: UserToken;
  // 使用 actions 命名空间来存放所有的 action
  actions: {
    setUserInfo: (userInfo: UserInfo) => void;
    setUserToken: (token: UserToken) => void;
    clearUserInfoAndToken: () => void;
  };
};

const useUserStore = create<UserStore>()(
  devtools((set) => ({
    userInfo: getItem<UserInfo>(StorageEnum.User) || {},
    userToken: getItem<UserToken>(StorageEnum.Token) || {},
    actions: {
      setUserInfo: (userInfo) => {
        set({ userInfo });
        setItem(StorageEnum.User, userInfo);
      },
      setUserToken: (userToken) => {
        set({ userToken });
        setItem(StorageEnum.Token, userToken);
      },
      clearUserInfoAndToken() {
        set({ userInfo: {}, userToken: {} });
        removeItem(StorageEnum.User);
        removeItem(StorageEnum.Token);
      },
    },
  })),
);

export const useUserInfo = () => useUserStore((state) => state.userInfo);
export const useUserToken = () => useUserStore((state) => state.userToken);
export const useUserPermission = () => useUserStore((state) => state.userInfo.permissions);
export const useUserActions = () => useUserStore((state) => state.actions);

export const useSignIn = () => {
  const { t } = useTranslation();
  const navigatge = useNavigate();
  const { notification, message } = App.useApp();
  const { setUserToken, setUserInfo } = useUserActions();

  const signInMutation = useMutation(userService.signin);

  const signIn = async (data: SignInReq) => {
    try {
      const loginRes = await signInMutation.mutateAsync(data);
      const { token, userInfo } = loginRes;
      setUserToken({ accessToken: token, refreshToken: '123' });
      const [menuRes, funcRes] = await Promise.all([
        userService.fetchMenuPermissions(),
        funcService.fetchFuncPermissions(),
      ]);
      setItem(StorageEnum.FUNC_CODES, funcRes);
      const treeData = arrayToTree(menuRes.list);
      userInfo.permissions = treeData;
      setUserInfo(userInfo);
      navigatge(HOMEPAGE, { replace: true });

      notification.success({
        message: t('登录成功'),
        description: `${t('sys.login.loginSuccessDesc')}: ${userInfo.email}`,
        duration: 3,
      });
    } catch (err) {
      message.error(err.message);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback(signIn, []);
};
