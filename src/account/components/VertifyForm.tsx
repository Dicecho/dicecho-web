import React, { useState } from 'react';
import { observer } from 'mobx-react';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Input, Button, Form } from 'antd';
import { FormProps } from 'antd/lib/form';

interface Props extends FormProps {
  onSubmit: (nickname: string, password: string) => Promise<any>;
}

const VertifyForm: React.FunctionComponent<Props> = observer((props) => {
  const { onSubmit, ...formProps } = props;
  const [loading, setLoading] = useState(false);

  const handleSubmit = (values: any) => {
    setLoading(true);
    props.onSubmit(values.username, values.password).finally(() => {
      setLoading(false)
    });
  }

  return (
    <Form onFinish={handleSubmit} className="sigin-form" {...formProps}>
      <Form.Item
        name="username"
        rules={[
          { required: true, message: '请输入用户名!' },
          { min: 2, message: '用户名最小2个字符' },
        ]}
      >
        <Input prefix={<UserOutlined />} placeholder="请输入用户名" />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[
          { required: true, message: '请输入密码!' },
          { min: 5, message: '密码最小5个字符' },
        ]}
      >
        <Input prefix={<LockOutlined />} type="password" placeholder="请输入密码" />
      </Form.Item>
      <Form.Item
        name="confirm"
        rules={[
          { required: true, message: '请确认你的密码!' },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject('两次输入的密码不一致!');
            },
          }),
        ]}
      >
        <Input prefix={<LockOutlined />} type="password" placeholder="请再次输入密码" />
      </Form.Item>
      <div style={{ userSelect: 'none', marginBottom: 8 }}>
        注册即代表同意<a href='/notice/terms' target='_blank'>《骰声回响使用协议与条款》</a>
      </div>
      <Form.Item style={{ marginBottom: 0 }}>
        <Button block type="primary" htmlType="submit" loading={loading}>
          开始回响！
        </Button>
      </Form.Item>
    </Form>
  );
});

export default VertifyForm;
