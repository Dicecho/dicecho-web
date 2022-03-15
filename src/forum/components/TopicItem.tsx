import React from "react";
import { observer } from "mobx-react";
import { Avatar, Typography } from "antd";
import { AccountInfoWrapper } from "@/shared/components/AccountInfo";
import { formatDate } from "@/utils/time";
import { ITopicDto } from "../stores/TopicStore";
import styles from "./TopicItem.module.less";

const { Paragraph, Title } = Typography;

interface IProps {
  topic: ITopicDto;
  // onDelete: () => Promise<any>;
  // showMod?: boolean;
}


const TopicItem: React.FC<IProps> = observer(({ topic }) => {

  return (
    <div className={styles.card}>
      <Title level={5}>{topic.title}</Title>
      <div className={styles.topicItemAuthor} style={{ marginBottom: 8 }}>
        <AccountInfoWrapper _id={topic.author._id}>
          <Avatar
            style={{ marginRight: 8 }}
            src={topic.author.avatarUrl}
            size="small"
          />
        </AccountInfoWrapper>
        <AccountInfoWrapper _id={topic.author._id}>
          <div style={{ marginRight: 8, color: "rgba(255,255,255,0.8)" }}>
            {topic.author.nickName}
          </div>
        </AccountInfoWrapper>
      </div>

      <div className={styles.topicItemContent} style={{ marginBottom: 8 }}>
        {topic.isSpoiler ? (
          <i>[可能包含剧透内容]</i>
        ) : (
          <Paragraph
            ellipsis={{ rows: 2, expandable: true, symbol: "展开全部" }}
          >
            {topic.content}
          </Paragraph>
        )}
      </div>

      <div className={styles.topicInfo}>
        <div className={styles.infoItem}>发表于 {formatDate(new Date(topic.createdAt).getTime())}</div>
        <div className={styles.infoItem}>{topic.readCount} 阅读</div>
        <div className={styles.infoItem}>{topic.likeCount} 点赞</div>
        <div className={styles.infoItem}>{topic.commentCount} 评论</div>
      </div>

      {/* <div className={styles.topicInfo}>
      </div> */}
    </div>
  );
});

export default TopicItem;
