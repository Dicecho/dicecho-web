import { IModListQuery } from "@/interfaces/shared/api";
import ModuleFilter, {
  getDefaultQuery,
} from "@/module/components/ModuleFilter";
import ModuleList from "@/module/components/ModuleList";
import ModuleStore from "@/module/stores/ModuleStore";
import AppInfo from "@/shared/components/AppInfo";
import { LoadingAnimation } from "@/shared/components/Loading";
import ScrollRestoration from "@/shared/components/ScrollRestoration";
import CustomizedHeader from "@/shared/layout/CustomizedHeader";
import AuthStore from "@/shared/stores/AuthStore";
import UIStore from "@/shared/stores/UIStore";
import {
  CloudUploadOutlined,
  FilterOutlined,
  PlusCircleOutlined,
  SearchOutlined,
  SyncOutlined,
  VerticalAlignTopOutlined,
} from "@ant-design/icons";
import {
  Affix,
  BackTop,
  Button,
  Card,
  Col,
  Drawer,
  Dropdown,
  Input,
  Menu,
  Row,
  Spin,
} from "antd";
import scrollTo from "antd/lib/_util/scrollTo";
import _ from "lodash";
import { toJS } from "mobx";
import { observer } from "mobx-react";
import qs from "qs";
import React, { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet";
import InfiniteScroll from "react-infinite-scroller";
import { Link, useHistory, useLocation } from "react-router-dom";
import styles from "./ModuleContainer.module.less";

const { Search } = Input;

const ModuleContainer: React.FC = observer(() => {
  const history = useHistory();
  const location = useLocation();
  const initQuery: Partial<IModListQuery> = getDefaultQuery(
    location.search
      ? qs.parse(location.search.replace("?", ""))
      : toJS(ModuleStore.lastFilterQuery)
  );

  const needRefresh = ModuleStore.modules.length === 0;
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const [_query, setQuery] = useState<Partial<IModListQuery>>(initQuery);
  const query = useMemo(
    () => ({
      keyword: initQuery.keyword,
      ..._query,
    }),
    [_query, initQuery.keyword]
  );

  const [initialized, setInitialized] = useState(
    !needRefresh && !ModuleStore.hasUpdated(query)
  );

  useEffect(() => {
    UIStore.setSearchVisible(false);

    return () => {
      UIStore.setSearchVisible(true);
    };
  }, []);

  useEffect(() => {
    if (!_.isEqual(qs.stringify(query), location.search.replace("?", ""))) {
      history.replace({ search: qs.stringify(query) });
    }

    if (initialized) {
      return;
    }

    UIStore.setSearchText(initQuery.keyword);
    ModuleStore.initModuleFilterConfig();
    ModuleStore.initModuleList(query).then(() => {
      setInitialized(true);
    });
  }, []);

  useEffect(() => {
    if (!initialized || loading) {
      return;
    }

    if (!ModuleStore.hasUpdated(query)) {
      return;
    }

    scrollTo(0);
    ModuleStore.initModuleList(query);

    history.replace({ search: qs.stringify(query) });
  }, [initialized, query]);

  const refresh = () => {
    setInitialized(false);
    scrollTo(0);
    ModuleStore.initModuleList(query).then(() => {
      setInitialized(true);
    });
  };

  const loadNext = () => {
    if (loading) {
      return;
    }

    setLoading(true);
    ModuleStore.loadNext(query).finally(() => {
      setLoading(false);
    });
  };

  const renderList = () => {
    if (!initialized) {
      return (
        <div className={styles.loadingPage}>
          <LoadingAnimation />
        </div>
      );
    }

    return (
      <InfiniteScroll
        initialLoad={false}
        pageStart={0}
        loadMore={loadNext}
        hasMore={ModuleStore.modulesHasNext}
        // useWindow={false}
        // getScrollParent={() => document.getElementById("scrollableContent")}
      >
        <ModuleList
          grid={{
            // @ts-ignore
            gutter: [40, 24],
            xs: 2,
            sm: 3,
            md: 3,
            lg: 4,
            xl: 4,
            xxl: 5,
          }}
          dataSource={ModuleStore.modules}
        />
        {loading && (
          <div className={styles.scrollLoading}>
            <Spin size={"large"} />
          </div>
        )}
      </InfiniteScroll>
    );
  };

  const renderFilter = () => {
    return (
      <React.Fragment>
        <ModuleFilter
          defaultQuery={initQuery}
          onChange={(query) => setQuery(query)}
          loading={loading}
          onClear={() => {
            UIStore.setSearchText("");
            history.push(`/module?keyword=`);
          }}
        />
        <Button
          block
          ghost
          style={{ marginTop: 16 }}
          onClick={() =>
            ModuleStore.getRandom(query).then((res) =>
              history.push(`/module/${res.data._id}`)
            )
          }
        >
          随便看看
        </Button>
      </React.Fragment>
    );
  };

  return (
    <React.Fragment>
      <Helmet title={`模组 | 骰声回响`} />
      <ScrollRestoration
        uniqueKey="module-list"
        disabled={!initialized || UIStore.isMobile}
      />
      <CustomizedHeader options={{ layoutProps: { style: {} } }} />
      {UIStore.isMobile && (
        <React.Fragment>
          <div className={styles.fixedFilterBar}>
            <div className={`${styles.fixedFilterBarContent} container`}>
              搜索到{" "}
              {initialized ? (
                ModuleStore.modulesTotal > 1000 ? (
                  "1000+"
                ) : (
                  ModuleStore.modulesTotal
                )
              ) : (
                <Spin size="small" />
              )}{" "}
              个模组
              <div style={{ marginLeft: "auto" }} />
              {AuthStore.isAuthenticated && (
                <Dropdown
                  overlay={
                    <Menu>
                      <Menu.Item key="0">
                        <Link to="/module/submission/">模组投稿</Link>
                      </Menu.Item>
                      <Menu.Item key="1">
                        <Link to="/module/addition/check/">添加讨论词条</Link>
                      </Menu.Item>
                    </Menu>
                  }
                  trigger={["click"]}
                >
                  <PlusCircleOutlined onClick={(e) => e.preventDefault()} />
                </Dropdown>
              )}
              <FilterOutlined
                style={{ marginLeft: 16 }}
                onClick={() => setDrawerVisible(true)}
              />
            </div>
          </div>
          <div style={{ height: 32 }} />
        </React.Fragment>
      )}
      <div className="container" style={{ paddingTop: 32, marginBottom: 32 }}>
        <Row gutter={16}>
          <Col xs={24} sm={24} md={16}>
            {!UIStore.isMobile && (
              <div className={styles.modListHeader}>
                <Search
                  size="large"
                  className={styles.searchInput}
                  placeholder="输入模组名称/介绍/原作者名来搜索模组"
                  allowClear
                  defaultValue={UIStore.searchText || initQuery.keyword}
                  value={UIStore.searchText}
                  onChange={(e) => UIStore.setSearchText(e.target.value)}
                  onSearch={(value) => {
                    history.push(`/module?keyword=${value}`);
                  }}
                  enterButton={
                    <Button
                      type="primary"
                      icon={<SearchOutlined />}
                      className="ant-input-search-button"
                    >
                      搜索
                    </Button>
                  }
                />
                {/* <div className={styles.searchTags}>
                  {tags.length > 0 &&
                    tags.map((tag: string) => (
                      <Tag
                        key={tag}
                        className={styles.searchTag}
                        closable
                        onClose={() => {
                          setTags((tags) => [...tags.filter((t) => t !== tag)]);
                        }}
                      >
                        {tag}
                      </Tag>
                    ))}
                  {filter && filter.isForeign && (
                    <Tag
                      key={filter.isForeign.toString()}
                      className={styles.searchTag}
                      closable
                      onClose={() => {
                        setFilter({ ...filter, isForeign: undefined });
                      }}
                    >
                      {filter.isForeign ? "词条" : "投稿模组"}
                    </Tag>
                  )}
                </div> */}
                <div className={styles.infoText}>
                  搜索到{" "}
                  {initialized ? (
                    ModuleStore.modulesTotal > 1000 ? (
                      "1000+"
                    ) : (
                      ModuleStore.modulesTotal
                    )
                  ) : (
                    <Spin size="small" />
                  )}{" "}
                  个模组
                </div>
              </div>
            )}
            {renderList()}
          </Col>
          <Col xs={0} sm={0} md={8}>
            <Affix offsetTop={80}>
              <div>
                {AuthStore.isAuthenticated && (
                  <React.Fragment>
                    <Link to="/module/submission">
                      <Button
                        block
                        type="primary"
                        icon={<CloudUploadOutlined />}
                        style={{ marginBottom: 16 }}
                      >
                        模组投稿
                      </Button>
                    </Link>
                    <Link to="/module/addition">
                      <Button
                        block
                        type="primary"
                        ghost
                        icon={<PlusCircleOutlined />}
                        style={{ marginBottom: 16 }}
                      >
                        添加讨论词条
                      </Button>
                    </Link>
                  </React.Fragment>
                )}
                <Card
                  title="筛选"
                  bordered={false}
                  style={{ marginBottom: 16 }}
                >
                  {renderFilter()}
                </Card>
                <AppInfo />
              </div>
            </Affix>
          </Col>
        </Row>
      </div>

      <Drawer
        title="筛选"
        placement="right"
        closable={true}
        onClose={() => setDrawerVisible(false)}
        visible={drawerVisible}
      >
        {renderFilter()}
      </Drawer>

      <div
        className={`ant-back-top ${styles.siderActionBtn}`}
        style={{ bottom: 120 }}
      >
        <div
          className={`${styles.backTop} ${styles.hoverRotate}`}
          onClick={() => refresh()}
        >
          <SyncOutlined />
        </div>
      </div>

      <BackTop className={styles.siderActionBtn} style={{ bottom: 80 }}>
        <div className={styles.backTop}>
          <VerticalAlignTopOutlined />
        </div>
      </BackTop>
    </React.Fragment>
  );
});
export default ModuleContainer;
