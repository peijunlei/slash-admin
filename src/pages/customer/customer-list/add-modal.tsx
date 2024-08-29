import { Form, Input, Modal, Select } from 'antd';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { phoneReg } from '@/utils/validate';

interface AddModalProps {
  visible: boolean;
  record: any;
  roles: any[];
  onOk: (values: any) => Promise<void>;
  onCancel: () => void;
}
function AddModal({ visible, record, roles, onOk, onCancel }: AddModalProps) {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const handleOK = () => {
    if (record?.disabled) {
      onCancel();
      return;
    }
    form.validateFields().then(async (values) => {
      setLoading(true);
      onOk(values)
        .then(() => {
          onCancel();
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    });
  };

  useEffect(() => {
    form.resetFields();
  }, [visible, form]);
  if (!visible) return null; // Add this line
  return (
    <Modal
      title={t('新增')}
      open={visible}
      maskClosable={false}
      confirmLoading={loading}
      onOk={() => handleOK()}
      onCancel={() => {
        onCancel();
      }}
    >
      <Form
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
        form={form}
        initialValues={record}
        disabled={!!record?.disabled}
      >
        <Form.Item name="id" noStyle>
          <Input type="hidden" />
        </Form.Item>
        {/* 手机号 */}
        <Form.Item label={t('手机号')} name="phone" rules={[{ pattern: phoneReg }]}>
          <Input />
        </Form.Item>
        <Form.Item label={t('邮箱')} name="email" rules={[{ required: true, whitespace: true }]}>
          <Input />
        </Form.Item>
        {/* 角色  roleIds */}
        <Form.Item label={t('角色')} name="roleIds">
          <Select
            mode="multiple"
            placeholder={t('请选择角色')}
            options={roles.map((item) => ({ label: item.name, value: item.id }))}
          />
        </Form.Item>
        {record?.id ? null : (
          <>
            <Form.Item
              label={t('密码')}
              name="password"
              rules={[{ required: true, whitespace: true }]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item
              label={t('确认密码')}
              name="passwordConfirm"
              rules={[
                { required: true, whitespace: true },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('两次密码不一致'));
                  },
                }),
              ]}
            >
              <Input.Password />
            </Form.Item>
          </>
        )}
      </Form>
    </Modal>
  );
}

export default AddModal;
