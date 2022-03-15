import React from "react";
import { observer } from "mobx-react";
import { Error } from '@/shared/components/Empty';
import qs from "qs";
import _ from 'lodash';
import InfiniteScrollWrapper from "@/shared/components/InfiniteScrollWrapper";
import { Link, useLocation } from "react-router-dom";
import AccountCard from '@/shared/components/AccountInfo/AccountCard';
import { List } from "antd";
import { singleSearchStore } from '../stores/SearchStore';
import { IUserDto } from "@/rate/interfaces";

interface ISearchQuery {
  keyword: string;
}

const SearchUser: React.FC = observer(() => {
  const location = useLocation();
  const initQuery: Partial<ISearchQuery> = location.search
    ? qs.parse(location.search.replace("?", "")) : {};

  return (
    <div className='container' style={{ paddingTop: 32 }}>
      <InfiniteScrollWrapper<IUserDto, any>
        cacheKey={`user-search-${initQuery.keyword}`}
        fetchApi={(query) => singleSearchStore.searchUser(query).then(res => res.data)}
        query={{ keyword: initQuery.keyword }}
        empty={(<Error text='没有搜索到更多内容'/>)}
        renderList={(data) => (
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
            dataSource={data}
            renderItem={(user) => (
              <List.Item key={user._id} style={{ marginBottom: 0 }}>
                <Link to={`/account/${user._id}`}>
                  <AccountCard _id={user._id} defaultUser={user} />
                </Link>
              </List.Item>
            )}
          />
        )}
      />
    </div>
  )
});
export default SearchUser;
