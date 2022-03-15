import React from "react";
import { Error } from '@/shared/components/Empty';
import { observer } from "mobx-react";
import qs from "qs";
import _ from 'lodash';
import InfiniteScrollWrapper from "@/shared/components/InfiniteScrollWrapper";
import { useLocation } from "react-router-dom";
import TopicCard from '@/forum/components/TopicCard';
import { singleSearchStore } from '../stores/SearchStore';
import { ITopicDto } from "@/forum/stores/TopicStore";

interface ISearchQuery {
  keyword: string;
}

const SearchTopic: React.FC = observer(() => {
  const location = useLocation();
  const initQuery: Partial<ISearchQuery> = location.search
    ? qs.parse(location.search.replace("?", "")) : {};

  return (
    <div className='container' style={{ paddingTop: 32 }}>
      <InfiniteScrollWrapper<ITopicDto, any>
        cacheKey={`topic-search-${initQuery.keyword}`}
        fetchApi={(query) => singleSearchStore.searchTopic(query).then(res => res.data)}
        empty={(<Error text='没有搜索到更多内容'/>)}
        query={{ keyword: initQuery.keyword }}
        renderList={(data) => (
          <React.Fragment>
            {data.map((topic) => 
              <TopicCard topic={topic} key={topic._id} showDomain/>
            )}
          </React.Fragment>
        )}
      />
    </div>
  )
});
export default SearchTopic;
