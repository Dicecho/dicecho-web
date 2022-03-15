import React from "react";
import { observer } from "mobx-react";
import { Error } from '@/shared/components/Empty';
import qs from "qs";
import _ from 'lodash';
import InfiniteScrollWrapper from "@/shared/components/InfiniteScrollWrapper";
import { Link, useLocation } from "react-router-dom";
import { List } from "antd";
import TagCard from '@/tag/components/TagCard';
import { singleSearchStore } from '../stores/SearchStore';
import { ITag } from "@/shared/stores/TagStore";

interface ISearchQuery {
  keyword: string;
}

const SearchTag: React.FC = observer(() => {
  const location = useLocation();
  const initQuery: Partial<ISearchQuery> = location.search
    ? qs.parse(location.search.replace("?", "")) : {};

  return (
    <div className='container' style={{ paddingTop: 32 }}>
      <InfiniteScrollWrapper<ITag, any>
        cacheKey={`tag-search-${initQuery.keyword}`}
        fetchApi={(query) => singleSearchStore.searchTag(query).then(res => res.data)}
        query={{ keyword: initQuery.keyword }}
        empty={(<Error text='没有搜索到更多内容'/>)}
        renderList={(data) => (
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
            dataSource={data}
            renderItem={(tag) => (
              <List.Item key={tag._id} style={{ marginBottom: 0 }}>
                <Link to={`/tag/${tag._id}`}>
                  <TagCard tag={tag} />
                </Link>
              </List.Item>
            )}
          />
        )}
      />
    </div>
  )
});
export default SearchTag;
