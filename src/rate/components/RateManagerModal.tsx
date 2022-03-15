import React, { useEffect, useRef, useState } from "react";
import { observer } from "mobx-react";
import {
  Modal,
  Button,
  Select,
  Input,
  message,
} from "antd";

interface IProps {
  visible: boolean;
  onCancel: () => void;
  onSend: (data: { log: string, message: string }) => Promise<any>;
}

const { Option } = Select;

export const reasonOptions = [
  '人身攻击',
  '侵犯隐私',
  '垃圾广告/刷屏',
  '违反国家法律',
];

const RateManagerModal: React.FunctionComponent<IProps> = observer((props) => {
  const [reason, setReason] = useState('');
  const [messageText, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  return (
    <Modal
      visible={props.visible}
      onCancel={props.onCancel}
      centered
      title={"管理评价"}
      footer={null}
      closable={false}
      width={440}
    >
      <div style={{ marginBottom: 8 }}>
      此评价因
        <Input 
          placeholder="请填写理由" 
          value={reason} 
          onChange={(e) => setReason(e.target.value)}
          bordered={false}
          style={{ width: 120 }}
        />
        ，被更改可见度
      </div>
      
      <Input.TextArea 
        rows={6}
        value={messageText}
        onChange={(e) => setMessage(e.target.value)}
        placeholder={'留言'}
      />

      <Button
        type="primary"
        loading={submitting}
        style={{ marginTop: 16 }}
        block
        onClick={() => {
          if (submitting) {
            return;
          }

          if (!reason) {
            message.info("请先选择一项理由");
            return;
          }

          setSubmitting(true);
          props.onSend({
            log: `此评价因${reason}，被更改可见度`,
            message: messageText,
          }).then(() => {
            message.success('处理成功')
            props.onCancel();
          }).finally(() => {
            setSubmitting(false);
          });
        }}
      >
        确定
      </Button>
    </Modal>
  );
});

export default RateManagerModal;
