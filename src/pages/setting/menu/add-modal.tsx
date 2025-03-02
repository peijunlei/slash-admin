import { Form, Input, InputNumber, Modal, Radio } from 'antd';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { MENU_TYPE_ENUM } from './type';

import { MenuType } from '#/enum';

interface Record extends MenuFunc {
  isView?: boolean;
}
interface AddModalProps {
  visible: boolean;
  parentId?: string;
  record?: Record;
  onOk: (values: any) => Promise<void>;
  onCancel: () => void;
}
function AddModal({ visible, record, parentId, onOk, onCancel }: AddModalProps) {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const handleOK = () => {
    if (record?.isView) {
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
  if (!visible) return null;
  return (
    <Modal
      title={record?.isView ? '查看' : record?.id ? '编辑' : '新增'}
      open={visible}
      maskClosable={false}
      confirmLoading={loading}
      onOk={handleOK}
      onCancel={onCancel}
    >
      <Form
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
        form={form}
        initialValues={
          record || {
            type: parentId ? MenuType.SECOND_MENU : MenuType.FIRST_MENU,
            order: 0,
            parentId,
          }
        }
      >
        <Form.Item<Record> name="id" noStyle>
          <Input type="hidden" />
        </Form.Item>
        <Form.Item<Record> name="parentId" noStyle>
          <Input type="hidden" />
        </Form.Item>
        <Form.Item<Record> label={t('类型')} name="type">
          <Radio.Group options={MENU_TYPE_ENUM} disabled={!!record?.id || !!parentId} />
        </Form.Item>
        <Form.Item<Record>
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
        <Form.Item<Record>
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
            getFieldValue('type') === 0 && (
              <Form.Item label={t('图标')} name="icon">
                <Input />
              </Form.Item>
            )
          }
        </Form.Item>
        <Form.Item<Record> label={t('排序')} name="order" rules={[{ required: true }]}>
          <InputNumber min={0} max={99} />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default AddModal;
