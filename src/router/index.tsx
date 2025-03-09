import { lazy } from 'react';
import { Navigate, RouteObject, RouterProvider, createHashRouter } from 'react-router-dom';

import DashboardLayout from '@/layouts/dashboard';
import { usePermissionRoutes } from '@/router/hooks';
import { ErrorRoutes } from '@/router/routes/error-routes';

import AuthGuard from './components/auth-guard';

import { AppRouteObject } from '#/router';

const { VITE_APP_HOMEPAGE: HOMEPAGE } = import.meta.env;

const HomePage = lazy(() => import('@/pages/dashboard/workbench'));
const Analysis = lazy(() => import('@/pages/dashboard/analysis'));
const Welcome = lazy(() => import('@/pages/welcome'));
const WelcomeRoute: AppRouteObject = {
  path: '/welcome',
  Component: Welcome,
};
const LoginRoute: AppRouteObject = {
  path: '/login',
  Component: lazy(() => import('@/pages/sys/login/Login')),
};
const ResetPasswordRoute: AppRouteObject = {
  path: '/reset-password/:token',
  Component: lazy(() => import('@/pages/sys/reset-password/Login')),
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
  };
  const routes = [
    LoginRoute,
    ResetPasswordRoute,
    WelcomeRoute,
    asyncRoutes,
    ErrorRoutes,
    PAGE_NOT_FOUND_ROUTE,
  ];

  const router = createHashRouter(routes as unknown as RouteObject[]);
  return <RouterProvider router={router} />;
}
