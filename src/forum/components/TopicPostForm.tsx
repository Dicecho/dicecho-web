import ModuleSearchModal from '@/module/components/ModuleSearchModal';
import ModuleWidget from '@/module/components/ModuleWidget';
import { MarkdownEditor, Vditor } from "@/shared/components/MarkdownEditor";
import UIStore from "@/shared/stores/UIStore";
import { CloseOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Checkbox, Input, Select } from "antd";
import { observer } from "mobx-react";
import React, { useEffect, useRef, useState } from "react";
import { DomainSingleStore } from "../stores/DomainStore";
import styles from "./TopicPostModal.module.less";

const { Option } = Select;

interface SimpleModDto {
  _id: string,
  title: string,
  description: string,
  coverUrl: string,
  rateAvg: number,
  rateCount: number,
}

export interface TopicPostFormProps  {
  defaultData?: Partial<{
    title: string;
    content: string;
    isSpoiler: boolean;
    domain: {
      _id: string;
      title: string;
    };
    relatedMods?: Array<SimpleModDto>;
  }>;
  onSubmit: (dto: {
    title: string;
    content: string;
    isSpoiler: boolean;
    domainId?: string;
    relatedModIds?: string[];
  }) => Promise<any>;
  BtnText?: string;
}

const TopicPostForm: React.FunctionComponent<TopicPostFormProps> = observer(({
  defaultData = {},
  ...props
}) => {
  const [title, setTitle] = useState(defaultData.title ? defaultData.title : "");
  const [domainId, setDomainId] = useState(defaultData.domain ?  defaultData.domain._id : undefined);
  const [content, setContent] = useState(
    defaultData.content ? defaultData.content : ""
  );
  const [isSpoiler, setIsSpoiler] = useState(
    defaultData.isSpoiler ? defaultData.isSpoiler : false
  );
  const [relatedMods, setRelatedMods] = useState<Array<SimpleModDto>>(
    defaultData.relatedMods ? defaultData.relatedMods : []
  );
  const [submitting, setSubmitting] = useState(false);

  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const editorRef = useRef<Vditor>(null);

  useEffect(() => {
    setTitle(defaultData.title ? defaultData.title : "");
    setContent(
      defaultData.content ? defaultData.content : ""
    );
    setIsSpoiler(
      defaultData.isSpoiler ? defaultData.isSpoiler : false
    );
    setRelatedMods(
      defaultData.relatedMods ? defaultData.relatedMods : []
    );
    setDomainId(
      defaultData.domain ? defaultData.domain._id : undefined
    );
  }, [defaultData]);

  const addRelatedMods = (mod: SimpleModDto) => {
    const index = relatedMods.findIndex((m) => m._id === mod._id);
    if (index !== -1) {
      return;
    }

    setRelatedMods(preMods => [
      ...preMods,
      mod,
    ])
  }

  const removeRelatedMods = (modId: string) => {
    const index = relatedMods.findIndex((m) => m._id === modId);
    if (index === -1) {
      return;
    }
    setRelatedMods(preMods => preMods.filter((_, i) => i !== index));
  }

  const handleSubmit = (e: any) => {
    if (submitting) {
      return;
    }
    setSubmitting(true);
    props
      .onSubmit({ title, content, isSpoiler, relatedModIds: relatedMods.map((mod) => mod._id), domainId })
      .then(() => {
        setTitle("");
        setContent("");
        setRelatedMods([]);
      })
      .finally(() => {
        setSubmitting(false);
      });
  }

  const suggestions: Array<{
    _id: string,
    title: string,
  }> = [
    ...(defaultData.domain ? [defaultData.domain] : []),
    ...DomainSingleStore.suggestionDomains,
  ];

  return (
    <React.Fragment>
      <Select
        className={styles.domainSelect}
        value={domainId}
        onChange={(value) => setDomainId(value)}
        placeholder="选择板块"
        style={{ marginBottom: 8 }}
      >
        {suggestions.map((option) => (
          <Option key={option._id} value={option._id}>
            {option.title}
          </Option>
        ))}
      </Select>
      <Input
        value={title}
        className={styles.input}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="来儿点儿标儿题儿"
        style={{ marginBottom: 8 }}
      />

      <MarkdownEditor
        defaultValue={content}
        onChange={(value) => setContent(value)}
        minHeight={240}
        height={UIStore.isMobile ? window.innerHeight / 2 : 240}
        placeholder="加儿点儿正儿文儿"
        toolbarConfig={{
          pin: false,
        }}
        wrapperProps={{
          style: { marginBottom: 16 },
          className: styles.markdownEditor,
        }}
      />
      {relatedMods.map(mod => (
        <div className={styles.relatedMod} key={mod._id}>
          <div 
            className={styles.close}
            onClick={() => removeRelatedMods(mod._id)}
          >
            <CloseOutlined />
          </div>
          <ModuleWidget 
            tiny
            mod={mod}
            clickable={false}
          />
        </div>
      ))}
      <div 
        className={styles.relatedModAdd}
        onClick={() => setSearchModalVisible(true)}
        style={{ marginBottom: 16 }}
      >
        <PlusOutlined />
        添加相关模组
      </div>
      <div className={styles.footer}>
        <Checkbox
          style={{ userSelect: "none" }}
          checked={isSpoiler}
          onChange={(e) => setIsSpoiler(e.target.checked)}
        >
          含有剧透内容
        </Checkbox>

        <Button
          type="primary"
          loading={submitting}
          style={{ marginLeft: "auto" }}
          onClick={handleSubmit}
        >
          发布
        </Button>
      </div>

      <ModuleSearchModal
        visible={searchModalVisible}
        onCancel={() => setSearchModalVisible(false)}
        onSelect={(mod) => {
          addRelatedMods(mod);
          setSearchModalVisible(false);
        }}
      />
    </React.Fragment>
  );
});

export default TopicPostForm;
