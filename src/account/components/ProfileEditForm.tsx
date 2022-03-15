import React, { useState } from "react";
import { observer } from "mobx-react";
import { Button, Typography, Input, Col, Row, Avatar } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import {
  AliyunOSSUpload,
  UploadFile,
} from "@/shared/components/Uploader";
import { MarkdownEditor } from '@/shared/components/MarkdownEditor';
import { DEFAULT_ACCOUNT_BACKGROUND } from "@/shared/constants";
import UIStore from "@/shared/stores/UIStore";
import { IAccountDto } from "../stores/AccountStore";
import styles from "./ProfileEditForm.module.less";

const { Paragraph, Text } = Typography;

interface IProps {
  profile: IAccountDto;
  onSave: (dto: Partial<IAccountDto>) => Promise<any>;
  btnText?: string;
}

const ProfileEditForm: React.FunctionComponent<IProps> = observer((props) => {
  const { profile, btnText = "保存" } = props;
  const [nickName, setNickName] = useState(profile.nickName);
  const [note, setNote] = useState(profile.note);
  const [avatar, setAvatar] = useState<UploadFile | undefined>(
    profile &&
      profile.avatarUrl &&
      profile.avatarUrl !== `/avatars/${profile.nickName}`
      ? {
          uid: profile.avatarUrl,
          size: 0,
          name: profile.avatarUrl,
          type: "",
          url: profile.avatarUrl,
        }
      : undefined
  );
  const [background, setBackground] = useState<UploadFile | undefined>(
    profile &&
      profile.backgroundUrl &&
      profile.backgroundUrl !== DEFAULT_ACCOUNT_BACKGROUND
      ? {
          uid: profile.backgroundUrl,
          size: 0,
          name: profile.backgroundUrl,
          type: "",
          url: profile.backgroundUrl,
        }
      : undefined
  );
  const [notice, setNotice] = useState(profile.notice);
  const [saving, setSaving] = useState(false);

  const loading =
    (avatar && avatar.status && avatar.status === "uploading") ||
    (background && background.status && background.status === "uploading");

  return (
    <React.Fragment>
      <Row gutter={16}>
        <Col xs={24} sm={24} md={12}>
          <Text>昵称</Text>
          <Input
            value={nickName}
            onChange={(e) => setNickName(e.target.value)}
            style={{ marginBottom: 16 }}
          />
          <Text>个性签名</Text>
          <Input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            style={{ marginBottom: 16 }}
          />
        </Col>
      </Row>
      <Row gutter={16}>
        <Col xs={24} sm={24} md={12}>
          <Text>预览</Text>
          <div className={styles.preview} style={{ marginBottom: 16 }}>
            <div
              className={styles.previewBackend}
              style={{ background: `url(${(background && background.url) ? background.url : DEFAULT_ACCOUNT_BACKGROUND })` }}
            />
            <div className={styles.previewMain}>
              <Avatar 
                size={60}
                style={{ marginRight: 16 }}
                className={styles.previewAvatar}
                src={(avatar && avatar.url)? avatar.url : `/avatars/${nickName}`}
              />
              <div className={styles.previewInfo}>
                <Paragraph ellipsis={{ rows: 1, expandable: false }} className={styles.previewNickname} style={{ margin: 0 }}>
                  {nickName}
                </Paragraph>
                <Paragraph ellipsis={{ rows: 1, expandable: false }} className={styles.previewNote} style={{ margin: 0 }}>
                  {note}
                </Paragraph>
              </div>
            </div>
          </div>
        </Col>
        <Col xs={24} sm={24} md={12}>
          <div style={{ marginBottom: 16 }}>
            <Text style={{ marginRight: 8 }}>头像</Text>
            <AliyunOSSUpload
              listType="picture-card"
              accept=".jpg,.png,.jpeg,.gif"
              multiple={false}
              defaultFileList={avatar ? [avatar] : []}
              onChange={(info) => setAvatar(info.file ? { ...info.file } : undefined)}
              rename
            >
              {avatar === undefined && (
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>上传头像</div>
                </div>
              )}
            </AliyunOSSUpload>
          </div>
          <div style={{ marginBottom: 16 }}>
            <Text style={{ marginRight: 8 }}>背景</Text>
            <AliyunOSSUpload
              listType="picture-card"
              accept=".jpg,.png,.jpeg"
              multiple={false}
              defaultFileList={background ? [background] : []}
              onChange={(info) => setBackground(info.file ? { ...info.file } : undefined)}
              rename
            >
              {background === undefined && (
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>上传背景图</div>
                </div>
              )}
            </AliyunOSSUpload>
          </div>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col xs={24} sm={24} md={12}>
          <Text>个人简介</Text>
          <MarkdownEditor
            defaultValue={notice}
            onChange={(value) => setNotice(value)}
            minHeight={240}
            height={UIStore.isMobile ? window.innerHeight / 2 : 400}
            placeholder='编辑您的个人简介'
            wrapperProps={{
              style: { marginBottom: 16 },
              className: styles.markdownEditor,
            }}
          />
          {/* <Input.TextArea
            rows={6}
            value={notice}
            onChange={(e) => setNotice(e.target.value)}
            style={{ marginBottom: 16 }}
          /> */}
        </Col>
      </Row>
      <Button
        type="primary"
        onClick={() => {
          setSaving(true);
          props
            .onSave({
              nickName,
              note,
              notice,
              avatarUrl: avatar ? avatar.url : "",
              backgroundUrl: background ? background.url : "",
            })
            .finally(() => {
              setSaving(false);
            });
        }}
        block
        loading={saving || loading}
        style={{ marginTop: 16 }}
      >
        {btnText}
      </Button>
    </React.Fragment>
  );
});

export default ProfileEditForm;
