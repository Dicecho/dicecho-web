import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react';
import { Button, Input, Switch, Form } from 'antd';
import { FormImageUploader } from "@/shared/components/Uploader";
import { ICollectionDto, UpdateCollectionDto, AccessLevel } from '../store/CollectionStore'
import _ from 'lodash';

interface IProps {
  collection: ICollectionDto;
  onSave: (dto: Partial<UpdateCollectionDto>) => Promise<any>;
  btnText?: string;
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

const CollectionUpdateForm: React.FunctionComponent<IProps> = observer(({
  collection,
  btnText = '保存',
  ...props
}) => {
  // const { mod, btnText = '' } = props;
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm();

  const initialValues = {
    name: collection.name,
    coverUrl: collection.coverUrl ? [collection.coverUrl] : [],
    description: collection.description,
    isPublic: collection.accessLevel === AccessLevel.Public,
  }

  useEffect(() => {
    console.log(initialValues)
    form.setFieldsValue(initialValues)
   }, [form, collection._id])

  const getDto = (values: any) => {
    if (Object.keys(values).length === 0) {
      return {}
    }

    return {
      name: values.name,
      coverUrl: values.coverUrl ? values.coverUrl[0] : '',
      description: values.description,
      accessLevel: values.isPublic ? AccessLevel.Public : AccessLevel.Private,
    }
  }

  const handleSubmit = (values: any) => {
    setSaving(true);

    const initialDto: any = getDto(initialValues)
    const dto: any = getDto(values)

    const changedKeys = Object.keys(dto)
      .map((key) => ({ key, value: !_.isEqual(initialDto[key], dto[key]) }))
      .reduce((a, b) => b.value ? [...a, b.key] : a, [] as string[])

    props.onSave(_.pick(dto, changedKeys)).finally(() => {
      setSaving(false);
    })
  }

  return (
    <Form 
      {...formItemLayout}
      form={form}
      onFinish={handleSubmit}
      initialValues={initialValues}
    >
      <Form.Item label="收藏夹封面" name="coverUrl">
        <FormImageUploader multiple={false} rename compress />
      </Form.Item>
      <Form.Item label="名称" name="name" >
        <Input placeholder='收藏夹名称'/>
      </Form.Item>
      <Form.Item label="简介" name="description">
        <Input.TextArea rows={6} placeholder='在这里添加收藏夹简介'/>
      </Form.Item>

      <Form.Item label="是否公开" name="isPublic" valuePropName='checked'>
        <Switch />
      </Form.Item>

      <Form.Item {...tailFormItemLayout} style={{ marginBottom: 0 }}>
        <Button 
          block
          type="primary"
          loading={saving}
          htmlType="submit"
        >
          {btnText}
        </Button>
      </Form.Item>
    </Form>
  );
})

export default CollectionUpdateForm;
