import { Form, Input, InputNumber, Modal } from 'antd';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface AddFuncModalProps {
  visible: boolean;
  menuId: string;
  record?: MenuFunc;
  onOk: (values: any) => Promise<void>;
  onCancel: () => void;
}
function AddFuncModal({ visible, menuId, record, onOk, onCancel }: AddFuncModalProps) {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const handleOK = () => {
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
  console.log('AddFuncModal', record);
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
            menuId,
          }
        }
      >
        <Form.Item<IFunc> name="id" noStyle>
          <Input type="hidden" />
        </Form.Item>
        <Form.Item<IFunc> name="menuId" noStyle>
          <Input type="hidden" />
        </Form.Item>
        <Form.Item<IFunc>
          label={t('功能名称')}
          name="functionName"
          rules={[{ required: true, message: t('请输入功能名称') }]}
        >
          <Input />
        </Form.Item>
        <Form.Item<IFunc>
          label={t('功能编码')}
          name="functionCode"
          rules={[
            { required: true, message: t('请输入功能编码') },
            { pattern: /^[a-zA-Z0-9_]+$/, message: t('功能编码只能包含字母、数字、下划线') },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item<IFunc> label={t('排序')} name="order" rules={[{ required: true }]}>
          <InputNumber min={0} max={99} />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default AddFuncModal;
