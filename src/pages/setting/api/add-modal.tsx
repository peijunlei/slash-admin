import { Form, Input, Modal, Radio } from 'antd';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Api } from '#/entity';
import { ApiMethod } from '#/enum';

interface AddModalProps {
  visible: boolean;
  record: any;
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
        <Form.Item<Api> name="id" noStyle>
          <Input type="hidden" />
        </Form.Item>
        {/* 手机号 */}
        <Form.Item<Api>
          label="接口名称"
          name="apiName"
          rules={[{ required: true, whitespace: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item<Api>
          label="接口地址"
          name="apiUrl"
          rules={[{ required: true, whitespace: true }]}
        >
          <Input />
        </Form.Item>
        {/* 角色  roleIds */}
        <Form.Item<Api> label="请求方式" name="method">
          <Radio.Group
            options={[
              {
                label: 'GET',
                value: ApiMethod.GET,
              },
              {
                label: 'POST',
                value: ApiMethod.POST,
              },
              {
                label: 'PUT',
                value: ApiMethod.PUT,
              },
              {
                label: 'DELETE',
                value: ApiMethod.DELETE,
              },
            ]}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default AddModal;
