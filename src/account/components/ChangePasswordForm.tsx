import React, { useState } from 'react';
import { observer } from 'mobx-react';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import {
  Form, Input, Button, Checkbox, message
} from 'antd';

interface Props {
  onSubmit: (dto: { oldPassword: string, newPassword: string }) => Promise<any>;
}


const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 },
  },
};

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 18,
      offset: 4,
    },
  },
};


const ChangePasswordForm: React.FunctionComponent<Props> = observer((props) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (values: any) => {
    setLoading(true)
    props.onSubmit({ 
      oldPassword: values.oldPassword,
      newPassword: values.newPassword,
    }).finally(() => {
      setLoading(false)
    });
  }

  return (
    <Form
      {...formItemLayout}
      name="change-password-form"
      onFinish={handleSubmit}
    >
      <Form.Item
        label="旧密码"
        name="oldPassword"
        rules={[
          { required: true, message: '请输入旧密码' },
          { min: 5, message: "密码最小5个字符" },
        ]}
      >
        <Input prefix={<LockOutlined />} type="password" placeholder="请输入旧密码" />
      </Form.Item>

      <Form.Item
        label="新密码"
        name="newPassword"
        rules={[
          { required: true, message: '请输入新密码' },
          { min: 5, message: "密码最小5个字符" },
        ]}
      >
        <Input prefix={<LockOutlined />} type="password" placeholder="请输入新密码" />
      </Form.Item>
      <Form.Item
        label="确认新密码"
        name="confirmPassword"
        rules={[
          { required: true, message: '请再次输入你的新密码' },
          { min: 5, message: "密码最小5个字符" },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('newPassword') === value) {
                return Promise.resolve();
              }
              return Promise.reject('两次输入的密码不一致!');
            },
          }),
        ]}
      >
        <Input prefix={<LockOutlined />} type="password" placeholder="请再次输入密码" />
      </Form.Item>
      

      <Form.Item  {...tailFormItemLayout} style={{ marginBottom: 0 }}>
        <Button block type="primary" htmlType="submit" className="login-form-button" loading={loading}>
          重置密码
        </Button>
      </Form.Item>
    </Form>
  );
});

export default ChangePasswordForm;
