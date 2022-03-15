import React, { useState } from 'react';
import { Pagination, Avatar, Dropdown, Menu, Popconfirm, message } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import { Pendant } from "@/shared/components/Pendant";
import { MarkdownRender } from '@/shared/components/MarkdownEditor';
import { AccountInfoWrapper } from '@/shared/components/AccountInfo';
import GenericLikeButton from '@/shared/components/GenericLikeButton';
import { ParentCommentDto, CommentDto, CommentSingleStore } from '@/shared/stores/CommentStore';
import { ReplyItem } from './ReplyItem';
import { formatDate } from '@/utils/time';
import UIStore from '@/shared/stores/UIStore';
import styles from './MobileCommentItem.module.less';


interface IProps {
  comment: ParentCommentDto,
  loadReplies: (page: number) => Promise<any>,
  onReply: (comment: CommentDto) => any,
  onDelete?: (commentId: string) => any,
  onReplyDelete?: (parentId: string, commentId: string) => any,
}


const MobileCommentItem: React.FC<IProps> = ({
  onDelete = () => {},
  onReplyDelete = () => {},
  ...props
}) => {
  const [loadingReplies, setLoadingReplies] = useState(false);

  const hasMore = props.comment.canEdit;
  
  const menu = (
    <Menu>
      {props.comment.canEdit && (
        <Menu.Item key="1">
          <Popconfirm
            title="确定要删除这个评价么"
            onConfirm={() => CommentSingleStore.deleteObj(props.comment._id).then(() => {
              onDelete(props.comment._id);
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

  return (
    <div className={styles.commentItem}>
      <div className={styles.commentMain}>
        <div className={styles.commentUser} style={{ marginBottom: UIStore.isMobile ? 8 : 0 }}>
          {UIStore.isMobile &&
            <AccountInfoWrapper _id={props.comment.user._id}>
              <Pendant url={props.comment.user.pendantUrl} style={{ marginRight: 8 }}>
                <Avatar
                  size="small"
                  src={props.comment.user.avatarUrl}
                />
              </Pendant>
            </AccountInfoWrapper>
          }
          <AccountInfoWrapper _id={props.comment.user._id}>
            {props.comment.user.nickName}
          </AccountInfoWrapper>
        </div>

        <div className={styles.commentContent}>
          <MarkdownRender content={props.comment.content} />
        </div>
        <div className={styles.commentFooter}>
          <div style={{ marginRight: 16 }}>
            {formatDate(new Date(props.comment.createdAt).getTime())}
          </div>
          <GenericLikeButton
            likeCount={props.comment.likeCount}
            isLiked={props.comment.isLiked}
            targetName="Comment"
            targetId={props.comment._id}
            wrapProps={{
              style: { marginRight: 16 },
            }}
          />
          <div 
            className={styles.clickableText} 
            onClick={() => props.onReply(props.comment)}
          >
            {props.comment.repliesCount > 0 ? `${props.comment.repliesCount} 回复` : '回复'}
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
        <div className={styles.commentReplies}>
          {props.comment.replies.map(reply => (
            <ReplyItem 
              reply={reply}
              key={reply._id}
              onReplyTo={() => props.onReply(reply)}
              onDelete={onReplyDelete}
            />
          ))}
          {props.comment.repliesCount > 10 && props.comment.repliesPagination.load &&
            <Pagination 
              defaultCurrent={props.comment.repliesPagination.page}
              pageSize={10}
              total={props.comment.repliesPagination.total}
              disabled={loadingReplies}
              onChange={(page: number) => {
                setLoadingReplies(true);
                props.loadReplies(page).finally(() => {
                  setLoadingReplies(false);
                })
              }}
            />
          }
          {props.comment.repliesCount > 3 && !props.comment.repliesPagination.load && 
            <div>
              共 {props.comment.repliesCount} 条回复，
              <a onClick={() => props.loadReplies(1)}>
                点击查看
              </a>
            </div>
          }
        </div>
      </div>
    </div>
  );
}

export default MobileCommentItem;
export { MobileCommentItem }
