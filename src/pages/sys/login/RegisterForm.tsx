import { useMutation } from '@tanstack/react-query';
import { Button, Form, Input, Space, Statistic, message } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import userService from '@/api/services/userService';

import { ReturnButton } from './components/ReturnButton';
import { LoginStateEnum, useLoginStateContext } from './providers/LoginStateProvider';

const { Countdown } = Statistic;
function RegisterForm() {
  const [form] = Form.useForm();
  const [isCountdown, setIsCountdown] = useState(false);
  const { t } = useTranslation();
  const signUpMutation = useMutation(userService.signup);
  const sendCodeMutation = useMutation(userService.sendCode);

  const { loginState, backToLogin } = useLoginStateContext();
  if (loginState !== LoginStateEnum.REGISTER) return null;

  const onFinish = async (values: any) => {
    console.log('Received values of form: ', values);
    await signUpMutation.mutateAsync(values);
    // backToLogin();
  };
  function handleClick() {
    // 验证邮箱是否存在
    form.validateFields(['email']).then(async () => {
      const email = form.getFieldValue('email');
      await sendCodeMutation.mutateAsync(email);
      message.success('验证码发送成功');
      setIsCountdown(true);
    });
  }
  return (
    <>
      <div className="mb-4 text-2xl font-bold xl:text-3xl">{t('sys.login.signUpFormTitle')}</div>
      <Form form={form} size="large" initialValues={{ remember: true }} onFinish={onFinish}>
        <Form.Item
          name="email"
          rules={[{ required: true, message: t('sys.login.emaildPlaceholder') }]}
        >
          <Input placeholder={t('sys.login.email')} />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: t('sys.login.passwordPlaceholder') }]}
        >
          <Input.Password type="password" placeholder={t('sys.login.password')} />
        </Form.Item>
        <Form.Item
          name="code"
          rules={[
            { required: true, message: '请输入验证码' },
            {
              pattern: /^\d{6}$/,
              message: '验证码格式不正确',
            },
          ]}
        >
          <Space.Compact style={{ width: '100%' }}>
            <Input placeholder="请输入验证码" />
            <Button type="primary" onClick={() => handleClick()} disabled={isCountdown}>
              {isCountdown ? (
                <Countdown
                  format="mm:ss"
                  valueStyle={{
                    lineHeight: 1,
                    color: 'rgba(0, 0, 0, 0.25)',
                    fontSize: 16,
                  }}
                  value={Date.now() + 60 * 1000}
                  onFinish={() => setIsCountdown(false)}
                />
              ) : (
                '发送验证码'
              )}
            </Button>
          </Space.Compact>
        </Form.Item>
        {/* <Countdown title="Countdown" value={Date.now() + 10 * 1000} onChange={() => {}} /> */}
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
          <Button type="primary" htmlType="submit" className="w-full">
            {t('sys.login.registerButton')}
          </Button>
        </Form.Item>

        <div className="mb-2 text-xs text-gray">
          <span>{t('sys.login.registerAndAgree')}</span>
          <a href="./" className="text-sm !underline">
            {t('sys.login.termsOfService')}
          </a>
          {' & '}
          <a href="./" className="text-sm !underline">
            {t('sys.login.privacyPolicy')}
          </a>
        </div>

        <ReturnButton onClick={backToLogin} />
      </Form>
    </>
  );
}

export default RegisterForm;
