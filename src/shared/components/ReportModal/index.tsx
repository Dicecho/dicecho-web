import React, { useEffect, useRef, useState } from "react";
import { observer } from "mobx-react";
import {
  Modal,
  Button,
  Typography,
  Radio,
  message,
  Input,
} from "antd";
import { ReportClassification } from "@/shared/stores/ReportStore";
export * from './AppealModal';

const { Text } = Typography;
const { TextArea } = Input;

interface IProps {
  visible: boolean;
  onCancel: () => void;
  onSend: (classification: ReportClassification, reason: string) => Promise<any>;
}

type LawType = ReportClassification.Illegal | ReportClassification.Pornographic | ReportClassification.Gamble;
type PersonalType = ReportClassification.PersonalAttack | ReportClassification.Privacy;
type CommunityType = ReportClassification.Spam;

export const LawTypeMap = {
  [ReportClassification.Illegal]: "违反法律",
  [ReportClassification.Pornographic]: "淫秽色情",
  [ReportClassification.Gamble]: "赌博诈骗",
};

export const PersonalTypeMap = {
  [ReportClassification.PersonalAttack]: "人身攻击",
  [ReportClassification.Privacy]: "侵犯隐私",
};

export const CommunityTypeMap = {
  [ReportClassification.Spam]: "垃圾广告/刷屏",
};

const ReportModal: React.FunctionComponent<IProps> = observer((props) => {
  const [reason, setReason] = useState('');
  const [type, setType] = useState<ReportClassification | undefined>();
  const [submitting, setSubmitting] = useState(false);

  return (
    <Modal
      visible={props.visible}
      onCancel={props.onCancel}
      centered
      title={"请选择举报理由"}
      footer={null}
      closable={false}
      width={440}
    >
      <div style={{ marginBottom: 8 }}>
        <div style={{ marginBottom: 8 }}>
          <Text strong>违反法律法规</Text>
        </div>
        <Radio.Group onChange={(e) => setType(e.target.value)} value={type}>
          {(Object.keys(LawTypeMap) as Array<LawType>).map((key) => (
            <Radio key={key} value={key}>
              {LawTypeMap[key]}
            </Radio>
          ))}
        </Radio.Group>
      </div>

      <div style={{ marginBottom: 8 }}>
        <div style={{ marginBottom: 8 }}>
          <Text strong>侵犯个人权益</Text>
        </div>
        <Radio.Group onChange={(e) => setType(e.target.value)} value={type}>
          {(Object.keys(PersonalTypeMap) as Array<PersonalType>).map((key) => (
            <Radio key={key} value={key}>
              {PersonalTypeMap[key]}
            </Radio>
          ))}
        </Radio.Group>
      </div>

      {/* <div style={{ marginBottom: 8 }}>
        <Text strong>有害社区环境</Text>
      </div>
      <Radio.Group onChange={(e) => setType(e.target.value)} value={type}>
        {(Object.keys(CommunityTypeMap) as Array<CommunityType>).map((key) => (
          <Radio key={key} value={key}>
            {CommunityTypeMap[key]}
          </Radio>
        ))}
      </Radio.Group> */}
      <div style={{ marginBottom: 8 }}>
        <div style={{ marginBottom: 8 }}>
          <Text strong>详细信息</Text>
        </div>
        <TextArea 
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder={'请填写举报详细信息'}
        />
      </div>

      <Button
        type="primary"
        loading={submitting}
        style={{ marginTop: 16 }}
        block
        onClick={() => {
          if (submitting) {
            return;
          }

          if (!type) {
            message.info("请先选择一项理由");
            return;
          }

          if (!reason) {
            message.info("请说明详细内容");
            return;
          }

          setSubmitting(true);
          props.onSend(type, reason).then(() => {
            message.success('成功提交举报信息')
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

export default ReportModal;
