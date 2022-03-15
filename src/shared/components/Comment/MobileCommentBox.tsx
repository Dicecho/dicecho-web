import React, { useEffect, useState, HTMLAttributes, useRef } from "react";
import { observer } from "mobx-react";
import { Spin, Input } from "antd";
import CommentStore, { CommentDto, ICommentQuery } from "@/shared/stores/CommentStore";
import { MobileCommentItem } from "./MobileCommentItem";
import InfiniteScroll from "react-infinite-scroller";
import styles from "./MobileCommentBox.module.less";
import notAuthSVG from "@/assets/svg/notAuth.svg";
import Empty from "@/shared/components/Empty";
import MobileReplyInputArea from "./MobileReplyInputArea";
import { TextAreaRef, TextAreaProps } from "antd/lib/input/TextArea";
import CustomizedFooter from "@/shared/layout/CustomizedFooter";
import _ from 'lodash';
import { toJS } from "mobx";

interface IProps extends HTMLAttributes<HTMLDivElement> {
  targetName: string;
  targetId: string;
  query?: Partial<ICommentQuery>
  onComment?: Function;
}

const MobileCommentBox: React.FC<IProps> = observer(
  ({
    targetName,
    targetId,
    query = {},
    onComment = () => {},
    ...divProps
  }) => {
    // const [store, setStore] = useState<CommentStore>();
    const [replyTo, setReplyTo] = useState<CommentDto>();
    const [replyToParent, setReplyToParent] = useState<CommentDto>();
    const storeRef = React.useRef(new CommentStore());
    const inputRef = useRef<TextAreaRef>(null);
    const store = storeRef.current;

    useEffect(() => {
      if (
        store !== undefined 
        && store.currentName === targetName 
        && store.currentId === targetId 
        && _.isEqual(query, toJS(store.currentQuery))
      ) {
        return;
      }

      store.initStore(targetName, targetId, query);
    }, [targetName, targetId, query]);

    useEffect(() => {
      if (!inputRef.current) {
        return;
      }


      inputRef.current.focus();
    }, [replyTo])

    const handleSend = (value: string) => {
      if (replyTo) {
        return store
          .replyTo(replyTo._id, value, replyToParent?._id)
          .then(() => {
            onComment();
          });
      }

      return store.comment(targetName, targetId, value);
    }

    return (
      <React.Fragment>
        <CustomizedFooter visible={false} />
        <div className={styles.commentBoxFooter}>
          <MobileReplyInputArea
            key={'MobileReplyInputArea'}
            ref={inputRef}
            placeholder={
              replyTo ? `回复 @${replyTo.user.nickName}` : "发条评论，请保持善意"
            }
            onSend={handleSend}
            wrapProps={{ className: styles.footerInput }}
          />
        </div>

        <div
          {...divProps}
          className={`${styles.commentBox} ${divProps.className || ""}`}
        >
          <InfiniteScroll
            initialLoad={false}
            pageStart={0}
            loadMore={() => store.loadNext()}
            hasMore={store.commentsHasNext}
          >
            {!store.initialized ? (
              <div className={styles.loadingPage}>
                <Spin size='large' />
              </div>
            ) : store.commentsTotal === 0 ? (
              <Empty emptyImageUrl={notAuthSVG} emptyText={"没有更多评论了"} />
            ) : (
              <React.Fragment>
              {store.comments.map((comment) => (
                <MobileCommentItem
                  key={comment._id}
                  comment={comment}
                  loadReplies={(page: number) =>
                    store.fetchCommentReplies(comment._id, page)
                  }
                  onReply={(target: CommentDto) => {
                    setReplyTo(target)
                    setReplyToParent(comment)
                  }}
                  onReplyDelete={(parentId, commentId) =>
                    store.onRemoveReply(parentId, commentId)
                  }
                  onDelete={(commentId) => store.onRemoveComment(commentId)}
                />
              ))}
              </React.Fragment>
            )}
            {store.initialized && store.loading && (
              <div className={styles.scrollLoading}>
                <Spin size={"large"} />
              </div>
            )}
          </InfiniteScroll>
        </div>
      </React.Fragment>
    );
  }
);



export default MobileCommentBox;
export { MobileCommentBox };
