import openGenericFuncModal from "@/shared/components/CustomFuncModal";
import { Modal } from "antd";
import { ModalProps } from "antd/lib/modal";
import { observer } from "mobx-react";
import React from "react";
import TopicPostForm, { TopicPostFormProps } from "./TopicPostForm";

export interface TopicPostModalProps extends ModalProps, TopicPostFormProps {
  onCancel?: (...args: any[]) => any;
}

const TopicPostModal: React.FunctionComponent<TopicPostModalProps> = observer(
  ({ defaultData = {}, onSubmit, ...props }) => {
    return (
      <Modal
        title={null}
        footer={null}
        closable={false}
        width={640}
        centered={true}
        destroyOnClose={true}
        {...props}
      >
        <TopicPostForm
          onSubmit={(dto) =>
            onSubmit(dto).then(() => {
              props.onCancel && props.onCancel();
            })
          }
          defaultData={defaultData}
        />
      </Modal>
    );
  }
);

export default TopicPostModal;
export const openTopicPostFuncModal = (config: TopicPostModalProps) =>
  openGenericFuncModal<TopicPostModalProps>(config, TopicPostModal);
