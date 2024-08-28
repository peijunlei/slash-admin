import { isEmpty } from 'ramda';
import { Suspense, lazy, useMemo } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import { Iconify } from '@/components/icon';
import { CircleLoading } from '@/components/loading';
import { useUserPermission } from '@/store/userStore';
import ProTag from '@/theme/antd/components/tag';
import { flattenTrees } from '@/utils/tree';

import { Permission } from '#/entity';
import { PermissionType } from '#/enum';
import { AppRouteObject } from '#/router';

// 使用 import.meta.glob 获取所有路由组件
const pages = import.meta.glob('/src/pages/**/*.tsx');
// 构建绝对路径的函数
function resolveComponent(path: string) {
  return pages[`/src/pages${path}`];
}

/**
 * return routes about permission
 */
export function usePermissionRoutes() {
  const permissions = useUserPermission();
  return useMemo(() => {
    // 将权限树扁平化
    const flattenedPermissions = flattenTrees(permissions!);
    const permissionRoutes = transformPermissionToMenuRoutes(
      permissions || [],
      flattenedPermissions,
    );
    return [...permissionRoutes];
  }, [permissions]);
}

/**
 * transform Permission[] to  AppRouteObject[]
 * @param permissions
 * @param parent
 */
function transformPermissionToMenuRoutes(
  permissions: Permission[],
  flattenedPermissions: Permission[],
) {
  return permissions.map((permission) => {
    const {
      route,
      type,
      label,
      icon,
      order,
      hide,
      disabled,
      frameSrc,
      newFeature,
      component,
      parentId,
      children = [],
    } = permission;
    const appRoute: AppRouteObject = {
      path: route,
      meta: {
        label,
        key: getCompleteRoute(permission, flattenedPermissions),
        hideMenu: !!hide,
        disabled,
      },
    };

    if (order) appRoute.order = order;
    if (icon) appRoute.meta!.icon = icon;
    if (frameSrc) appRoute.meta!.frameSrc = frameSrc;
    if (newFeature)
      appRoute.meta!.suffix = (
        <ProTag color="cyan" icon={<Iconify icon="solar:bell-bing-bold-duotone" size={14} />}>
          NEW
        </ProTag>
      );

    if (type === PermissionType.CATALOGUE) {
      appRoute.meta!.hideTab = true;
      // 如果是顶级路由，直接渲染子路由
      if (!parentId) {
        appRoute.element = (
          <Suspense fallback={<CircleLoading />}>
            <Outlet />
          </Suspense>
        );
      }
      appRoute.children = transformPermissionToMenuRoutes(children, flattenedPermissions);
      if (!isEmpty(children)) {
        // 如果有子路由，将第一个子路由作为父路由的默认路由
        appRoute.children.unshift({
          index: true,
          element: <Navigate to={children[0].route} replace />,
        });
      }
    } else if (type === PermissionType.MENU) {
      // 如果是菜单路由，渲染对应的组件 懒加载
      const Element = lazy(resolveComponent(component!) as any);
      if (frameSrc) {
        appRoute.element = <Element src={frameSrc} />;
      } else {
        appRoute.element = <Element />;
      }
    }

    return appRoute;
  });
}

/**
 * Splicing from the root permission route to the current permission route
 * @param {Permission} permission - current permission
 * @param {Permission[]} flattenedPermissions - flattened permission array
 * @param {string} route - parent permission route
 * @returns {string} - The complete route after splicing
 */
function getCompleteRoute(permission: Permission, flattenedPermissions: Permission[], route = '') {
  const currentRoute = route ? `/${permission.route}${route}` : `/${permission.route}`;

  if (permission.parentId) {
    const parentPermission = flattenedPermissions.find((p) => p.id === permission.parentId)!;
    return getCompleteRoute(parentPermission, flattenedPermissions, currentRoute);
  }

  return currentRoute;
}
