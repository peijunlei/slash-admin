import apiClient from '../apiClient';

const ROLES_URL = '/roles';
const fetchRole = (id: string) => apiClient.get({ url: `${ROLES_URL}/${id}` });
const updateRole = (id: string, data: any) => apiClient.put({ url: `${ROLES_URL}/${id}`, data });

const addRole = (data: any) => apiClient.post({ url: ROLES_URL, data });

const delRole = (id: string) => apiClient.delete({ url: `${ROLES_URL}/${id}` });

const fetchAllRoles = () =>
  apiClient.get<{
    list: IRole[];
    total: number;
  }>({ url: ROLES_URL });

export default {
  fetchAllRoles,
  fetchRole,
  updateRole,
  addRole,
  delRole,
};
