import React, { useEffect, useRef, useState, useMemo } from "react";
import { observer } from "mobx-react";
import notAuthSVG from "@/assets/svg/notAuth.svg";
import Empty from "@/shared/components/Empty";
import ScrollRestoration from "@/shared/components/ScrollRestoration";
import InfiniteScrollWrapper, { ISW } from "@/shared/components/InfiniteScrollWrapper";
import { useHistory, Link, useLocation } from "react-router-dom";
import {
  Button,
  Row,
  Col,
  Card,
  Spin,
  Drawer,
  Affix,
  BackTop,
  List,
} from "antd";
import {
  FilterOutlined,
  VerticalAlignTopOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import AppInfo from "@/shared/components/AppInfo";
import ModuleItem from "@/module/components/ModuleItem";
import ModuleFilter from "@/module/components/ModuleFilter";
import ModuleStore from "@/module/stores/ModuleStore";
import { IModDto, IModListQuery } from "@/interfaces/shared/api";
import UIStore from "@/shared/stores/UIStore";
import qs from "qs";
import _ from 'lodash';
import styles from "./ModuleSearchContainer.module.less";

const ModuleSearchContainer: React.FC = observer(() => {
  const history = useHistory();
  const location = useLocation();
  const initQuery: Partial<IModListQuery> = location.search
    ? qs.parse(location.search.replace("?", "")) : {}

  const [_query, setQuery] = useState<Partial<IModListQuery>>(initQuery);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [initialized, setInitialized] = useState(false);

  const query = useMemo(() => ({
    keyword: initQuery.keyword,
    ..._(_query).omitBy(_.isNil).omitBy(_.isEmpty).value(),
  }), [_query, initQuery.keyword])


  useEffect(() => {
    if (!initialized || loading) {
      return;
    }

    if (_.isEqual(initQuery, query)) {
      return;
    }

    history.replace({ search: qs.stringify(query) });
  }, [initialized, loading, query]);

  const changeQuery = (q: Partial<IModListQuery>) => {
    setQuery(q);
  }

  const ref = useRef<ISW<IModDto>>(null);

  useEffect(() => {
    if (!_.isEqual(qs.stringify(query), location.search.replace("?", ""))) {
      history.replace({ search: qs.stringify(query) });
    }

    UIStore.setSearchText(initQuery.keyword)
    ModuleStore.initModuleFilterConfig();
  }, []);

  const refresh = () => {
    if (!ref.current) {
      return;
    }

    ref.current.refresh()
  }

  const fetchApi = (query: Partial<IModListQuery>) => {
    setLoading(true);
    return ModuleStore.fetchModuleList(query).then((res) => {
      setTotal(res.totalCount);
      return res
    }).finally(() => {
      setLoading(false);
      setInitialized(true);
    })
  }

  const renderList = () => {
    return (
      <InfiniteScrollWrapper<IModDto, IModListQuery>
        ref={ref}
        fetchApi={fetchApi}
        cacheKey={`search-mod-${initQuery.keyword}`}
        query={query}
        empty={(
          <Empty emptyImageUrl={notAuthSVG} emptyText={"没有更多模组了"} />
        )}
        renderList={(data) => (
          <List
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
            dataSource={data}
            renderItem={(module: IModDto) => (
              <List.Item key={module._id} style={{ marginBottom: 0 }}>
                <Link to={`/module/${module._id}`}>
                  <ModuleItem module={module} />
                </Link>
              </List.Item>
            )}
          />
        )}
      />
    )
  };

  const renderFilter = () => {
    return (
      <React.Fragment>
        <ModuleFilter
          defaultQuery={initQuery}
          onChange={(query) => changeQuery(query)}
          loading={loading}
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
      {UIStore.isMobile && (
        <React.Fragment>
          <div className={styles.fixedFilterBar}>
            <div className={`${styles.fixedFilterBarContent} container`}>
              搜索到{" "}
              {initialized ? total : <Spin size="small" />}{" "}
              个模组
              <div style={{ marginLeft: "auto" }} />
              <FilterOutlined
                style={{ marginLeft: 16 }}
                onClick={() => setDrawerVisible(true)}
              />
            </div>
          </div>
          <div style={{ height: 32 }}/>
        </React.Fragment>
      )}
      <div className="container" style={{ paddingTop: 32, marginBottom: 32 }}>
        <Row gutter={16}>
          <Col xs={24} sm={24} md={16}>
            {renderList()}
          </Col>
          <Col xs={0} sm={0} md={8}>
            <Affix offsetTop={80}>
              <div>
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
export default ModuleSearchContainer;
