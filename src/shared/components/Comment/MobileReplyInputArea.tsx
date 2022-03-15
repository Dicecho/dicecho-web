import React, { HTMLAttributes, useState } from "react";
import { Input, Button, ButtonProps, message } from "antd";
import { TextAreaRef, TextAreaProps } from "antd/lib/input/TextArea";
import styles from "./ReplyInputArea.module.less";

interface IProps extends TextAreaProps {
  onSend: (content: string) => Promise<any>;
  wrapProps?: HTMLAttributes<HTMLDivElement>;
  btnProps?: ButtonProps;
}

const { TextArea } = Input;

const MobileReplyInputArea = React.forwardRef<TextAreaRef, IProps>(
  (
    { 
      onSend,
      wrapProps = {}, 
      btnProps = {}, 
      ...props
    }, 
    ref
  ) => {
    const { className = "", ...innerWrapProps } = wrapProps;
    const [value, setValue] = useState("");
    const [sending, setSending] = useState(false);

    return (
      <div
        className={`${styles.replyInputArea} ${className}`}
        {...innerWrapProps}
      >
        <TextArea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={props.placeholder}
          className={styles.textArea}
          autoSize={true}
          ref={ref}
          {...props}
        />
        <div
          className={`${styles.replyInputBtn} ${
            value !== "" ? styles.activeBtn : ""
          }`}
        >
          <Button
            onClick={() => {
              setSending(true);
              onSend(value)
                .then(() => {
                  setValue("");
                  message.success("发送成功");
                  setSending(false);
                })
                .catch(() => {
                  setSending(false);
                });
            }}
            loading={sending}
            type="primary"
            {...btnProps}
            // style={{ height: 76 }}
          >
            发送
          </Button>
        </div>
      </div>
    );
  }
);

export default MobileReplyInputArea;
export { MobileReplyInputArea };
