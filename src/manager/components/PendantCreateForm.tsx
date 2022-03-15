
import React, { Component, useState } from 'react';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { OSSUpload } from "@/shared/components/Uploader";
import AuthStore from '@/shared/stores/AuthStore';
import { PendantFormItem } from './PendantFormItem';
import {
  Form, Input, Button, Checkbox, message
} from 'antd';


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

interface IPendant {

}

interface IProps {
  pendant?: IPendant;
  onSubmit: (dto: { name: string, url: string }) => Promise<any>;
}

export const PendantCreateForm: React.FC<IProps> = (props) => {
  // const [loading, setLoading] = useState(false);

  const handleSubmit = (values: any) => {
    props.onSubmit({ 
      name: values.name,
      url: values.url,
    })
  }

  return (
    <Form
      {...formItemLayout}
      onFinish={handleSubmit}
    >
      <Form.Item
        label="头像框名称"
        name="name"
        rules={[
          { required: true, message: "请填写头像框的名字!" },
        ]}
      >
        <Input placeholder="请输入头像框的名字" />
      </Form.Item>

      <Form.Item
        label="头像框"
        name="url"
        rules={[
          { required: true, message: "请上传头像框!" },
        ]}
      >
        <PendantFormItem />
      </Form.Item>
      <Form.Item  {...tailFormItemLayout} style={{ marginBottom: 0 }}>
        {props.children}
        {/* <Button block type="primary" htmlType="submit" className="login-form-button" loading={loading}>
          
        </Button> */}
      </Form.Item>
    </Form>
  );
}
