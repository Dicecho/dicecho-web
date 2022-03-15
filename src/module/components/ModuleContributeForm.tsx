import React, { useState } from 'react';
import { observer } from 'mobx-react';
import { Select } from '@/lib/antd';
import { Button, DatePicker, Input, InputNumber, Form } from 'antd';
import { FormImageUploader } from "@/shared/components/Uploader";
import { isURL } from 'class-validator';
import { DEFAULT_COVER_URL } from "@/shared/constants";
import TagSelect from "@/shared/components/TagSelect";
import TagStore from '@/shared/stores/TagStore';
import { IModDto } from '@/interfaces/shared/api';
import { contributeModDto } from '../stores/ModuleStore';
import { LanguageCodes, LanguageCodes_MAP } from '@/utils/language';
import styles from './ModuleContributeForm.module.less';
import moment from 'moment';
import _ from 'lodash';

const { Option } = Select;

interface IProps {
  mod?: IModDto;
  onSave: (dto: Partial<contributeModDto>) => Promise<void>;
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

const ModuleContributeForm: React.FunctionComponent<IProps> = observer(({
  mod,
  btnText = '保存',
  ...props
}) => {
  // const { mod, btnText = '' } = props;
  const [saving, setSaving] = useState(false);

  const initialValues: any = mod ? {
    title: mod.title,
    originTitle: mod.originTitle,
    author: mod.author.nickName,
    originUrl: mod.originUrl,
    releaseDate: moment(mod.releaseDate),
    alias: mod.alias,
    description: mod.description,
    coverUrl: mod.coverUrl !== DEFAULT_COVER_URL ? [mod.coverUrl] : [],
    imageUrls: mod.imageUrls || [],
    minPlayer: mod.playerNumber[0],
    maxPlayer: mod.playerNumber[1],
    moduleRule: mod.moduleRule,
    tags: mod.tags,
    languages: mod.languages,
  } : {}

  const getDto = (values: any) => {
    if (Object.keys(values).length === 0) {
      return {}
    }

    return {
      title: values.title,
      originTitle: values.originTitle,
      alias: values.alias,
      description: values.description,
      author: values.author,
      coverUrl: values.coverUrl ? values.coverUrl[0] || '' : '',
      imageUrls: values.imageUrls,
      originUrl: values.originUrl ? `http://` + values.originUrl.replace(/^https?\:\/\//i,"") : '',
      playerNumber: [values.minPlayer, values.maxPlayer],
      moduleRule: values.moduleRule,
      tags: values.tags,
      releaseDate: values.releaseDate,
      languages: values.languages,
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
      onFinish={handleSubmit}
      initialValues={initialValues}
    >
      <Form.Item label="模组封面" tooltip='比例3:4' name="coverUrl">
        <FormImageUploader multiple={false} rename compress />
      </Form.Item>
      <Form.Item label="原名称" tooltip='如果模组原文为外文，请将原名填写在这里' name="originTitle" >
        <Input placeholder='翻译作品将原名写在这里'/>
      </Form.Item>
      <Form.Item 
        label="中文名称"
        name="title"
        required
        rules={[
          {
            required: true,
            message: '请填写模组名称',
          },
        ]}
      >
        <Input placeholder='模组正式名称或中文译名'/>
      </Form.Item>
      <Form.Item label="别名" tooltip='用于搜索，多个使用空格分割' name="alias">
        <Input placeholder='用于搜索，多个使用空格分割'/>
      </Form.Item>
      <Form.Item label="原作者" name="author" required
        rules={[
          {
            required: true,
            message: '请填写模组原作者',
          },
        ]}
      >
        <Input />
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
      <Form.Item 
        label="发布地址"
        name="originUrl"
        rules={[
          { 
            validator: (_, value, cb) => cb(value ? isURL(value) ? undefined : '请填写可访问的链接' : undefined) 
          }
        ]}
      >
        <Input placeholder='请填写发布地址'/>
      </Form.Item>

      <Form.Item label="发布日期" name="releaseDate" required
        rules={[
          {
            required: true,
            message: '请填写发布日期',
          },
        ]}
      >
        <DatePicker placeholder='请填写发布日期'/>
      </Form.Item>
    
      <Form.Item label="玩家数" >
        <Input.Group compact>
          <Form.Item name="minPlayer" style={{ marginBottom: 0 }}>
            <InputNumber min={0} className={styles.inputGroupLeft} placeholder='0'/>
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
            <InputNumber min={0} className={styles.inputGroupRight} placeholder='0'/>
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
        <Input.TextArea rows={6} placeholder='在这里添加作品简介'/>
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
})

export default ModuleContributeForm;
