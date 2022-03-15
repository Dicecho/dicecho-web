import React, { useState } from 'react';
import { observer } from 'mobx-react';
import { MailOutlined } from '@ant-design/icons';
import { Input, Button, Form } from 'antd';

interface Props {
  onForget: (email: string) => Promise<any>;
}

const ForgetForm: React.FunctionComponent<Props> = observer((props) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (values: any) => {
    setLoading(true)
    props.onForget(values.email).finally(() => {
      setLoading(false)
    });
  }

  return (
    <Form onFinish={handleSubmit} className="sigin-form">
      <Form.Item
        name="email"
        rules={[
          { type: 'email', message: '请输入正确的邮箱' },
          { required: true, message: '请输入邮箱!' },
        ]}
      >
        <Input prefix={<MailOutlined />} placeholder="请输入电子邮箱（Email）" />
      </Form.Item>
      <Form.Item style={{ marginBottom: 0 }}>
        <Button block type="primary" htmlType="submit" loading={loading}>
          重置密码
        </Button>
      </Form.Item>
    </Form>
  );
});

export default ForgetForm;
