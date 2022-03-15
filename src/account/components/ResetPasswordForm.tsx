import React, { useState } from "react";
import { observer } from "mobx-react";
import { LockOutlined } from "@ant-design/icons";
import { Input, Button, Form } from "antd";
import { FormProps } from 'antd/lib/form';

interface Props extends FormProps {
  onSend: (email: string) => Promise<any>;
}

const ResetPasswordForm: React.FunctionComponent<Props> = observer((props) => {
  const { onSend, ...formProps } = props;
  const [loading, setLoading] = useState(false);

  const handleSubmit = (values: any) => {
    setLoading(true);
    onSend(values.password).finally(() => {
      setLoading(false);
    });
  };

  return (
    <Form onFinish={handleSubmit} className="sigin-form" {...formProps}>
      <Form.Item
        name="password"
        rules={[
          { required: true, message: "请输入密码!" },
          { min: 5, message: "密码最小5个字符" },
        ]}
      >
        <Input
          prefix={<LockOutlined />}
          type="password"
          placeholder="请输入密码"
        />
      </Form.Item>
      <Form.Item
        name="confirm"
        rules={[
          { required: true, message: "请确认你的密码!" },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue("password") === value) {
                return Promise.resolve();
              }
              return Promise.reject("两次输入的密码不一致!");
            },
          }),
        ]}
      >
        <Input
          prefix={<LockOutlined />}
          type="password"
          placeholder="请再次输入密码"
        />
      </Form.Item>
      <Form.Item style={{ marginBottom: 0 }}>
        <Button block type="primary" htmlType="submit" loading={loading}>
          重置密码
        </Button>
      </Form.Item>
    </Form>
  );
});

export default ResetPasswordForm;
