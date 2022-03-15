import React, { useState } from "react";
import { observer } from "mobx-react";
import { Select } from '@/lib/antd';
import { Button, Input, InputNumber, Form } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import {
  FormImageUploader,
  UploadFile,
  FormAliyunOSSUpload,
} from "@/shared/components/Uploader";
import { LanguageCodes, LanguageCodes_MAP } from '@/utils/language';
import TagSelect from "@/shared/components/TagSelect";
import TagStore from '@/shared/stores/TagStore';
import { DEFAULT_COVER_URL } from "@/shared/constants";
import { IModDto } from "@/interfaces/shared/api";
import { editModDto } from "../stores/ModuleStore";
import styles from "./ModuleEditForm.module.less";
const { Option } = Select;

interface IProps {
  mod?: IModDto;
  onSave: (dto: Partial<editModDto>) => Promise<any>;
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

const ModuleEditForm: React.FunctionComponent<IProps> = observer(({
  mod,
  btnText = '保存',
  ...props
}) => {
  console.log(TagStore.ruleTags)
  const [saving, setSaving] = useState(false);

  const handleSubmit = (values: any) => {
    setSaving(true);
    props.onSave({
      title: values.title,
      alias: values.alias,
      description: values.description,
      coverUrl: values.coverUrl[0],
      imageUrls: values.imageUrls,
      playerNumber: [values.minPlayer, values.maxPlayer],
      moduleRule: values.moduleRule,
      languages: values.languages,
      modFiles: values.modFiles.map((f: UploadFile) => ({ ...f, url: f.url || "" })),
      tags: values.tags,
    }).finally(() => {
      setSaving(false);
    })
  }

  return (
    <Form 
      {...formItemLayout}
      onFinish={handleSubmit}
      initialValues={
        mod 
        ? {
          title: mod.title,
          originTitle: mod.originTitle,
          alias: mod.alias,
          description: mod.description,
          coverUrl: mod.coverUrl !== DEFAULT_COVER_URL ? [mod.coverUrl] : [],
          imageUrls: mod.imageUrls || [],
          minPlayer: mod.playerNumber[0],
          maxPlayer: mod.playerNumber[1],
          moduleRule: mod.moduleRule,
          languages: mod.languages,
          modFiles: mod.modFiles.map((file) => ({
            ...file,
            uid: file.name,
          })),
          tags: mod.tags,
        } 
        : {}
      }
    >
      <Form.Item label="模组封面" tooltip='比例3:4' name="coverUrl">
        <FormImageUploader multiple={false} rename compress />
      </Form.Item>
      <Form.Item 
        label="模组名"
        name="title"
        required
        rules={[
          {
            required: true,
            message: '请填写模组名称',
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item label="别名" tooltip='用于搜索，多个使用空格分割' name="alias">
        <Input />
      </Form.Item>
      <Form.Item label="模组文件" name="modFiles" required
        rules={[
          {
            required: true,
            message: '请上传模组文件',
          },
        ]}
      >
         <FormAliyunOSSUpload>
          <Button icon={<UploadOutlined />}>上传</Button>
        </FormAliyunOSSUpload>
      </Form.Item>


      <Form.Item label="应用规则" name="moduleRule" required
        rules={[
          {
            required: true,
            message: '请填写模组规则',
          },
        ]}
      >
        <Select
          placeholder="应用规则"
          loading={!TagStore.initialized}
        >
          {TagStore.ruleTags.map(rule => (
            <Option key={rule.name} value={rule.name}>
              {rule.name}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item label="语言" name="languages" tooltip='可多选'>
        <Select
          placeholder="语言"
          mode='multiple'
        >
          {(Object.keys(LanguageCodes_MAP) as Array<LanguageCodes>).map(language => (
            <Option key={language} value={language}>
              {LanguageCodes_MAP[language]}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item label="玩家数" >
        <Input.Group compact>
          <Form.Item name="minPlayer" style={{ marginBottom: 0 }}>
            <InputNumber placeholder={'0'} min={0} className={styles.inputGroupLeft} />
          </Form.Item>
          <Input
            className={styles.inputGroupSplit}
            style={{
              width: 30,
              borderLeft: 0,
              borderRight: 0,
              pointerEvents: 'none',
            }}
            placeholder="~"
            disabled
          />
          <Form.Item name="maxPlayer" style={{ marginBottom: 0 }}>
            <InputNumber placeholder={'0'} min={0} className={styles.inputGroupRight} />
          </Form.Item>
        </Input.Group>
      </Form.Item>
      <Form.Item label="标签" name="tags">
        <TagSelect 
          style={{ minWidth: 200 }}
          recommendTagOptions={TagStore.recommendTags}
        />
      </Form.Item>
  
      <Form.Item label="模组简介" name="description">
        <Input.TextArea rows={6} />
      </Form.Item>

      <Form.Item label="模组相簿" name="imageUrls">
        <FormImageUploader multiple rename compress />
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
});

export default ModuleEditForm;
