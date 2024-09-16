import apiClient from '../apiClient';

export enum RoleApi {
  Roles = '/roles',
  UpdateRole = '/roles',
  GetRole = '/roles',
}
const fetchRole = (id: string) => apiClient.get({ url: `${RoleApi.GetRole}/${id}` });
const updateRole = (id: string, data: any) =>
  apiClient.put({ url: `${RoleApi.UpdateRole}/${id}`, data });
const fetchAllRoles = () =>
  apiClient.get<{
    list: never[];
    total: number;
  }>({ url: RoleApi.Roles });

export default {
  fetchAllRoles,
  fetchRole,
  updateRole,
};
