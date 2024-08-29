import { useAntdTable } from 'ahooks';
import { Button, Table, Form, Modal, Input, Row, message, Tree } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';

import TableActions from '@/components/table-actions';
import { getAllMenus } from '@/utils';
import { arrayToTree } from '@/utils/tree';

import { fetchRoles, updateRole, addRole, delRole } from './api';
import useStore from './store';

const allMenus = getAllMenus();

export default function IndexPage() {
  const allChildKeys = useMemo(() => {
    const arr = allMenus.filter((v) => v.type !== 0).map((v) => v.id);
    return arr;
  }, []);
  const treeData = useMemo(() => {
    return arrayToTree(allMenus);
  }, []);
  const [checkedKeys, setCheckedKeys] = useState([]);
  const [allKeys, setAllKeys] = useState([]);
  const { addVisible, record } = useStore(
    useShallow((state) => ({
      addVisible: state.addVisible,
      record: state.record,
    })),
  );
  const setAddVisible = useStore((state) => state.actions.setAddVisible);
  const setRecord = useStore((state) => state.actions.setRecord);
  const [form] = Form.useForm();
  const { tableProps, search } = useAntdTable(getTableData, {
    defaultPageSize: 10,
  });
  const { submit } = search;
  async function getTableData() {
    const res = await fetchRoles();
    return res;
  }
  function handleOK() {
    form.validateFields().then(async (values) => {
      if (checkedKeys.length === 0) {
        message.error('请选择菜单权限');
        return;
      }
      const newValue = { ...values, menus: allKeys };
      newValue.id ? await updateRole(newValue.id, newValue) : await addRole(newValue);
      setAddVisible(false);
      setRecord(null);
      message.success('操作成功');
      submit();
    });
  }
  async function handleDel(id) {
    Modal.confirm({
      title: '删除',
      content: '确定删除吗？',
      onOk: async () => {
        await delRole(id);
        message.success('删除成功');
        submit();
      },
    });
  }
  const columns = [
    {
      title: '角色名称',
      dataIndex: 'name',
    },
    {
      title: '操作',
      width: 200,
      key: 'action',
      render: (row) => {
        return (
          <TableActions>
            <Button
              type="dashed"
              onClick={() => {
                setAddVisible(true);
                const keys = row.menus.filter((v) => allChildKeys.includes(v));
                setCheckedKeys(keys);
                setAllKeys(row.menus);
                form.setFieldsValue({
                  id: row.id,
                  name: row.name,
                  menus: row.menus,
                });
              }}
            >
              编辑
            </Button>
            <Button type="dashed" danger onClick={() => handleDel(row.id)}>
              删除
            </Button>
          </TableActions>
        );
      },
    },
  ];
  useEffect(() => {}, []);
  return (
    <div>
      <Row>
        <Button
          type="primary"
          onClick={() => {
            setAddVisible(true);
            form.resetFields();
          }}
        >
          新增
        </Button>
      </Row>
      <Table rowKey="id" columns={columns} {...tableProps} />
      <Modal
        title="添加角色"
        open={addVisible}
        maskClosable={false}
        onOk={() => handleOK()}
        onCancel={() => {
          setAddVisible(false);
          setCheckedKeys([]);
        }}
      >
        <Form form={form}>
          <Form.Item name="id">
            <Input type="hidden" />
          </Form.Item>
          <Form.Item
            label="角色名称"
            name="name"
            rules={[{ required: true, message: '请输入角色名称', whitespace: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="菜单权限" name="menus" required>
            <Tree
              checkable
              defaultExpandAll
              onCheck={(keys, e) => {
                const newKeys = (keys as string[]).concat(e.halfCheckedKeys);
                setCheckedKeys(keys);
                setAllKeys(newKeys);
              }}
              checkedKeys={checkedKeys}
              treeData={treeData}
              fieldNames={{
                key: 'id',
                children: 'children',
                title: 'label',
              }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
