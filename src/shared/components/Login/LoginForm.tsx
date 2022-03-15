import React, { useState } from 'react';
import { observer } from 'mobx-react';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import {
  Form, Input, Button, Checkbox, message
} from 'antd';
import './styles.less';

interface Props {
  loading?: boolean;
  email?: string;
  onLogin: (email: string, password: string, remember: boolean) => Promise<any>;
  onForget: Function;
}

const LoginForm: React.FunctionComponent<Props> = observer((props) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (values: any) => {
    setLoading(true)
    props.onLogin(values.Email, values.Password, values.remember).finally(() => {
      setLoading(false)
    });
  }

  return (
    <Form
      className="login-form"
      name="login-form"
      onFinish={handleSubmit}
    >
      <Form.Item
        name="Email"
        rules={[{ required: true, message: '请输入你的电子邮箱!' }]}
      >
        <Input prefix={<UserOutlined />} type="email" placeholder="Email" />
      </Form.Item>
      <Form.Item
        name="Password"
        rules={[{ required: true, message: '请输入你的密码!' }]}
      >
        <Input prefix={<LockOutlined />} type="password" placeholder="Password" />
      </Form.Item>
      <Form.Item style={{ marginBottom: 16 }}>
        <Form.Item
          name="remember"
          valuePropName="checked"
          initialValue={true}
          style={{ float: 'left', marginBottom: 0 }}
        >
          <Checkbox style={{ userSelect: 'none' }}>记住我</Checkbox>
        </Form.Item>

        <Form.Item style={{ float: 'right', marginBottom: 0 }}>
          <Button type='link' style={{ padding: 0 }} onClick={() => props.onForget()}>
            忘记密码
          </Button>
        </Form.Item>
      </Form.Item>

      <Form.Item style={{ marginBottom: 0 }}>
        <Button block type="primary" htmlType="submit" className="login-form-button" loading={loading}>
          登录
        </Button>
      </Form.Item>
    </Form>
  );
});

export default LoginForm;
