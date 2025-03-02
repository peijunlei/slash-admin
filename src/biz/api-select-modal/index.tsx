import { useAntdTable } from 'ahooks';
import { Button, Form, Input, Modal, Select, Table, TableColumnsType } from 'antd';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import apiService from '@/api/services/apiService';

import { ApiMethod } from '#/enum';

interface ApiSelectModalProps {
  visible: boolean;
  selectKeys: string[];
  onOk: (values: string[]) => Promise<void>;
  onCancel: () => void;
}
function ApiSelectModal({ visible, selectKeys, onOk, onCancel }: ApiSelectModalProps) {
  const [keys, setKeys] = useState<string[]>([]);
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { tableProps, search, run } = useAntdTable(getTableData, {
    defaultPageSize: 10,
    form,
    manual: true,
  });
  const { submit, reset } = search;
  // @ts-ignore
  async function getTableData({ current, pageSize }, formData: Object) {
    const params = {
      pageNum: current,
      pageSize,
      ...formData,
    };
    const res = await apiService.fetchAllApis(params);
    return {
      total: res.total,
      list: res.list,
    };
  }
  const columns: TableColumnsType<IApi> = [
    {
      title: '接口名称',
      dataIndex: 'apiName',
    },
    {
      title: '接口地址',
      dataIndex: 'apiUrl',
    },
    {
      title: '请求方式',
      dataIndex: 'method',
    },
  ];
  useEffect(() => {
    if (visible) {
      run({ current: 1, pageSize: 10 }, {});
    } else {
      form.resetFields();
    }
  }, [visible, run, form]);
  useEffect(() => {
    setKeys(selectKeys);
  }, [selectKeys]);
  return (
    <Modal
      title="选择接口"
      open={visible}
      maskClosable={false}
      confirmLoading={loading}
      onOk={() => {
        setLoading(true);
        onOk(keys)
          .then(() => {
            onCancel();
            setLoading(false);
          })
          .catch(() => {
            setLoading(false);
          });
      }}
      onCancel={onCancel}
      width={1000}
    >
      <Form
        form={form}
        layout="inline"
        style={{ marginBottom: 16 }}
        initialValues={{
          method: null,
        }}
      >
        <Form.Item<IApi> label="接口名称" name="apiName">
          <Input />
        </Form.Item>
        <Form.Item<IApi> label="接口地址" name="apiUrl">
          <Input />
        </Form.Item>
        <Form.Item<IApi> label="请求方式" name="method">
          <Select
            placeholder="请选择请求方式"
            style={{ width: 120 }}
            allowClear
            options={[
              { label: 'GET', value: ApiMethod.GET },
              { label: 'POST', value: ApiMethod.POST },
              { label: 'PUT', value: ApiMethod.PUT },
              { label: 'DELETE', value: ApiMethod.DELETE },
            ]}
          />
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
      <Table
        columns={columns}
        rowKey="id"
        rowSelection={{
          selectedRowKeys: keys,
          onChange: (selectedRowKeys) => {
            setKeys(selectedRowKeys as string[]);
          },
        }}
        {...tableProps}
      />
    </Modal>
  );
}

export default ApiSelectModal;
