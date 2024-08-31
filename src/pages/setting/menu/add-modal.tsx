import { Form, Input, InputNumber, Modal, Radio } from 'antd';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { MENU_TYPE_ENUM } from '@/utils/constant';

import { Menu } from '#/entity';

interface AddModalProps {
  visible: boolean;
  parentId?: string;
  record?: Menu;
  onOk: (values: any) => Promise<void>;
  onCancel: () => void;
}
function AddModal({ visible, record, parentId, onOk, onCancel }: AddModalProps) {
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
    if (visible) {
      form.resetFields();
    }
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
        initialValues={
          record || {
            type: parentId ? MENU_TYPE_ENUM[1].value : MENU_TYPE_ENUM[0].value,
            order: 0,
            parentId,
          }
        }
      >
        <Form.Item<Menu> name="id" noStyle>
          <Input type="hidden" />
        </Form.Item>
        <Form.Item<Menu> name="parentId" noStyle>
          <Input type="hidden" />
        </Form.Item>
        <Form.Item<Menu> label={t('类型')} name="type">
          <Radio.Group options={MENU_TYPE_ENUM} disabled={!!record?.id || !!parentId} />
        </Form.Item>
        <Form.Item<Menu>
          label={t('菜单名称')}
          name="label"
          rules={[
            {
              required: true,
              whitespace: true,
              message: t('请输入菜单名称'),
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item<Menu>
          label={t('路由')}
          name="route"
          rules={[{ required: true, whitespace: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          noStyle
          shouldUpdate={(prevValues, currentValues) => prevValues.type !== currentValues.type}
        >
          {({ getFieldValue }) =>
            getFieldValue('type') === 0 ? (
              <Form.Item label={t('图标')} name="icon">
                <Input />
              </Form.Item>
            ) : null
          }
        </Form.Item>
        <Form.Item<Menu> label={t('排序')} name="order" rules={[{ required: true }]}>
          <InputNumber min={0} max={99} />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default AddModal;
