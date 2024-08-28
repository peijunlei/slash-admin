import { useAntdTable } from 'ahooks';
import { Button, Form, Input, Table } from 'antd';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import userService from '@/api/services/userService';
import { useRouter } from '@/router/hooks';

export default function CustomerList() {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const { push } = useRouter();
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
      title: t('操作'),
      key: 'action',
      render: (row) => (
        <Button onClick={() => push(`/customer/customer-detail/${row.id}`)}>{t('查看')}</Button>
      ),
    },
  ];
  useEffect(() => {}, []);
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
      <Table columns={columns} rowKey="id" {...tableProps} />
    </div>
  );
}
