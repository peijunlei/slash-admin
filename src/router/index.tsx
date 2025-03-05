import { lazy } from 'react';
import { Navigate, RouteObject, RouterProvider, createHashRouter } from 'react-router-dom';

import DashboardLayout from '@/layouts/dashboard';
import Demo1 from '@/pages/canvas/demo1';
import { usePermissionRoutes } from '@/router/hooks';
import { ErrorRoutes } from '@/router/routes/error-routes';

import AuthGuard from './components/auth-guard';

import { AppRouteObject } from '#/router';

const { VITE_APP_HOMEPAGE: HOMEPAGE } = import.meta.env;

const HomePage = lazy(() => import('@/pages/dashboard/workbench'));
const Analysis = lazy(() => import('@/pages/dashboard/analysis'));
const CustomerList = lazy(() => import('@/pages/customer/customer-list'));
const CustomerDetail = lazy(() => import('@/pages/customer/customer-detail'));

const SystemSetting = lazy(() => import('@/pages/setting/system'));
const AccountSetting = lazy(() => import('@/pages/setting/account'));
const RoleSetting = lazy(() => import('@/pages/setting/role'));
const MenuSetting = lazy(() => import('@/pages/setting/menu'));
const ProfileSetting = lazy(() => import('@/pages/setting/profile'));

const LoginRoute: AppRouteObject = {
  path: '/login',
  Component: lazy(() => import('@/pages/sys/login/Login')),
};
const CanvasRoutes: AppRouteObject = {
  path: '/canvas',
  children: [
    {
      index: true,
      element: <Navigate to="demo1" replace />,
    },
    {
      path: 'demo1',
      element: <Demo1 />,
    },
  ],
};
const PAGE_NOT_FOUND_ROUTE: AppRouteObject = {
  path: '*',
  element: <Navigate to="/404" replace />,
};

export default function Router() {
  const permissionRoutes = usePermissionRoutes()?.filter((item) => item.path !== 'dashboard');
  console.log('permissionRoutes', permissionRoutes);
  const asyncRoutes: AppRouteObject = {
    path: '/',
    element: (
      <AuthGuard>
        <DashboardLayout />
      </AuthGuard>
    ),
    // children: [...permissionRoutes],
    children: [
      {
        index: true,
        element: <Navigate to={HOMEPAGE} replace />,
      },
      {
        path: 'dashboard',
        children: [
          {
            index: true,
            element: <Navigate to="workbench" replace />,
          },
          {
            path: 'workbench',
            element: <HomePage />,
          },
          {
            path: 'analysis',
            element: <Analysis />,
          },
        ],
      },
      ...permissionRoutes,
    ],
    //   {
    //     path: 'customer',
    //     children: [
    //       {
    //         index: true,
    //         element: <Navigate to="customer-list" replace />,
    //       },
    //       {
    //         path: 'customer-list',
    //         element: <CustomerList />,
    //       },
    //       {
    //         path: 'customer-detail/:id',
    //         element: <CustomerDetail />,
    //       },
    //     ],
    //   },
    //   {
    //     path: 'setting', // system account role menu profile
    //     children: [
    //       {
    //         index: true,
    //         element: <Navigate to="system" replace />,
    //       },
    //       {
    //         path: 'system',
    //         element: <SystemSetting />,
    //       },
    //       {
    //         path: 'account',
    //         element: <AccountSetting />,
    //       },
    //       {
    //         path: 'role',
    //         element: <RoleSetting />,
    //       },
    //       {
    //         path: 'menu',
    //         element: <MenuSetting />,
    //       },
    //       {
    //         path: 'profile',
    //         element: <ProfileSetting />,
    //       },
    //     ],
    //   },
    // ],
  };
  const routes = [LoginRoute, asyncRoutes, ErrorRoutes, PAGE_NOT_FOUND_ROUTE];

  const router = createHashRouter(routes as unknown as RouteObject[]);
  return <RouterProvider router={router} />;
}
