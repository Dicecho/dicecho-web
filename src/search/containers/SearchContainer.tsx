import React, { useEffect, useState } from "react";
import { observer } from "mobx-react";
import { Helmet } from "react-helmet";
import qs from "qs";
import _ from 'lodash';
import { LeftOutlined } from "@ant-design/icons";
import { useHistory, useLocation, NavLink, useRouteMatch, Switch, Route, Redirect } from "react-router-dom";
import { Input, Affix } from "antd";
import {
  HeaderLayout,
  HeaderBack,
  HeaderMenu,
  HeaderNotification,
  HeaderSearch,
} from "@/shared/components/Header";
import CustomizedHeader from "@/shared/layout/CustomizedHeader";
import UIStore from "@/shared/stores/UIStore";
import ModuleSearch from './ModuleSearchContainer';
import styles from "./SearchContainer.module.less";
import { singleSearchStore } from '../stores/SearchStore';
import SearchMainContainer from "./SearchMainContainer";
import SearchTag from "./SearchTag";
import SearchTopic from "./SearchTopic";
import SearchUser from "./SearchUser";



const { Search } = Input;

interface ISearchQuery {
  keyword: string;
}

const SearchContainer: React.FC = observer(() => {
  const history = useHistory();
  const location = useLocation();
  const route = useRouteMatch();
  const initQuery: Partial<ISearchQuery> = location.search
    ? qs.parse(location.search.replace("?", "")) : {};
  
  const defaultKeyword = initQuery.keyword || UIStore.searchText || '';
  const [keyword, setKeyword] = useState(defaultKeyword)

  const tabItems = [
    {
      link: "",
      title: "综合",
      exact: true,
    },
    {
      link: "module",
      title: `模组(${singleSearchStore.mods.total})`,
    },
    {
      link: "tag",
      title: `标签(${singleSearchStore.tags.total})`,
    },
    {
      link: "topic",
      title: `讨论帖(${singleSearchStore.topics.total})`,
    },
    {
      link: "user",
      title: `用户(${singleSearchStore.users.total})`,
    },
  ]

  useEffect(() => {
    if (UIStore.searchText !== '') {
      return;
    }

    const query: Partial<ISearchQuery> = location.search
      ? qs.parse(location.search.replace("?", "")) : {};

    if (query.keyword === '') {
      return;
    }

    UIStore.setSearchText(query.keyword)
  }, [])

  useEffect(() => {
    if (!initQuery.keyword) {
      return;
    }
  
    if (initQuery.keyword === keyword) {
      return;
    }
    setKeyword(initQuery.keyword)
  }, [initQuery.keyword])

  useEffect(() => {
    singleSearchStore.fetchCollectDatas(keyword);
  }, [keyword])

  useEffect(() => {
    UIStore.setSearchVisible(false);
  
    return () => {
      UIStore.setSearchVisible(true);
    }
  }, [])
  
  if (UIStore.isMobile) {
    return (
      <React.Fragment>
      <CustomizedHeader>
        <HeaderLayout
          left={<HeaderBack><LeftOutlined /></HeaderBack>}
          title={<HeaderSearch />}
          titleProps={{
            style: { 
              margin: '0 24px',
            }
          }}
          right={<HeaderNotification />}
        />
      </CustomizedHeader>
      <Helmet title={`${initQuery.keyword} | 搜索结果 | 骰声回响`} />
        <div className={`${styles.headerTabs} ${styles.mobileHeaderTabs} container`}>
          {tabItems.map((tab) => (
            <NavLink
              key={tab.link}
              exact={tab.exact}
              activeClassName={styles.headerTabActive}
              replace={true}
              to={`${route.url}${tab.link ? "/" : ''}${tab.link}?keyword=${keyword}`}
              className={styles.headerTab}
            >
              <span className={styles.headerTabText}>{tab.title}</span>
            </NavLink>
          ))}
        </div>
        <div style={{ height: 32 }} />
  
        <Switch>
          <Route exact path={`${route.url}`} component={SearchMainContainer} />
          <Route path={`${route.url}/module`} component={ModuleSearch} />
          <Route path={`${route.url}/topic`} component={SearchTopic} />
          <Route path={`${route.url}/tag`} component={SearchTag} />
          <Route path={`${route.url}/user`} component={SearchUser} />
          <Redirect to={`${route.url}`} />
        </Switch>
      </React.Fragment>
    )
  }

  
  return (
    <React.Fragment>
    <Helmet title={`${initQuery.keyword} | 搜索结果 | 骰声回响`} />
      <div className={`${styles.searchHeader}`}>
        <Search
          size="large"
          className={styles.searchInput}
          style={{ marginBottom: 32 }}
          placeholder="搜索模组/标签/帖子/用户"
          allowClear
          defaultValue={defaultKeyword}
          value={UIStore.searchText}
          onChange={(e) => UIStore.setSearchText(e.target.value)}
          onSearch={(value) => {
            setKeyword(value)
            const query: Partial<ISearchQuery> = location.search
              ? qs.parse(location.search.replace("?", "")) : {};
            if (query.keyword === value) {
              return;
            }

            Object.assign(query, { keyword: value })

            history.replace({ search: qs.stringify(query) });
          }}
        />

        <div className={`${styles.headerTabs}`}>
          {tabItems.map((tab) => (
            <NavLink
              key={tab.link}
              exact={tab.exact}
              activeClassName={styles.headerTabActive}
              replace={true}
              to={`${route.url}${tab.link ? "/" : ''}${tab.link}?keyword=${keyword}`}
              className={styles.headerTab}
            >
              <span className={styles.headerTabText}>{tab.title}</span>
            </NavLink>
          ))}
        </div>
      </div>

      <Switch>
        <Route exact path={`${route.url}`} component={SearchMainContainer} />
        <Route path={`${route.url}/module`} component={ModuleSearch} />
        <Route path={`${route.url}/topic`} component={SearchTopic} />
        <Route path={`${route.url}/tag`} component={SearchTag} />
        <Route path={`${route.url}/user`} component={SearchUser} />
        <Redirect to={`${route.url}`} />
      </Switch>
    </React.Fragment>
  )


});
export default SearchContainer;
