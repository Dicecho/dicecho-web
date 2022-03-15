import React, { useEffect, useState, useRef } from "react";
import { observer } from "mobx-react";
import { Helmet } from "react-helmet";
import { STORAGE_KEYS } from "shared/constants/storage";
import { Pendant } from "@/shared/components/Pendant";
import ModuleWidget from '@/module/components/ModuleWidget';
import {
  useRouteMatch,
  useHistory,
  Link,
} from "react-router-dom";
import DomainAboutWidget from '../components/DomainAboutWidget';
import AppInfo from "@/shared/components/AppInfo";
import { MarkdownRender } from "@/shared/components/MarkdownEditor";
import ScrollToTop from "@/shared/components/ScrollToTop";
import AttitudeLikeButton from "@/shared/components/AttitudeLikeButton";
import ResponsiveContainer from "@/shared/components/ResponsiveContainer";
import CustomizedHeader from "@/shared/layout/CustomizedHeader";
import { HeaderLayout, HeaderBack } from '@/shared/components/Header'
import { LoadingAnimation } from "@/shared/components/Loading";
import { CommentBox, MobileCommentBox } from "@/shared/components/Comment";
import { Typography, Popconfirm, Card, Avatar, Col, Row, message, Select } from "antd";
import {
  CommentOutlined,
  EditOutlined,
  DeleteOutlined,
  EllipsisOutlined,
} from "@ant-design/icons";
import { formatDate } from "@/utils/time";
import { SortOrder } from "interfaces/shared/api";
import { CommentDto, CommentSortKey } from '@/shared/stores/CommentStore';
import { TopicSingleStore, ITopicDto } from "../stores/TopicStore";
import { DomainSingleStore, IDomainDto } from "../stores/DomainStore";
import { AccountInfoWrapper } from "@/shared/components/AccountInfo";
import TopicUpdateModal from "@/forum/components/TopicUpdateModal";
import UIStore from "@/shared/stores/UIStore";
import styles from "./TopicContainer.module.less";

const { Title } = Typography;
const { Option } = Select;

const COMMENT_SORT_MAP: Record<string, {
  label: string;
  value: Partial<Record<CommentSortKey, SortOrder>>;
}> = {
  'created': { label: '最早回复', value: { [CommentSortKey.CREATED_AT]: SortOrder.ASC } },
  '-created': { label: '最新回复',   value: { [CommentSortKey.CREATED_AT]: SortOrder.DESC } },
  'like': { label: '最多点赞',   value: { [CommentSortKey.LIKE_COUNT]: SortOrder.DESC } },
}

