import apiClient from '../apiClient';

export enum RoleApi {
  Roles = '/roles',
}

const fetchAllRoles = () =>
  apiClient.get<{
    list: never[];
    total: number;
  }>({ url: RoleApi.Roles });

export default {
  fetchAllRoles,
};
