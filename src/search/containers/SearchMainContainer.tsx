import React, { HTMLAttributes } from "react";
import { observer } from "mobx-react";
import { Error } from '@/shared/components/Empty';
import qs from "qs";
import _ from 'lodash';
import { Link, useLocation } from "react-router-dom";
import { List, Spin } from "antd";
import { RightOutlined } from "@ant-design/icons";
import ModuleList from "@/module/components/ModuleList";
import TagCard from '@/tag/components/TagCard';
import TopicCard from '@/forum/components/TopicCard';
import AccountCard from '@/shared/components/AccountInfo/AccountCard';
import { singleSearchStore } from '../stores/SearchStore';
import styles from "./SearchMainContainer.module.less";

interface ISearchQuery {
  keyword: string;
}

interface ICollectProps extends HTMLAttributes<HTMLDivElement> {
  count: number;
  link: string;
};

const CollectTitle: React.FC<ICollectProps> = ({
  children,
  count,
  link,
  ...props
}) => {
  return (
    <div className={styles.collectTitle} {...props}>
      {children}
      <span className={styles.collectInfo}>（{count}）</span>
      <Link to={link} style={{ marginLeft: 'auto' }}>
        <span className={styles.collectAction}>更多 <RightOutlined /></span>
      </Link>
    </div>
  )
}

const SearchMainContainer: React.FC = observer(() => {
  const location = useLocation();
  const initQuery: Partial<ISearchQuery> = location.search
    ? qs.parse(location.search.replace("?", "")) : {};

  if (!singleSearchStore.isReady) {
    return (
      <div className={styles.loadingPage}>
        <Spin size="large" />
      </div>
    )
  }

  if (singleSearchStore.isEmpty) {
    return <Error text='没有搜到更多内容' />
  }
  
  return (
    <React.Fragment>
      <div className={`container`} style={{ marginTop: 32 }}>
        {singleSearchStore.mods.total > 0 &&
          <React.Fragment>
            <CollectTitle 
              count={singleSearchStore.mods.total}
              link={`/search/module?keyword=${initQuery.keyword}`}
            >
              模组
            </CollectTitle>
            <ModuleList
              grid={{
                // @ts-ignore
                gutter: [40, 16],
                xs: 2,
                sm: 4,
                md: 4,
                lg: 5,
                xl: 6,
                xxl: 8,
              }}
              dataSource={singleSearchStore.mods.datas}
              rowKey="_id"
            />
          </React.Fragment>
        }
        
        {singleSearchStore.tags.total > 0 &&
          <React.Fragment>
            <CollectTitle 
              style={{ margin: '32px 0' }}
              count={singleSearchStore.tags.total}
              link={`/search/tag?keyword=${initQuery.keyword}`}
            >
              标签
            </CollectTitle>
            <List 
              grid={{
                // @ts-ignore
                gutter: [40, 16],
                xs: 2,
                sm: 2,
                md: 2,
                lg: 4,
                xl: 4,
                xxl: 4,
              }}
              dataSource={singleSearchStore.tags.datas}
              renderItem={(tag) => (
                <List.Item key={tag._id} style={{ marginBottom: 0 }}>
                  <Link to={`/tag/${tag._id}`}>
                    <TagCard tag={tag} />
                  </Link>
                </List.Item>
              )}
            />
          </React.Fragment>
        }
        {singleSearchStore.topics.total > 0 &&
          <React.Fragment>
            <CollectTitle
              style={{ margin: '32px 0' }}
              count={singleSearchStore.topics.total}
              link={`/search/topic?keyword=${initQuery.keyword}`}
            >
              帖子
            </CollectTitle>
            {singleSearchStore.topics.datas.map((topic) => 
              <TopicCard topic={topic} key={topic._id} showDomain/>
            )}
          </React.Fragment>
        }

        {singleSearchStore.users.total > 0 &&
          <React.Fragment>
            <CollectTitle 
              style={{ margin: '32px 0' }}
              count={singleSearchStore.users.total}
              link={`/search/user?keyword=${initQuery.keyword}`}
            >
              用户
            </CollectTitle>
            <List 
              grid={{
                // @ts-ignore
                gutter: [40, 16],
                xs: 1,
                sm: 1,
                md: 2,
                lg: 2,
                xl: 3,
                xxl: 3,
              }}
              dataSource={singleSearchStore.users.datas}
              renderItem={(user) => (
                <List.Item key={user._id} style={{ marginBottom: 0 }}>
                  <Link to={`/account/${user._id}`}>
                    <AccountCard _id={user._id} defaultUser={user} />
                  </Link>
                </List.Item>
              )}
            />
          </React.Fragment>
        }
      </div>
    </React.Fragment>
  )
});
export default SearchMainContainer;
