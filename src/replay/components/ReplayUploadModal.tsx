import React, { useEffect, useRef, useState } from "react";
import { observer } from "mobx-react";
import { Select } from '@/lib/antd';
import LoadableButton from "@/shared/components/LoadableButton";
import { Modal, ModalProps, Button, Typography, Input, Alert, Tooltip } from "antd";
import { singleReplayStore } from "../stores/ReplayStore";

const { Text } = Typography;
const { Option } = Select;

interface IProps extends ModalProps {
  onSubmit: (bvid: string) => Promise<any>;
}

const ReplayUploadModal: React.FunctionComponent<IProps> = observer((props) => {
  const [bvid, setBvid] = useState('');

  return (
    <Modal
      centered
      title={"分享新视频"}
      footer={null}
      closable={false}
      width={400}
      {...props}
    >
      <Input
        placeholder='请输入bilibili的bvid'
        value={bvid}
        onChange={(e) => setBvid(e.target.value)}
      />

      <LoadableButton 
        onSubmit={() => props.onSubmit(bvid).then(() => {
          setBvid('')
        })}
        block
        type='primary'
        style={{ marginTop: 16 }}
      >
        分享
      </LoadableButton>
    </Modal>
  );
});



export default ReplayUploadModal;


