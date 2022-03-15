import ModuleWidget from "@/module/components/ModuleWidget";
import { AccountInfoWrapper } from "@/shared/components/AccountInfo";
import AttitudeLikeButton from "@/shared/components/AttitudeLikeButton";
import { MarkdownRender } from "@/shared/components/MarkdownEditor";
import { formatDate } from "@/utils/time";
import { CommentOutlined, EyeOutlined } from "@ant-design/icons";
import { Avatar, Card, Typography } from "antd";
import { observer } from "mobx-react";
import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { ITopicDto } from "../stores/TopicStore";
import styles from "./TopicCard.module.less";

const { Paragraph, Title } = Typography;

interface IProps {
  topic: ITopicDto;
  showDomain?: boolean;
  // onDelete: () => Promise<any>;
  // showMod?: boolean;
}

const FOLD_LIMIT = 150;

const TopicCard: React.FC<IProps> = observer(
  ({ topic, showDomain = false }) => {
    const history = useHistory();
    const [spoiler, setSpoiler] = useState(topic.isSpoiler);

    return (
      <Card
        bordered={false}
        className={styles.card}
        onClick={(e) => {
          e.preventDefault();
          if (e.metaKey) {
            window.open(`/forum/topic/${topic._id}`, "_blank");
            return;
          }

          history.push(`/forum/topic/${topic._id}`);
        }}
      >
        {showDomain ? (
          <div
            className={styles.topicItemDomain}
            style={{ marginBottom: 8 }}
            onClick={(e) => e.stopPropagation()}
          >
            <Link to={`/forum/domain/${topic.domain._id}`}>
              <Avatar
                style={{ marginRight: 8 }}
                src={topic.domain.coverUrl}
                size="default"
              >
                {topic.domain.title[0]}
              </Avatar>
            </Link>
            <div className={styles.topicItemDomainContent}>
              <Link to={`/forum/domain/${topic.domain._id}`}>
                <div style={{ marginRight: 8, color: "rgba(255,255,255,0.8)" }}>
                  {topic.domain.title}
                </div>
              </Link>
              <div className={styles.topicItemDomainAuthor}>
                <AccountInfoWrapper _id={topic.author._id}>
                  {topic.author.nickName}
                </AccountInfoWrapper>
                <span style={{ margin: "0 8px" }}>·</span>
                <div className={styles.infoItem}>
                  {formatDate(new Date(topic.createdAt).getTime(), {
                    simple: true,
                  })}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div
            className={styles.topicItemAuthor}
            style={{ marginBottom: 8 }}
            onClick={(e) => e.stopPropagation()}
          >
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
            <div className={styles.infoItem}>
              {formatDate(new Date(topic.createdAt).getTime(), {
                simple: true,
              })}
            </div>
          </div>
        )}

        <Link
          to={`/forum/topic/${topic._id}`}
          onClick={(e) => e.stopPropagation()}
        >
          <Title level={5}>{topic.title}</Title>
        </Link>
        <div style={{ width: "100%" }}>
          {topic.relatedMods.map((mod) => (
            <ModuleWidget mod={mod} tiny />
          ))}
        </div>
        <div className={`${styles.previewContent}`} style={{ marginBottom: 8 }}>
          <MarkdownRender
            content={topic.content.slice(0, 200)}
            className={`${spoiler ? styles.spoiler : ""}`}
          />
          {spoiler && (
            <div className={styles.previewSpoiler}>
              此内容可能包含剧透
              <a
                onClick={(e) => {
                  e.stopPropagation();
                  setSpoiler(false);
                }}
              >
                [显示]
              </a>
            </div>
          )}
          <div className={styles.previewMask} />
        </div>

        {/* <div className={styles.topicItemContent} style={{ marginBottom: 8 }}>
        {topic.isSpoiler ? (
          <i>[可能包含剧透内容]</i>
        ) : (
          <Paragraph
            ellipsis={{ rows: 2, expandable: true, symbol: "展开全部" }}
          >
            {topic.content}
          </Paragraph>
        )}
      </div> */}

        <div
          className={styles.topicActions}
          style={{ marginLeft: -8 }}
          onClick={(e) => e.stopPropagation()}
        >
          <AttitudeLikeButton
            likeCount={topic.likeCount}
            isLiked={topic.isLiked}
            isDisliked={topic.disLiked}
            targetName="Topic"
            targetId={topic._id}
            className={styles.likeBtn}
            wrapProps={{ style: { marginLeft: 8 } }}
          />

          <div className={styles.comment} style={{ marginLeft: 8 }}>
            <CommentOutlined
              className={styles.commentIcon}
              style={{ marginRight: 8 }}
            />
            <div>{topic.commentCount}</div>
          </div>

          <div className={styles.action} style={{ marginLeft: 8 }}>
            <EyeOutlined
              className={styles.actionIcon}
              style={{ marginRight: 8 }}
            />
            {topic.readCount}
          </div>
        </div>
        {/* 
      <div className={styles.topicInfo}>
        <div className={styles.infoItem}>{topic.readCount} 阅读</div>
        <div className={styles.infoItem}>{topic.likeCount} 点赞</div>
        <div className={styles.infoItem}>{topic.commentCount} 评论</div>
      </div> */}

        {/* <div className={styles.topicInfo}>
      </div> */}
      </Card>
    );
  }
);

export default TopicCard;
