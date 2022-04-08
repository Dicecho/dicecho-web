import React, { HTMLAttributes } from 'react';
import { Avatar, Dropdown, Menu, message, Popconfirm } from 'antd';
import { MarkdownRender } from '@/shared/components/MarkdownEditor';
import { Pendant } from "@/shared/components/Pendant";
import { AccountInfoWrapper } from '@/shared/components/AccountInfo';
import { EllipsisOutlined, DeleteOutlined } from '@ant-design/icons'
import GenericLikeButton from '@/shared/components/GenericLikeButton';
import { CommentSingleStore, ReplyDto } from '@/shared/stores/CommentStore';
import styles from './ReplyItem.module.less';
import { formatDate } from '@/utils/time';


interface IProps extends HTMLAttributes<HTMLDivElement> {
  reply: ReplyDto,
  onReplyTo: Function,
  onDelete?: (parentId: string, commentId: string) => any,
  renderMode?: 'text' | 'markdown',
}

const ReplyItem: React.FC<IProps> = ({
    renderMode = 'text',
    reply,
    onReplyTo,
    onDelete = () => {},
    ...divProps
  }) => {
  const comment = reply;

  const hasMore = comment.replyTo !== undefined || comment.canEdit;
  
  const menu = (
    <Menu>
      {comment.replyTo &&
        <Menu.Item key="0" onClick={() => CommentSingleStore.openDialogModal(comment._id)}>
          查看对话
        </Menu.Item>
      }
      {comment.canEdit && (
        <Menu.Item key="1">
          <Popconfirm
            title="确定要删除这个评论么"
            onConfirm={() => CommentSingleStore.deleteObj(comment._id).then(() => {
              onDelete(comment.parentId, comment._id);
              message.success('删除成功')
            })}
            okText="删除"
            cancelText="取消"
          >
            删除
          </Popconfirm>
        </Menu.Item>
      )}
    </Menu>
  );

  const renderText = () => {
    if (renderMode ==='text') {
      return (
        <span className={styles.replyContentText}>
        : {comment.content}
        </span>
      )
    }

    if (renderMode === 'markdown') {
      return (
        <MarkdownRender content={comment.content} />
      )
    }

    return;
  }

  return (
    <div className={styles.replyItem} {...divProps}>
      <AccountInfoWrapper _id={comment.user._id}>
        <Pendant url={comment.user.pendantUrl} style={{ marginRight: 8 }}>
          <Avatar
            src={comment.user.avatarUrl}
            size='small'
          />
        </Pendant>
      </AccountInfoWrapper>
      <div className={styles.replyMain}>
        <div className={styles.replyContent}>
          <AccountInfoWrapper _id={comment.user._id}>
            <span className={styles.replyUser}>
              {comment.user.nickName}
            </span>
          </AccountInfoWrapper>
          
          {comment.replyTo &&
            <React.Fragment>
              <span>
                回复 
              </span>
              <AccountInfoWrapper _id={comment.replyTo.user._id}>
                <span className={styles.replyTo}>
                  @{comment.replyTo.user.nickName}
                </span>
              </AccountInfoWrapper>
            </React.Fragment>
          }
          {renderText()}
        </div>
        <div className={styles.replyFooter}>
          <div style={{ marginRight: 16 }}>
            {formatDate(new Date(comment.createdAt).getTime())}
          </div>
          <GenericLikeButton
            likeCount={comment.likeCount}
            isLiked={comment.isLiked}
            targetName="Comment"
            targetId={comment._id}
            wrapProps={{
              style: { marginRight: 16 },
            }}
          />
          <div className={styles.clickableText} style={{ marginRight: 16 }} onClick={() => onReplyTo()}>
            回复
          </div>
          
          {hasMore &&
            <Dropdown overlay={menu} trigger={['click']}>
              <EllipsisOutlined 
                className={`${styles.clickableText} ${styles.ellipsis}`}
                style={{ marginLeft: 'auto' }}
              />
            </Dropdown>
          }
        </div>
      </div>
    </div>
  );
}

export default ReplyItem;
export { ReplyItem }
