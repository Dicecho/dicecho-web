import TagSelect from "@/shared/components/TagSelect";
import { FormImageUploader } from "@/shared/components/Uploader";
import TagStore, { ITag, UpdateTagDto } from "@/shared/stores/TagStore";
// import { ModRule, ModRuleMap } from "../interfaces/ApiResponse";
import { Button, Form, Input } from "antd";
import _ from "lodash";
import { observer } from "mobx-react";
import React, { useState } from "react";

interface IProps {
  tag: ITag;
  onSave: (dto: Partial<UpdateTagDto>) => Promise<any>;
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

const ModuleEditForm: React.FunctionComponent<IProps> = observer(
  ({ tag, btnText = "保存", ...props }) => {
    const [saving, setSaving] = useState(false);

    const initialValues: any = {
      description: tag.description,
      coverUrl: tag.coverUrl !== "" ? [tag.coverUrl] : [],
      children: tag.children,
    };

    const getDto = (values: any) => {
      if (Object.keys(values).length === 0) {
        return {};
      }

      return {
        description: values.description,
        coverUrl: values.coverUrl[0],
        children: values.children,
      };
    };

    const handleSubmit = (values: any) => {
      setSaving(true);

      const initialDto: any = getDto(initialValues);
      const dto: any = getDto(values);

      const changedKeys = Object.keys(dto)
        .map((key) => ({ key, value: !_.isEqual(initialDto[key], dto[key]) }))
        .reduce((a, b) => (b.value ? [...a, b.key] : a), [] as string[]);

      props.onSave(_.pick(dto, changedKeys)).finally(() => {
        setSaving(false);
      });
    };

    return (
      <Form
        {...formItemLayout}
        onFinish={handleSubmit}
        initialValues={initialValues}
      >
        <Form.Item label="标签封面" tooltip="比例1:1" name="coverUrl">
          <FormImageUploader multiple={false} rename compress />
        </Form.Item>

        <Form.Item label="简介" name="description">
          <Input.TextArea rows={6} />
        </Form.Item>

        <Form.Item label="子标签" name="children">
          <TagSelect
            style={{ minWidth: 200 }}
            recommendTagOptions={TagStore.recommendTags}
          />
        </Form.Item>

        <Form.Item {...tailFormItemLayout} style={{ marginBottom: 0 }}>
          <Button block type="primary" loading={saving} htmlType="submit">
            {btnText}
          </Button>
        </Form.Item>
      </Form>
    );
  }
);

export default ModuleEditForm;
