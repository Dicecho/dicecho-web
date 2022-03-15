import React, { useEffect, useRef, useState } from "react";
import { observer } from "mobx-react";
import {
  Modal,
  Button,
  Typography,
  Radio,
  message,
} from "antd";
import { MarkdownEditor, Vditor } from "@/shared/components/MarkdownEditor";
import UIStore from '@/shared/stores/UIStore';
import ReportStore from '@/shared/stores/ReportStore';

const { Text } = Typography;


const AppealModal: React.FunctionComponent = observer((props) => {
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  return (
    <Modal
      visible={ReportStore.appealModalVisible}
      onCancel={() => ReportStore.closeAppealModal()}
      centered
      title={"申诉"}
      footer={null}
      closable={false}
      width={440}
    >
      <MarkdownEditor
        defaultValue={reason}
        onChange={(value) => setReason(value)}
        minHeight={240}
        height={UIStore.isMobile ? window.innerHeight / 2 : 400}
        placeholder="请写下与举报不符的情节"
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
            message.info("请描写原因");
            return;
          }

          setSubmitting(true);
          ReportStore.appeal({
            targetName: ReportStore.appealTargetName, 
            targetId: ReportStore.appealTargetId, 
            reason,
          }).then(() => {
            message.success('成功提交申诉，请耐心等待结果')
            ReportStore.closeAppealModal();
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

export { AppealModal }
