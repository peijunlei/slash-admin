import api from '@/api/apiClient';

export function fetchRoles() {
  return api.get({
    url: '/roles',
  });
}

export function updateRole(id: number, data: any) {
  return api.put({
    url: `/roles/${id}`,
    data,
  });
}

export function addRole(data: any) {
  return api.post({
    url: '/roles',
    data,
  });
}

// del
export function delRole(id: number) {
  return api.delete({
    url: `/roles/${id}`,
  });
}

// 获取所有菜单
export function fetchAllMenus() {
  return api.get({
    url: '/menus',
  });
}
