import React, { useEffect, useRef, useState } from "react";
import { observer } from "mobx-react";
import { Link } from "react-router-dom";
import { Modal, Spin, Input } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import {
  ReplyDto,
  CommentSingleStore,
  CommentDto,
} from "@/shared/stores/CommentStore";
import { ReplyItem } from "./ReplyItem";
import ReplyInputArea from "./ReplyInputArea";
import Scrollbars from "react-custom-scrollbars";
import styles from "./DialogModal.module.less";

interface IProps {}

const DialogModal: React.FunctionComponent<IProps> = observer((props) => {
  const [replyTo, setReplyTo] = useState<CommentDto>();
  const [current, setCurrent] = useState<string>(
    CommentSingleStore.dialogTargetId
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [dialog, setDialog] = useState<Array<ReplyDto>>([]);
  const inputRef = useRef<Input>(null);

  useEffect(() => {
    if (!inputRef.current) {
      return;
    }

    inputRef.current.focus();
  }, [replyTo]);

  useEffect(() => {
    if (!CommentSingleStore.dialogModalVisible) {
      setLoading(true);
      return;
    }
    if (current === CommentSingleStore.dialogTargetId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    CommentSingleStore.getDialog(CommentSingleStore.dialogTargetId)
      .then((res) => {
        setDialog(res.data);
      })
      .then(() => {
        setCurrent(CommentSingleStore.dialogTargetId);
        setLoading(false);
      });
  }, [
    CommentSingleStore.dialogTargetId,
    CommentSingleStore.dialogModalVisible,
  ]);

  const parent = dialog[0];
  const _replayTo = replyTo || parent;

  const renderTarget = () => {
    if (parent.targetName === "Rate") {
      return (
        <Link
          to={`/rate/${parent.targetId}`}
          onClick={CommentSingleStore.closeDialogModal}
        >
          查看原评价
        </Link>
      );
    }

    if (parent.targetName === "Topic") {
      return (
        <Link
          to={`/forum/topic/${parent.targetId}`}
          onClick={CommentSingleStore.closeDialogModal}
        >
          查看原帖
        </Link>
      );
    }

    return null;
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className={styles.loading}>
          <Spin size="large" />
        </div>
      );
    }

    return (
      <React.Fragment>
        <div className={styles.title}>
          {renderTarget()}
          <CloseOutlined 
            className={styles.clickableText}
            style={{ marginLeft: 'auto' }}
            onClick={() => CommentSingleStore.closeDialogModal()}
          />
        </div>

        <Scrollbars
          autoHide
          renderThumbVertical={() => <div className="custom-scroll" />}
          // className={styles.content}
          style={{ display: 'flex' }}
          renderView={() => (
            <div className={styles.content} />
          )}
        >
          <div className={styles.parent}>
            <ReplyItem
              id={`reply-${parent._id}`}
              reply={parent}
              onReplyTo={() => setReplyTo(parent)}
              renderMode="markdown"
            />
          </div>

          {dialog.length > 1 &&
            <div className={styles.list}>
              {dialog.slice(1).map((reply) => (
                <ReplyItem
                  id={`reply-${reply._id}`}
                  reply={reply}
                  key={reply._id}
                  onReplyTo={() => setReplyTo(reply)}
                />
              ))}
            </div>
          }
        </Scrollbars>

        <div className={styles.footer}>
          <ReplyInputArea
            ref={inputRef}
            placeholder={`回复 @${_replayTo.user.nickName}：`}
            onSend={(content: string) =>
              CommentSingleStore.replyTo(_replayTo._id, content)
            }
          />
        </div>
      </React.Fragment>
    );
  };

  return (
    <Modal
      visible={CommentSingleStore.dialogModalVisible}
      onCancel={CommentSingleStore.closeDialogModal}
      centered
      footer={null}
      closable={false}
      className={styles.dialogModal}
    >
      {renderContent()}
    </Modal>
  );
});

export { DialogModal };
export default DialogModal;
