import { useAntdTable } from 'ahooks';
import { Button, Form, Input, Modal, Row, Table } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import userService from '@/api/services/userService';
import AuthWrapper from '@/components/AuthWrapper';
import TableActions from '@/components/table-actions';

import AddModal from './add-modal';

import type { TableProps } from 'antd';

export default function CustomerList() {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [addVisible, setAddVisible] = useState(false);
  const [record, setRecord] = useState<IUser>();

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
  async function handleDel(id: string) {
    Modal.confirm({
      title: t('删除'),
      content: t('确定删除吗？'),
      onOk: async () => {
        await userService.delUser(id);
        submit();
      },
    });
  }
  const columns: TableProps<IUser>['columns'] = [
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
      dataIndex: 'roles',
      render: (roles: IUser['roles']) => {
        return roles?.map((item) => item.name).join(',');
      },
    },
    {
      title: t('身份'),
      dataIndex: 'role',
    },
    {
      title: t('操作'),
      key: 'action',
      render: (_, row) => {
        if (row.role === 'admin') {
          return null;
        }
        return (
          <TableActions>
            <Button
              type="link"
              onClick={() => {
                setAddVisible(true);
                setRecord({
                  ...row,
                  // @ts-ignore
                  disabled: true,
                });
              }}
            >
              {t('查看')}
            </Button>
            <AuthWrapper funcCode="f_user_edit">
              <Button
                type="link"
                onClick={() => {
                  setRecord(row);
                  setAddVisible(true);
                }}
              >
                {t('编辑')}
              </Button>
            </AuthWrapper>
            <AuthWrapper funcCode="f_user_del">
              <Button type="link" danger onClick={() => handleDel(row.id)}>
                {t('删除')}
              </Button>
            </AuthWrapper>
          </TableActions>
        );
      },
    },
  ];
  return (
    <AuthWrapper funcCode="f_user_view">
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
        <AuthWrapper funcCode="f_user_add">
          <Button type="primary" onClick={() => setAddVisible(true)}>
            {t('新增')}
          </Button>
        </AuthWrapper>
      </Row>
      <Table columns={columns} rowKey="id" {...tableProps} />
      <AddModal
        record={record}
        visible={addVisible}
        onOk={(values) => handleOK(values)}
        onCancel={() => {
          setAddVisible(false);
          setRecord(undefined);
        }}
      />
    </AuthWrapper>
  );
}
