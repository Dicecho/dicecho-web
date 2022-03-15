import { openTopicPostFuncModal } from "@/forum/components/TopicPostModal";
import { DomainSingleStore, IDomainDto } from "@/forum/stores/DomainStore";
import {
  ITopicDto,
  TopicListQuery,
  TopicSingleStore,
} from "@/forum/stores/TopicStore";
import { ResponseError } from "@/interfaces/response";
import { Select } from "@/lib/antd";
import { Error } from "@/shared/components/Empty";
import InfiniteScrollWrapper from "@/shared/components/InfiniteScrollWrapper";
import { LoadingAnimation } from "@/shared/components/Loading";
import ResponsiveContainer from "@/shared/components/ResponsiveContainer";
import ScrollToTop from "@/shared/components/ScrollToTop";
import UIStore from "@/shared/stores/UIStore";
import { Avatar, Button, Card, Col, message, Row } from "antd";
import classNames from "classnames";
import { SortOrder } from "interfaces/shared/api";
import { observer } from "mobx-react";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useRouteMatch } from "react-router-dom";
import { useIsMounted } from "react-tidy";
import { STORAGE_KEYS } from "shared/constants/storage";
import DomainAboutWidget from "../components/DomainAboutWidget";
import TopicCard from "../components/TopicCard";
import { TopicSortKey } from "../stores/TopicStore";
import styles from "./DomainContainer.module.less";

const { Option } = Select;

const CHOICE_MAP: Record<
  TopicSortKey,
  {
    label: string;
    value: Partial<Record<TopicSortKey, SortOrder>>;
  }
> = {
  [TopicSortKey.CREATED_AT]: {
    label: "最新帖",
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

const DomainContainer: React.FC = observer(() => {
  const route = useRouteMatch<{ uuid: string }>();
  const isMounted = useIsMounted();
  const [sort, setSort] = useState(
    (localStorage.getItem(STORAGE_KEYS.ForumSortKey) as TopicSortKey) ||
      TopicSortKey.LAST_COMMENTED_AT
  );
  const [err, setErr] = useState<ResponseError>();
  const [domain, setDomain] = useState<IDomainDto>();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ForumSortKey, sort);
  }, [sort]);

  useEffect(() => {
    DomainSingleStore.fetchDomainDetail(route.params.uuid)
      .then((res) => {
        setDomain(res.data);
      })
      .catch((err) => {
        setErr(err);
      })
      .finally(() => {
        if (!isMounted()) {
          return;
        }
        setInitialized(true);
      });
  }, [route.params.uuid]);

  if (!initialized) {
    return (
      <div className={styles.loadingPage}>
        <LoadingAnimation />
      </div>
    );
  }

  if (err) {
    if (err.response?.data.detail) {
      return <Error text={err.response?.data.detail} />;
    }

    return null;
  }

  if (!domain) {
    return null;
  }

  return (
    <React.Fragment>
      <Helmet title={`${domain.title} | 讨论区 | 骰声回响`} />
      <ScrollToTop pathname={`domain/${route.params.uuid}`} />

      {/* <CustomizedHeader>
        <HeaderLayout
          className={`${styles.topicDetailHeader}`}
          left={<HeaderBack/>}
          titleProps={{ className: styles.headerTitle }}
          right={(<EllipsisOutlined />)}
        />
      </CustomizedHeader> */}

      <div className={styles.domainHeader} style={{ marginBottom: 16 }}>
        <div className={styles.domainBanner} />
        <div className={classNames(styles.domainHeaderMain, "container")}>
          <Avatar
            size={64}
            style={{ marginRight: 8 }}
            src={domain.coverUrl}
            className={styles.domainAvatar}
          >
            {domain.title[0]}
          </Avatar>
          <div className={styles.domainTitle} style={{ marginRight: 16 }}>
            {domain.title}
          </div>
          {UIStore.isMobile && (
            <Button
              shape="round"
              type="primary"
              ghost
              danger={domain.joined}
              onClick={() => {
                const api = domain.joined
                  ? () => DomainSingleStore.exitDomain(domain._id)
                  : () => DomainSingleStore.joinDomain(domain._id);

                api().then(() => {
                  message.success(domain.joined ? "退出成功" : "加入成功");
                  setDomain((preDomain) => {
                    if (!preDomain) {
                      return;
                    }
                    preDomain.joined = !preDomain.joined;
                    return { ...preDomain };
                  });
                });
              }}
            >
              {domain.joined ? "退出版块" : "加入版块"}
            </Button>
          )}
        </div>
      </div>

      <ResponsiveContainer mobileAvaliable={false}>
        <Row gutter={16}>
          <Col xs={24} sm={24} md={16}>
            <Card bordered={false} style={{ marginBottom: 16 }}>
              {/* {CHOICE_MAP[sort].label} */}
              <div style={{ display: "flex", alignItems: "center" }}>
                <Select
                  bordered={false}
                  value={sort}
                  onChange={(value) => setSort(value)}
                  // className={styles.filterItem}
                  style={{ marginLeft: "-12px" }}
                >
                  {(Object.keys(CHOICE_MAP) as Array<TopicSortKey>).map(
                    (option) => (
                      <Option key={option} value={option}>
                        {CHOICE_MAP[option].label}
                      </Option>
                    )
                  )}
                </Select>

                <Button
                  type="primary"
                  style={{ marginLeft: "auto" }}
                  onClick={() =>
                    openTopicPostFuncModal({
                      defaultData: {
                        domain,
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
              </div>
            </Card>
            <InfiniteScrollWrapper<ITopicDto, TopicListQuery>
              cacheKey="forum"
              fetchApi={TopicSingleStore.fetchList}
              query={{
                sort: CHOICE_MAP[sort].value,
                filter: {
                  domain: route.params.uuid,
                },
              }}
              renderList={(data) => (
                <React.Fragment>
                  {data.map((topic) => (
                    <TopicCard topic={topic} key={topic._id} />
                  ))}
                </React.Fragment>
              )}
            />
          </Col>

          <Col xs={0} sm={0} md={8}>
            <DomainAboutWidget domain={domain} style={{ marginBottom: 16 }} />
            {/* <AppInfo /> */}
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
export default DomainContainer;
