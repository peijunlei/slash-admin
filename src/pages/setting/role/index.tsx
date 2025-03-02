import { useAntdTable, useRequest } from 'ahooks';
import { Button, Table, Form, Modal, Input, Row, message } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';

import menuService from '@/api/services/menuService';
import roleService from '@/api/services/roleService';
import AuthWrapper from '@/components/AuthWrapper';
import TableActions from '@/components/table-actions';
import { useRouter } from '@/router/hooks';
import { arryToTree } from '@/utils';

import useStore from './store';

import type { TableProps } from 'antd';

export default function IndexPage() {
  const { push } = useRouter();
  const { data } = useRequest(menuService.fetchAllMenus);
  const { list: allMenus } = data || { list: [] };
  const allChildKeys = useMemo(() => {
    const arr = allMenus.filter((v) => v.type !== 0).map((v) => v.id);
    return arr;
  }, [allMenus]);
  const treeData = useMemo(() => {
    return arryToTree(allMenus);
  }, [allMenus]);
  const [checkedKeys, setCheckedKeys] = useState<string[]>([]);
  const [allKeys, setAllKeys] = useState<string[]>([]);
  const { addVisible, record } = useStore(
    useShallow((state) => ({
      addVisible: state.addVisible,
      record: state.record,
    })),
  );
  const setAddVisible = useStore((state) => state.actions.setAddVisible);
  const setRecord = useStore((state) => state.actions.setRecord);
  const [form] = Form.useForm();
  const { tableProps, search } = useAntdTable(roleService.fetchAllRoles, {
    defaultPageSize: 10,
  });
  const { submit } = search;
  function handleOK() {
    form.validateFields().then(async (values) => {
      const newValue = { ...values, menus: [] };
      newValue.id
        ? await roleService.updateRole(newValue.id, newValue)
        : await roleService.addRole(newValue);
      setAddVisible(false);
      setRecord(null);
      message.success('操作成功');
      submit();
    });
  }
  async function handleDel(id: string) {
    Modal.confirm({
      title: '删除',
      content: '确定删除吗？',
      onOk: async () => {
        await roleService.delRole(id);
        message.success('删除成功');
        submit();
      },
    });
  }
  const columns: TableProps<IRole>['columns'] = [
    {
      title: '角色名称',
      dataIndex: 'name',
    },
    {
      title: '描述',
      dataIndex: 'description',
    },
    {
      title: '操作',
      width: 200,
      key: 'action',
      render: (_, row) => {
        return (
          <TableActions>
            <AuthWrapper funcCode="f_role_edit">
              <Button
                type="link"
                onClick={() => {
                  setAddVisible(true);
                  const keys = row.menus.filter((v) => allChildKeys.includes(v));
                  setCheckedKeys(keys);
                  setAllKeys(row.menus);
                  form.setFieldsValue({
                    id: row.id,
                    name: row.name,
                    description: row.description,
                    menus: row.menus,
                  });
                }}
              >
                编辑
              </Button>
            </AuthWrapper>
            <AuthWrapper funcCode="f_role_link_menu">
              <Button
                type="link"
                onClick={() => {
                  push(`/setting/role-auth/${row.id}`);
                }}
              >
                设置权限
              </Button>
            </AuthWrapper>
            <AuthWrapper funcCode="f_role_del">
              <Button type="link" danger onClick={() => handleDel(row.id)}>
                删除
              </Button>
            </AuthWrapper>
          </TableActions>
        );
      },
    },
  ];
  useEffect(() => {}, []);
  return (
    <AuthWrapper funcCode="f_role_view">
      <div>
        <Row>
          <AuthWrapper funcCode="f_role_add">
            <Button
              type="primary"
              onClick={() => {
                setAddVisible(true);
                form.resetFields();
              }}
            >
              新增
            </Button>
          </AuthWrapper>
        </Row>
        <Table rowKey="id" columns={columns} {...tableProps} />
        <Modal
          title={record?.id ? '编辑' : '新增'}
          open={addVisible}
          maskClosable={false}
          onOk={() => handleOK()}
          onCancel={() => {
            setAddVisible(false);
            setCheckedKeys([]);
          }}
        >
          <Form form={form} labelCol={{ span: 4 }}>
            <Form.Item<IRole> name="id">
              <Input type="hidden" />
            </Form.Item>
            <Form.Item
              label="角色名称"
              name="name"
              rules={[{ required: true, message: '请输入角色名称', whitespace: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item label="描述" name="description">
              <Input.TextArea />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </AuthWrapper>
  );
}
