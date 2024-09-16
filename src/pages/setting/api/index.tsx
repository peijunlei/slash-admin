import { useAntdTable } from 'ahooks';
import { Button, Form, Input, Modal, Row, Select, Table, TableColumnsType } from 'antd';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import apiService from '@/api/services/apiService';
import AuthWrapper from '@/components/AuthWrapper';
import TableActions from '@/components/table-actions';

import AddModal from './add-modal';

import { Api } from '#/entity';
import { ApiMethod } from '#/enum';

export default function CustomerList() {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [addVisible, setAddVisible] = useState(false);
  const [record, setRecord] = useState();

  const { tableProps, search } = useAntdTable(getTableData, {
    defaultPageSize: 10,
    form,
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
  async function handleOK(values: any) {
    values.id ? await apiService.updateApi(values.id, values) : await apiService.addApi(values);
    submit();
  }
  async function handleDel(id) {
    Modal.confirm({
      title: t('删除'),
      content: t('确定删除吗？'),
      onOk: async () => {
        await apiService.delApi(id);
        submit();
      },
    });
  }
  const columns: TableColumnsType<Api> = [
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
    {
      title: t('操作'),
      key: 'action',
      render: (row) => (
        <TableActions>
          <Button
            type="link"
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
      ),
    },
  ];
  useEffect(() => {}, []);
  return (
    <AuthWrapper funcCode="f_user_view">
      {/* 垂直 */}
      <Form
        form={form}
        layout="inline"
        style={{ marginBottom: 16 }}
        initialValues={{
          method: null,
        }}
      >
        <Form.Item<Api> label="接口名称" name="apiName">
          <Input />
        </Form.Item>
        <Form.Item<Api> label="接口地址" name="apiUrl">
          <Input />
        </Form.Item>
        <Form.Item<Api> label="请求方式" name="method">
          <Select
            placeholder="请选择请求方式"
            style={{ width: 120 }}
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
