import React, { HTMLAttributes, useEffect, useRef, useState } from "react";
import { observer } from "mobx-react";
import { MarkdownEditor } from "@/shared/components/MarkdownEditor";
import { Input, Button, Avatar, message } from "antd";
import styles from "./ReplyInputArea.module.less";
import AuthStore from "@/shared/stores/AuthStore";
import UIStore from "@/shared/stores/UIStore";
import Vditor from "vditor/dist";

interface IProps {
  placeholder: string;
  onSend: (content: string) => Promise<any>;
  wrapProps?: HTMLAttributes<HTMLDivElement>;
  showAvatar?: boolean;
  isRich?: boolean;
  isSimple?: boolean;
}

const { TextArea } = Input;

const ReplyInputArea = observer(
  React.forwardRef<Input, IProps>(({ 
    isRich = false,
    isSimple = false,
    showAvatar = true,
    wrapProps = {},
    ...props
  }, ref) => {
    const { className = '', ...innerWrapProps } = wrapProps;
    const [value, setValue] = useState("");
    const [sending, setSending] = useState(false);
    const editorRef = useRef<Vditor>();

    if (!isRich) {
      return (
        <div
          className={`${styles.replyInputArea} ${className}`}
          {...innerWrapProps}
        >
          {showAvatar &&
            <Avatar
              size={UIStore.isMobile ? 'small' : 'default'}
              src={AuthStore.user.avatarUrl}
              className={styles.userAvatar}
              style={{ marginRight: UIStore.isMobile ? 8 : 16 }}
            />
          }
          {AuthStore.isAuthenticated ? (
            <TextArea
              // rows={3}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={props.placeholder}
              className={styles.textArea}
              autoSize={true}
              ref={ref}
            />
          ) : (
            <div className={styles.textAreaEmpty}>
              请先
              <Button
                type="primary"
                size="small"
                style={{ margin: "0 4px" }}
                onClick={() => UIStore.openLoginModal()}
              >
                登录
              </Button>
              后再发表评论
            </div>
          )}
          <div className={`${styles.replyInputBtn} ${value !== '' ? styles.activeBtn : ''}`}>
            <Button
              onClick={() => {
                setSending(true);
                props
                  .onSend(value)
                  .then(() => {
                    setValue("");
                    message.success("发送成功");
                    setSending(false);
                  })
                  .catch(() => {
                    setSending(false);
                  });
              }}
              disabled={!AuthStore.isAuthenticated}
              loading={sending}
              type="primary"
              // style={{ height: 76 }}
            >
              发送
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div
        className={`${styles.replyRichInputArea} ${className}`}
        {...innerWrapProps}
      >
        {AuthStore.isAuthenticated ? (
          <MarkdownEditor
            ref={editorRef}
            defaultValue={value}
            onChange={(value) => setValue(value)}
            minHeight={120}
            // height={100}
            placeholder={props.placeholder}
            action={
              <Button
                type="primary"
                style={{ marginRight: 8, marginLeft: 8 }}
                size="small"
                shape="round"
                onClick={() => {
                  setSending(true);
                  props
                    .onSend(value)
                    .then(() => {
                      if (editorRef.current) {
                        editorRef.current.setValue('')
                      }
                      setValue("");
                      message.success("发送成功");
                      setSending(false);
                    })
                    .catch(() => {
                      setSending(false);
                    });
                }}
                disabled={!AuthStore.isAuthenticated}
                loading={sending}
              >
                发送
              </Button>
            }
            wrapperProps={{
              style: { marginBottom: 16 },
              className: styles.markdownEditor,
            }}
          />
        ) : (
          <div className={styles.richTextAreaEmpty}>
            请先
            <Button
              type="primary"
              size="small"
              style={{ margin: "0 4px" }}
              onClick={() => UIStore.openLoginModal()}
            >
              登录
            </Button>
            后再发表评论
          </div>
        )}
      </div>
    );
  })
);

export default ReplyInputArea;
export { ReplyInputArea };
