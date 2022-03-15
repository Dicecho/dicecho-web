import React, { useEffect, useRef, useState } from "react";
import { Button, Checkbox, Input, Modal, message, Form } from "antd";
import { ModalProps } from 'antd/lib/modal'
import openGenericFuncModal from '@/shared/components/CustomFuncModal';

export interface EditLinkModalProps extends ModalProps {
  prevUrl?: string;
  onSubmit: (url: string) => any;
}

const EditLinkModal: React.FunctionComponent<EditLinkModalProps> = ({
  prevUrl,
  onSubmit,
  ...props
}) => {
  const [url, setUrl] = useState(prevUrl || '')

  return (
    <Modal
      title={null}
      // footer={null}
      closable={false}
      centered={true}
      destroyOnClose={true}
      onCancel={(e) => {
        onSubmit('');
        props.onCancel && props.onCancel(e)
      }}
      onOk={(e) => {
        onSubmit(url);
        props.onCancel && props.onCancel(e)
      }}
      {...props}
    >
      <Input 
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      {/* <TopicPostForm 
        onSubmit={(dto) => onSubmit(dto).then(() => { props.onCancel && props.onCancel() })} 
        defaultData={defaultData}
      /> */}
    </Modal>
  );
};

export default EditLinkModal;
export const openEditLinkFuncModal = (config: EditLinkModalProps) => openGenericFuncModal<EditLinkModalProps>(config, EditLinkModal)
