import { useAntdTable } from 'ahooks';
import { Button, Form, Input, Table } from 'antd';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import userService from '@/api/services/userService';

function CustomerList() {
  const { t } = useTranslation();
  const [form] = Form.useForm();
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
      dataIndex: 'action',
      key: 'action',
      render: () => <Button>{t('查看')}</Button>,
    },
  ];
  useEffect(() => {}, []);
  return (
    <div>
      <Form form={form} layout="inline">
        <Form.Item label={t('手机号')} name="phone">
          <Input />
        </Form.Item>
        <Form.Item label={t('邮箱')} name="email">
          <Input addonAfter=".com" />
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
export default CustomerList;
