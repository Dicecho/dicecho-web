import ModuleSearchModal from "@/module/components/ModuleSearchModal";
import ModuleWidget from "@/module/components/ModuleWidget";
import { MarkdownEditor, Vditor } from "@/shared/components/MarkdownEditor";
import UIStore from "@/shared/stores/UIStore";
import { CloseOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Checkbox, Input } from "antd";
import { IModDto } from "interfaces/shared/api";
import { observer } from "mobx-react";
import React, { useEffect, useRef, useState } from "react";
import ResponsiveModal from "shared/components/ResponsiveModal";
import { ITopicDto } from "../stores/TopicStore";
import styles from "./TopicPostModal.module.less";

interface IProps {
  visible: boolean;
  topic: ITopicDto;
  onCancel: () => void;
  onSend: (dto: {
    title: string;
    content: string;
    isSpoiler: boolean;
    relatedModIds: Array<string>;
  }) => Promise<any>;
  BtnText?: string;
}

const TopicUpdateModal: React.FunctionComponent<IProps> = observer((props) => {
  const [title, setTitle] = useState(props.topic ? props.topic.title : "");
  const [content, setContent] = useState(
    props.topic ? props.topic.content : ""
  );
  const [isSpoiler, setIsSpoiler] = useState(
    props.topic ? props.topic.isSpoiler : false
  );
  const [submitting, setSubmitting] = useState(false);
  const editorRef = useRef<Vditor>(null);
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const [relatedMods, setRelatedMods] = useState<
    Array<{
      _id: string;
      title: string;
      coverUrl: string;
      description: string;
      rateAvg: number;
      rateCount: number;
    }>
  >(props.topic ? props.topic.relatedMods : []);

  useEffect(() => {
    if (!props.visible) {
      return;
    }

    setTitle(props.topic ? props.topic.title : "");
    setContent(props.topic ? props.topic.content : "");
    setIsSpoiler(props.topic ? props.topic.isSpoiler : false);
    setRelatedMods(props.topic ? props.topic.relatedMods : []);
  }, [props.topic, props.visible]);

  const addRelatedMods = (mod: IModDto) => {
    const index = relatedMods.findIndex((m) => m._id === mod._id);
    if (index !== -1) {
      return;
    }

    setRelatedMods((preMods) => [...preMods, mod]);
  };

  const removeRelatedMods = (modId: string) => {
    const index = relatedMods.findIndex((m) => m._id === modId);
    if (index === -1) {
      return;
    }
    setRelatedMods((preMods) => preMods.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (submitting) {
      return;
    }
    setSubmitting(true);
    props
      .onSend({
        title,
        content,
        isSpoiler,
        relatedModIds: relatedMods.map((mod) => mod._id),
      })
      .then(() => {
        setTitle("");
        setContent("");
        setRelatedMods([]);
        props.onCancel();
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  return (
    <ResponsiveModal
      modalProps={{
        visible: props.visible,
        onCancel: props.onCancel,
        title: null,
        footer: null,
        closable: false,
        width: 640,
        centered: true,
        destroyOnClose: true,
      }}
      drawerProps={{
        placement: "bottom",
        visible: props.visible,
        closable: false,
        onClose: props.onCancel,
        height: "100vh",
        className: styles.rateDrawer,
        title: (
          <div style={{ display: "flex", alignItems: "center" }}>
            <Button type="text" style={{ padding: 0 }} onClick={props.onCancel}>
              取消
            </Button>
            <Button
              type="text"
              loading={submitting}
              style={{ marginLeft: "auto", padding: 0 }}
              onClick={handleSubmit}
            >
              发布
            </Button>
          </div>
        ),
      }}
    >
      <Input
        value={title}
        className={styles.input}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="标题"
        style={{ marginBottom: 8 }}
      />

      <MarkdownEditor
        defaultValue={content}
        onChange={(value) => setContent(value)}
        minHeight={240}
        height={UIStore.isMobile ? window.innerHeight / 2 : 240}
        placeholder="发表您想表达的内容"
        wrapperProps={{
          style: { marginBottom: 16 },
          className: styles.markdownEditor,
        }}
        toolbarConfig={{
          pin: false,
        }}
      />
      {relatedMods.map((mod) => (
        <div className={styles.relatedMod} key={mod._id}>
          <div
            className={styles.close}
            onClick={() => removeRelatedMods(mod._id)}
          >
            <CloseOutlined />
          </div>
          <ModuleWidget tiny mod={mod} clickable={false} />
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
        {!UIStore.isMobile && (
          <Button
            type="primary"
            loading={submitting}
            style={{ marginLeft: "auto" }}
            onClick={handleSubmit}
          >
            发布
          </Button>
        )}
      </div>

      <ModuleSearchModal
        visible={searchModalVisible}
        onCancel={() => setSearchModalVisible(false)}
        onSelect={(mod) => {
          addRelatedMods(mod);
          setSearchModalVisible(false);
        }}
      />
    </ResponsiveModal>
  );
});

export default TopicUpdateModal;
