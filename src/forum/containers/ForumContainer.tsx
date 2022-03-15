import notAuthSVG from "@/assets/svg/notAuth.svg";
import { openTopicPostFuncModal } from "@/forum/components/TopicPostModal";
import {
  ITopicDto,
  TopicListQuery,
  TopicSingleStore,
} from "@/forum/stores/TopicStore";
import HomepageProfile from "@/home/components/HomepageProfile";
import { Select } from "@/lib/antd";
import AppInfo from "@/shared/components/AppInfo";
import Empty from "@/shared/components/Empty";
import InfiniteScrollWrapper from "@/shared/components/InfiniteScrollWrapper";
import ResponsiveContainer from "@/shared/components/ResponsiveContainer";
import ScrollToTop from "@/shared/components/ScrollToTop";
import AuthStore from "@/shared/stores/AuthStore";
import UIStore from "@/shared/stores/UIStore";
import { Button, Card, Col, message, Row } from "antd";
import { SortOrder } from "interfaces/shared/api";
import { observer } from "mobx-react";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { STORAGE_KEYS } from "shared/constants/storage";
import DomainItem from "../components/DomainItem";
import TopicCard from "../components/TopicCard";
import { DomainSingleStore } from "../stores/DomainStore";
import { TopicSortKey } from "../stores/TopicStore";

const { Option } = Select;

const CHOICE_MAP: Record<
  TopicSortKey,
  {
    label: string;
    value: Partial<Record<TopicSortKey, SortOrder>>;
  }
> = {
  [TopicSortKey.CREATED_AT]: {
    label: "全站最新帖",
    value: { [TopicSortKey.CREATED_AT]: SortOrder.DESC },
  },
  [TopicSortKey.LAST_COMMENTED_AT]: {
    label: "最新回复",
    value: { [TopicSortKey.LAST_COMMENTED_AT]: SortOrder.DESC },
  },
  [TopicSortKey.COMMENT_COUNT]: {
    label: "最多回复",
    value: { [TopicSortKey.COMMENT_COUNT]: SortOrder.DESC },
  },
  [TopicSortKey.LIKE_COUNT]: {
    label: "最多点赞",
    value: { [TopicSortKey.LIKE_COUNT]: SortOrder.DESC },
  },
};

const ForumContainer: React.FC = observer(() => {
  const [sort, setSort] = useState(
    (localStorage.getItem(STORAGE_KEYS.ForumSortKey) as TopicSortKey) ||
      TopicSortKey.LAST_COMMENTED_AT
  );

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ForumSortKey, sort);
  }, [sort]);

  return (
    <React.Fragment>
      <Helmet title={`讨论区 | 骰声回响`} />
      <ScrollToTop pathname={`forum`} />

      {/* <CustomizedHeader>
        <HeaderLayout
          className={`${styles.topicDetailHeader}`}
          left={<HeaderBack/>}
          titleProps={{ className: styles.headerTitle }}
          right={(<EllipsisOutlined />)}
        />
      </CustomizedHeader> */}

      <ResponsiveContainer
        mobileAvaliable={false}
        style={{ marginTop: UIStore.isMobile ? 0 : 32 }}
      >
        <Row gutter={16}>
          <Col xs={24} sm={24} md={16}>
            <Card bordered={false} style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                {/* {CHOICE_MAP[sort].label} */}
                <Select
                  bordered={false}
                  value={sort}
                  onChange={(value) => setSort(value)}
                  // className={styles.filterItem}
                >
                  {(Object.keys(CHOICE_MAP) as Array<TopicSortKey>).map(
                    (option) => (
                      <Option key={option} value={option}>
                        {CHOICE_MAP[option].label}
                      </Option>
                    )
                  )}
                </Select>

                {UIStore.isMobile && (
                  <Button
                    type="primary"
                    style={{ marginLeft: "auto" }}
                    onClick={() =>
                      openTopicPostFuncModal({
                        defaultData: {
                          domain: DomainSingleStore.suggestionDomains[0],
                        },
                        onSubmit: async (dto) => {
                          const defaultModDomain =
                            await DomainSingleStore.getDefaultModDomain();
                          TopicSingleStore.createObj({
                            domainId: defaultModDomain._id,
                            ...dto,
                          }).then((obj) => {
                            TopicSingleStore.insertObj(obj);
                            message.success("发布成功");
                          });
                        },
                      })
                    }
                  >
                    发布新帖
                  </Button>
                )}
              </div>
            </Card>
            <InfiniteScrollWrapper<ITopicDto, TopicListQuery>
              cacheKey="forum"
              fetchApi={TopicSingleStore.fetchList}
              query={{ sort: CHOICE_MAP[sort].value }}
              renderList={(data) => (
                <React.Fragment>
                  {data.map((topic) => (
                    <TopicCard topic={topic} key={topic._id} showDomain />
                  ))}
                </React.Fragment>
              )}
            />
          </Col>

          <Col xs={0} sm={0} md={8}>
            {AuthStore.isAuthenticated && (
              <Card bordered={false} style={{ marginBottom: 16 }}>
                <HomepageProfile />

                <Button
                  type="primary"
                  style={{ marginLeft: "auto" }}
                  ghost
                  block
                  onClick={() =>
                    openTopicPostFuncModal({
                      defaultData: {
                        domain: DomainSingleStore.suggestionDomains[0],
                      },
                      onSubmit: async (dto) => {
                        const defaultModDomain =
                          await DomainSingleStore.getDefaultModDomain();
                        TopicSingleStore.createObj({
                          domainId: defaultModDomain._id,
                          ...dto,
                        }).then((obj) => {
                          TopicSingleStore.insertObj(obj);
                          message.success("发布成功");
                        });
                      },
                    })
                  }
                >
                  发布新帖
                </Button>
              </Card>
            )}
            {AuthStore.isAuthenticated && (
              <Card
                title={"加入的板块"}
                bordered={false}
                style={{ marginBottom: 16 }}
              >
                {DomainSingleStore.joinedDomain.length > 0 ? (
                  <React.Fragment>
                    {DomainSingleStore.joinedDomain.map((domain, index) => (
                      <Link to={`/forum/domain/${domain._id}`} key={domain._id}>
                        <DomainItem
                          domain={domain}
                          style={{ marginTop: index === 0 ? 0 : 8 }}
                        />
                      </Link>
                    ))}
                  </React.Fragment>
                ) : (
                  <Empty
                    emptyImageUrl={notAuthSVG}
                    emptyText={"暂未加入任何板块"}
                  />
                )}
              </Card>
            )}

            <AppInfo />
            {/* <Card bordered={false} style={{ marginBottom: 16 }} title='今日最热门板块'>
              <div>
                KP补天中心
              </div>
              <div>
                模组创作交流
              </div>
              <div>
                蛙祭
              </div>
              <div>
                肥皂学校
              </div>
            </Card> */}
          </Col>
        </Row>
      </ResponsiveContainer>
    </React.Fragment>
  );
});
export default ForumContainer;
