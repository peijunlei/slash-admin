import { Table } from 'antd';

import { useUserPermission } from '@/store/userStore';

export default function IndexPage() {
  const permissions = useUserPermission();
  console.log('permissions', permissions);
  const columns = [
    {
      title: '菜单名称',
      dataIndex: 'label',
    },
    {
      title: '路由',
      dataIndex: 'route',
    },
    {
      title: '图标',
      dataIndex: 'icon',
      render: (icon: string) => icon || '-',
    },
  ];
  return (
    <div>
      <Table rowKey="id" columns={columns} dataSource={permissions} />
    </div>
  );
}