const TopicContainer: React.FC = observer(() => {
  const route = useRouteMatch<{ uuid: string }>();
  const history = useHistory();
  const [sort, setSort] = useState('created');
  const [pageSize, setPageSize] = useState(
    parseInt(localStorage.getItem(STORAGE_KEYS.TopicCommentPageSize) || '10')
  );
  const [domain, setDomain] = useState<IDomainDto | undefined>();
  const [topic, setTopic] = useState<ITopicDto | undefined>();
  const [editVisible, setEditVisible] = useState(false);
  const [initialized, setInitialized] = useState(
    topic && topic._id === route.params.uuid
  );

  useEffect(() => {
    if (initialized && topic && topic._id === route.params.uuid) {
      return;
    }

    (async () => {
      const result = await TopicSingleStore.fetchDetail(route.params.uuid)
        .then((res) => {
          setTopic(res.data);
          return res.data;
        })
        .finally(() => {
          setInitialized(true);
        });
  
      await DomainSingleStore.fetchDomainDetail(result.domain._id)
        .then((res) => {
          setDomain(res.data);
        })
    })()

  }, [route.params.uuid, initialized]);

  if (!initialized || !topic) {
    return (
      <div className={styles.loadingPage}>
        <LoadingAnimation />
      </div>
    );
  }

  return (
    <React.Fragment>
      <Helmet title={`${topic.title} | ${topic.domain.title} | 讨论区 | 骰声回响`} />
      <ScrollToTop />

      <CustomizedHeader>
        <HeaderLayout
          className={`${styles.topicDetailHeader}`}
          left={<HeaderBack/>}
          titleProps={{ className: styles.headerTitle }}
          title={topic.title}
          right={(<EllipsisOutlined />)}
        />
      </CustomizedHeader>
  
      <ResponsiveContainer mobileAvaliable={false} style={{ marginTop: UIStore.isMobile ? 0 : 32 }}>
        <Row gutter={16}>
          <Col xs={24} sm={24} md={16}>
            <Card
              bordered={false}
              className={styles.topic}
              style={{ marginBottom: 8 }}
            >
              <Title level={3} className={styles.topicTitle}>
                {topic.title}
              </Title>

              <div className={styles.topicAuthor} style={{ marginBottom: 8 }}>
                <AccountInfoWrapper _id={topic.author._id}>
                  <Pendant style={{ marginRight: 8 }} url={topic.author.pendantUrl}>
                    <Avatar
                      src={topic.author.avatarUrl}
                      size="small"
                    />
                  </Pendant>
                </AccountInfoWrapper>
                <AccountInfoWrapper _id={topic.author._id}>
                  <div style={{ color: "rgba(255,255,255,0.8)" }}>
                    {topic.author.nickName}
                  </div>
                </AccountInfoWrapper>
              </div>

              <div className={styles.topicInfo} style={{ marginBottom: 8 }}>
                <div className={styles.infoItem}>{topic.readCount} 阅读</div>
                <div className={styles.infoItem}>{topic.likeCount} 点赞</div>
                <div className={styles.infoItem}>{topic.commentCount} 评论</div>
              </div>

              {topic.relatedMods.map(mod => (
                <Link to={`/module/${mod._id}`} style={{ width: "100%" }}>
                  <ModuleWidget tiny mod={mod} />
                </Link>
              ))}

              {/* <div className={styles.topicTags} style={{ marginBottom: 16 }}>
                <Tag>{topic.domain.title}</Tag> 
              </div> */}

              <div className={styles.topicContent} style={{ marginBottom: 16 }}>
                <MarkdownRender content={topic.content} />
              </div>

              <div
                className={styles.topicFooterInfo}
                style={{ marginBottom: 8 }}
              >
                发表于 {formatDate(new Date(topic.createdAt).getTime())}
              </div>

              <div className={styles.topicActions}>
                <AttitudeLikeButton
                  likeCount={topic.likeCount}
                  isLiked={topic.isLiked}
                  isDisliked={topic.disLiked}
                  targetName="Topic"
                  targetId={topic._id}
                  className={styles.likeBtn}
                  wrapProps={{ style: { margin: 4 } }}
                />

                <div className={styles.comment} style={{ marginLeft: 4 }}>
                  <CommentOutlined
                    className={styles.commentIcon}
                    style={{ marginRight: 8 }}
                  />
                  <div>{topic.commentCount}</div>
                </div>
                {topic.canEdit && (
                  <div 
                    className={styles.action}
                    style={{ marginLeft: 4 }}
                    onClick={() => setEditVisible(true)}
                  >
                    <EditOutlined
                      className={styles.actionIcon}
                      style={{ marginRight: 8 }}
                    />
                    编辑
                  </div>
                )}
                {topic.canEdit && (
                  <Popconfirm
                    title="确定要删除这个评价么"
                    onConfirm={() => TopicSingleStore.deleteObj(topic._id).then(() => {
                      message.success('删除成功')
                      history.goBack()
                    })}
                    okText="删除"
                    cancelText="取消"
                  >
                    <div
                      className={`${styles.action} ${styles.danger}`}
                      style={{ marginLeft: 4 }}
                    >
                      <DeleteOutlined
                        className={styles.actionIcon}
                        style={{ marginRight: 8 }}
                      />
                      删除
                    </div>
                  </Popconfirm>
                )}
              </div>
            </Card>
            <Card bordered={false} title={(
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {topic.commentCount} 条评论
                <Select
                  style={{ marginLeft: 'auto' }}
                  bordered={false}
                  value={sort}
                  onChange={(value) => setSort(value)}
                >
                  {Object.keys(COMMENT_SORT_MAP).map((option) => (
                    <Option key={option} value={option}>
                      {COMMENT_SORT_MAP[option].label}
                    </Option>
                  ))}
                </Select>
              </div>
            )}>
              {/* <div>
                {topic.commentCount} 条评论
              </div> */}
              {UIStore.isMobile 
                ? <MobileCommentBox 
                    targetName="Topic"
                    targetId={topic._id}
                    query={{ sort: COMMENT_SORT_MAP[sort].value }}
                    onComment={() =>
                      setTopic((preTopic) =>
                        preTopic
                          ? { ...preTopic, commentCount: preTopic.commentCount + 1 }
                          : undefined
                      )
                    }
                  />
                : <CommentBox
                  targetName="Topic"
                  targetId={topic._id}
                  isRich
                  query={{ sort: COMMENT_SORT_MAP[sort].value }}
                  pageSize={pageSize}
                  setPageSize={(size: number) => {
                    setPageSize(size)
                    localStorage.setItem(STORAGE_KEYS.TopicCommentPageSize, size.toString());
                  }}
                  onComment={() =>
                    setTopic((preTopic) =>
                      preTopic
                        ? { ...preTopic, commentCount: preTopic.commentCount + 1 }
                        : undefined
                    )
                  }
                />
              }
            </Card>
          </Col>

          <Col xs={0} sm={0} md={8}>
            <DomainAboutWidget domain={domain} style={{ marginBottom: 16 }} />
            <AppInfo />
          </Col>
        </Row>
      </ResponsiveContainer>

      <TopicUpdateModal
        topic={topic}
        visible={editVisible}
        onCancel={() => setEditVisible(false)}
        onSend={(dto) => TopicSingleStore.updateObj(topic._id, dto).then((res) => {
          message.success('更新成功')
          setTopic(res);
        })}
      />
    </React.Fragment>
  );
});
export default TopicContainer;
