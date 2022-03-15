import React, { useEffect, useRef, useState } from "react";
import { Input, Avatar, Badge } from "antd";
import { Link, useHistory } from "react-router-dom";
import { AccountInfoWrapper } from "@/shared/components/AccountInfo";
import NotificationStore, {
  INotificationDto,
  NotificationType,
} from "@/shared/stores/NotificationStore";
import styles from "./NotificationItem.module.less";
import { CommentSingleStore } from "@/shared/stores/CommentStore";

interface IProps {
  notification: INotificationDto;
  // loadReplies: (page: number) => Promise<any>,
  // onReply: (targetId: string, content: string) => Promise<any>,
}

const NOTIFICATION_TYPE_MAP = {
  [NotificationType.Like]: "喜欢了",
  [NotificationType.Follow]: "关注了您",
  [NotificationType.Comment]: "评论了",
  [NotificationType.Reply]: "回复了",
};

const eclipse = (text: string, length: number = 20) => {
  return `${text.slice(0, length)}${text.length > 20 ? "..." : ""}`
}

const NotificationItem: React.FC<IProps> = (props) => {
  const history = useHistory();

  const renderVerb = () => {
    if (props.notification.type === NotificationType.Like && props.notification.data.attitude === 'happy') {
      return '认为';
    }
  
    return NOTIFICATION_TYPE_MAP[props.notification.type]
  }

  const renderSuffix = () => {
    if (props.notification.type === NotificationType.Like && props.notification.data.attitude === 'happy') {
      return '很欢乐😆';
    }

    return;
  }

  const renderTarget = () => {
    if (props.notification.type === NotificationType.Like) {
      if (props.notification.data.targetName === "Rate") {
        return (
          <span>
            您在
            <Link
              to={`/module/${props.notification.data.mod._id}`}
              style={{ margin: "0 4px" }}
            >
              {props.notification.data.mod.title}
            </Link>
            下的评价：
            <Link to={`/rate/${props.notification.data.targetId}`}>
              {props.notification.data.content.slice(0, 20)}
              {props.notification.data.content.length > 20 ? "..." : ""}
            </Link>
          </span>
        );
      }

      if (props.notification.data.targetName === "Comment") {
        return (
          <a onClick={() => CommentSingleStore.openDialogModal(props.notification.data.targetId)}>
            {eclipse(props.notification.data.content)}
          </a>
        );
      }
    }
    if (props.notification.type === NotificationType.Comment) {
      if (props.notification.data.targetName === 'Rate') {
        const commentId = props.notification.data._id;
        return (
          <span>
            您在
            <Link
              to={`/module/${props.notification.data.mod._id}`}
              style={{ margin: "0 4px" }}
            >
              {props.notification.data.mod.title}
            </Link>
            下的评价：
            <a onClick={() => CommentSingleStore.openDialogModal(commentId)}>
              {eclipse(props.notification.data.content)}
            </a>
          </span>
        );
      }

      if (props.notification.data.targetName === 'Topic') {
        const commentId = props.notification.data._id;
        return (
          <span>
            您的讨论帖
            <Link to={`/forum/topic/${props.notification.data.targetId}`}>
              {eclipse(props.notification.data.topic.title)}
            </Link>：
            <a onClick={() => CommentSingleStore.openDialogModal(commentId)}>
              {eclipse(props.notification.data.content)}
            </a>
          </span>
        );
      }

      if (props.notification.data.targetName === 'Collection') {
        const commentId = props.notification.data._id;
        return (
          <span>
            您创建的收藏夹
            <Link to={`/collection/${props.notification.data.targetId}`}>
              {eclipse(props.notification.data.collection.title)}
            </Link>：
            <a onClick={() => CommentSingleStore.openDialogModal(commentId)}>
              {eclipse(props.notification.data.content)}
            </a>
          </span>
        );
      }
    }

    if (props.notification.type === NotificationType.Reply) {
      const commentId = props.notification.data._id;
      return (
        <span>
          您的评论：
          <a onClick={() => CommentSingleStore.openDialogModal(commentId)}>
            {eclipse(props.notification.data.content)}
          </a>
        </span>
      );
    }
  };

  return (
    <div
      className={styles.notificationItem}
      onClick={() => NotificationStore.markRead(props.notification._id)}
    >
      {props.notification.isUnread && <Badge className={styles.unreadBadge} />}
      {props.notification.sender && (
        <AccountInfoWrapper _id={props.notification.sender._id} tag="div" style={{ marginRight: 8 }}>
          <Avatar
            src={props.notification.sender.avatarUrl}
            className={styles.sender}
          />
        </AccountInfoWrapper>
      )}
      <div>
        {props.notification.sender && (
          <AccountInfoWrapper _id={props.notification.sender._id}>
            <span className={styles.sender}>
              {props.notification.sender.nickName}
            </span>
          </AccountInfoWrapper>
        )}
        <span className={styles.notificationVerb}>
          {renderVerb()}
        </span>

        <span className={styles.notificationTarget}>{renderTarget()}</span>

        <span className={styles.notificationSuffix}>
          {renderSuffix()}
        </span>
      </div>
    </div>
  );
};

export default NotificationItem;
export { NotificationItem };
