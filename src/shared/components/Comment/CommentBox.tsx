import React, { useEffect, useState, HTMLAttributes, useRef } from 'react';
import { observer } from 'mobx-react';
import { Pagination, Spin } from 'antd';
import scrollTo from "antd/lib/_util/scrollTo";
import CommentStore, { ICommentQuery } from '@/shared/stores/CommentStore';
import { CommentItem } from './CommentItem';
import styles from './styles.module.less';
import ReplyInputArea from './ReplyInputArea';
import _ from 'lodash';
import { toJS } from 'mobx';
import { useIsMounted } from 'react-tidy';


interface IProps extends HTMLAttributes<HTMLDivElement> {
  targetName: string,
  targetId: string,
  visible?: boolean,
  onComment?: Function,
  isRich?: boolean,
  showEditor?: boolean,
  query?: Partial<ICommentQuery>
  onExcess?: React.MouseEventHandler<HTMLDivElement> | 'pagination',
  pageSize?: number,
  setPageSize?: (size: number) => void,
}


const CommentBox: React.FC<IProps> = observer(({
  targetName,
  targetId,
  onComment=() => {},
  visible=true,
  showEditor=true,
  isRich=false,
  query={},
  onExcess='pagination',
  pageSize=10,
  setPageSize,
  ...divProps
}) => {
  const [store, setStore] = useState<CommentStore>()
  const [page, setPage] = useState(1);
  const headerRef = useRef<HTMLDivElement>(null);
  const isMounted = useIsMounted();
  // const [pageSize, setPageSize] = useState(defaultPageSize)

  useEffect(() => {
    if (!visible) {
      return;
    }

    const innerQuery = { ...query, pageSize };
    if (
      store !== undefined 
      && store.currentName === targetName 
      && store.currentId === targetId
      && _.isEqual(innerQuery, toJS(store.currentQuery))
    ) {
      return;
    }

    const newStore = new CommentStore();
    newStore.initStore(targetName, targetId, innerQuery);
    setStore(newStore)
  }, [visible, targetName, targetId, query])

  useEffect(() => {
    if (!visible) {
      return;
    }
    if (!store) {
      return;
    }
    const innerQuery = { ...query, pageSize, page };

    store.fetchComments(targetName, targetId, innerQuery).then(() => {
      if (headerRef.current && isMounted()) {
        scrollTo(headerRef.current.getBoundingClientRect().y + window.scrollY);
      }
    })
  }, [pageSize, page])

  if (!store || !visible) {
    return null;
  }

  if (!store.initialized) {
    <div className={styles.loading}>
      <Spin />
    </div>
  }

  return (
    <div {...divProps} className={`${styles.commentBox} ${divProps.className || ''}`}>
      <div ref={headerRef} />
      {showEditor &&
        <ReplyInputArea 
          placeholder="发条评论，请保持善意"
          isRich={isRich}
          onSend={(content: string) => {
            return store.comment(targetName, targetId, content).then(() => {
              onComment()
            })
          }}
          wrapProps={{
            style: { marginBottom: 16 }
          }}
        />
      }
      {store.comments.map((comment) => (
        <CommentItem 
          key={comment._id}
          comment={comment}
          isRich={isRich}
          loadReplies={(page: number) => store.fetchCommentReplies(comment._id, page)}
          onReply={(targetId: string, content: string) => {
            return store.replyTo(targetId, content, comment._id).then(() => {
              onComment()
            })
          }}
          onReplyDelete={(parentId, commentId) => store.onRemoveReply(parentId, commentId)}
          onDelete={(commentId) => store.onRemoveComment(commentId)}
        />
      ))}
      {onExcess === 'pagination' && store.commentsTotal > pageSize &&
        <Pagination
          style={{ marginTop: 8 }}
          // responsive
          showSizeChanger={setPageSize !== undefined}
          defaultCurrent={1}
          current={page}
          pageSize={pageSize}
          total={store.commentsTotal}
          onChange={(p, ps) => {
            setPage(p);
            if (setPageSize) {
              setPageSize(ps || pageSize);
            }
          }}
        />
      }
      {typeof onExcess === 'function' &&
        <div className={styles.readMore} onClick={onExcess}>
          查看更多评论
        </div>
      }
    </div>
  );
})

export default CommentBox;
export { CommentBox }
