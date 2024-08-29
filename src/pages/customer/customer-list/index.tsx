import { useAntdTable } from 'ahooks';
import { Button, Form, Input, Modal, Row, Table } from 'antd';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import roleService from '@/api/services/roleService';
import userService from '@/api/services/userService';
import TableActions from '@/components/table-actions';
import { useRouter } from '@/router/hooks';

import AddModal from './add-modal';

export default function CustomerList() {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const { push } = useRouter();
  const [addVisible, setAddVisible] = useState(false);
  const [record, setRecord] = useState();
  const [roles, setRoles] = useState([]);

  const { tableProps, search } = useAntdTable(getAllUsers, {
    defaultPageSize: 10,
    form,
  });
  const { submit, reset } = search;
  // @ts-ignore
  async function getAllUsers({ current, pageSize }, formData: Object) {
    const params = {
      pageNum: current,
      pageSize,
      ...formData,
    };
    const res = await userService.fetchAllUsers(params);
    return {
      total: res.total,
      list: res.list,
    };
  }
  async function handleOK(values: any) {
    values.id ? await userService.updateUser(values.id, values) : await userService.addUser(values);
    submit();
  }
  async function handleDel(id) {
    Modal.confirm({
      title: t('删除'),
      content: t('确定删除吗？'),
      onOk: async () => {
        await userService.delUser(id);
        submit();
      },
    });
  }
  const columns = [
    {
      title: t('手机号'),
      dataIndex: 'phone',
    },
    {
      title: t('邮箱'),
      dataIndex: 'email',
    },
    {
      title: t('角色'),
      dataIndex: 'roleIds',
      render: (roleIds) => {
        const roleNames = roles
          .filter((item) => roleIds.includes(item.id))
          .map((item) => item.name);
        return roleNames.join(',');
      },
    },
    {
      title: t('操作'),
      key: 'action',
      render: (row) => (
        <TableActions>
          <Button
            onClick={() => {
              setAddVisible(true);
              setRecord({
                ...row,
                disabled: true,
              });
            }}
          >
            {t('查看')}
          </Button>
          <Button
            type="dashed"
            onClick={() => {
              setRecord(row);
              setAddVisible(true);
            }}
          >
            {t('编辑')}
          </Button>
          <Button type="dashed" danger onClick={() => handleDel(row.id)}>
            {t('删除')}
          </Button>
        </TableActions>
      ),
    },
  ];
  async function getRoles() {
    // 获取角色列表
    const res = await roleService.fetchAllRoles();
    setRoles(res.list);
  }
  useEffect(() => {
    getRoles();
  }, []);
  return (
    <div>
      {/* 垂直 */}
      <Form form={form} layout="inline" style={{ marginBottom: 16 }}>
        <Form.Item label={t('手机号')} name="phone">
          <Input />
        </Form.Item>
        <Form.Item label={t('邮箱')} name="email">
          <Input />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" onClick={submit}>
            {t('搜索')}
          </Button>
        </Form.Item>
        <Form.Item>
          <Button onClick={reset}>{t('重置')}</Button>
        </Form.Item>
      </Form>
      <Row>
        <Button type="primary" onClick={() => setAddVisible(true)}>
          {t('新增')}
        </Button>
      </Row>
      <Table columns={columns} rowKey="id" {...tableProps} />
      <AddModal
        roles={roles}
        record={record}
        visible={addVisible}
        onOk={(values) => handleOK(values)}
        onCancel={() => {
          setAddVisible(false);
          setRecord(undefined);
        }}
      />
    </div>
  );
}
