import { Button, Form, Input, message } from 'antd';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import authService from '@/api/services/authService';
import { SvgIcon } from '@/components/icon';
import { useParams, useRouter } from '@/router/hooks';

import { LoginStateEnum, useLoginStateContext } from './providers/LoginStateProvider';

function ResetForm() {
  const { push } = useRouter();
  const { token } = useParams();
  const [form] = Form.useForm();
  const onFinish = (values: any) => {
    console.log('Received values of form: ', values);
    authService.resetPassword({ token, ...values }).then((res) => {
      console.log(res);
      message.success('密码重置成功');
      // push('/login');
    });
  };

  const { t } = useTranslation();
  const { loginState, backToLogin } = useLoginStateContext();
  useEffect(() => {
    if (token) {
      authService.getUserByToken(token).then((res) => {
        form.setFieldsValue({
          email: res.email,
        });
      });
    }
  }, [token, form]);
  if (loginState !== LoginStateEnum.RESET_PASSWORD) return null;

  return (
    <>
      <div className="mb-8 text-center">
        <SvgIcon icon="ic-reset-password" size="100" />
      </div>
      <div className="mb-4 text-center text-2xl font-bold xl:text-3xl">
        {t('sys.login.forgetFormTitle')}
      </div>
      <Form name="normal_login" size="large" onFinish={onFinish} form={form}>
        <p className="mb-4 h-14 text-center text-gray">{t('sys.login.forgetFormSecondTitle')}</p>
        <Form.Item
          name="email"
          rules={[{ required: true, message: t('sys.login.emaildPlaceholder') }]}
        >
          <Input placeholder={t('sys.login.email')} disabled />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: t('sys.login.passwordPlaceholder') }]}
        >
          <Input.Password type="password" placeholder={t('sys.login.password')} />
        </Form.Item>
        <Form.Item
          name="passwordConfirm"
          rules={[
            { required: true, message: t('sys.login.confirmPasswordPlaceholder') },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error(t('sys.login.diffPwd')));
              },
            }),
          ]}
        >
          <Input.Password type="password" placeholder={t('sys.login.passwordConfirm')} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" className="w-full !bg-black">
            {t('提交')}
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}

export default ResetForm;
