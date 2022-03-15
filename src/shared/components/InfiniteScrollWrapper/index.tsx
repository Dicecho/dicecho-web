import React, { useEffect, useState, useImperativeHandle } from "react";
import { observer } from "mobx-react";
import { toJS } from 'mobx';
import InfiniteScroll from "react-infinite-scroller";
import notAuthSVG from "@/assets/svg/notAuth.svg";
import MemoryStore from "@/shared/stores/MemoryStore";
import { InifiniteScrollStore } from "./InifiniteScrollStore";
import Empty from "@/shared/components/Empty";
import { PaginatedResponse, PageableQuery } from "interfaces/shared/api";
import { Spin } from "antd";
import _ from 'lodash';
import styles from "./styles.module.less";

export interface InfiniteScrollWrapperProps<
  DTO extends Object,
  Query extends PageableQuery,
> {
  fetchApi: (query: Partial<PageableQuery>) => Promise<PaginatedResponse<DTO>>;
  renderList: (data: Array<DTO>) => React.ReactNode;
  empty?: React.ReactNode;
  loading?: React.ReactNode;
  query?: Partial<Query>;
  cacheKey?: string;
}

interface IForceUpdateDto<D> {
  data?: Array<D>,
  page?: number,
  initialized?: boolean,
  hasNext?: boolean,
  total?: number,
  lastQuery?: any,
}

interface IGetData<DTO> {
  data: Array<DTO>,
  page: number,
  initialized: boolean,
  hasNext: boolean,
  total: number,
  lastQuery: any,
}

export interface ISW<D extends Object = {}> {
  refresh: () => Promise<any>;
  remove: (index: number) => any;
  forceUpdate: (dto: IForceUpdateDto<D>) => any;
  getData: () => IGetData<D>
}

function InfiniteScrollWrapperInner<DTO extends Object = {}, Query extends PageableQuery = PageableQuery>(
  {
    query = {},
    fetchApi,
    renderList,
    empty,
    cacheKey,
  }: InfiniteScrollWrapperProps<DTO, Query>,
  ref: React.ForwardedRef<ISW<DTO>>,
) {
  const store: InifiniteScrollStore | undefined = (() => {
    if (!cacheKey) {
      return;
    }
    if (MemoryStore.hasStore(cacheKey)) {
      return MemoryStore.stores[cacheKey] as InifiniteScrollStore;
    }

    const nStore = new InifiniteScrollStore()
    MemoryStore.addStore(cacheKey, nStore);

    return nStore;
  })()

  const [total, setTotal] = useState(store?.total || 0);
  const [page, setPage] = useState(query.page || store?.page || 1);
  const [hasNext, setHasNext] = useState<boolean>(store?.hasNext || false);
  const [data, setData] = useState<Array<DTO>>(store?.data || []);
  const [lastQuery, setLastQuery] = useState({});
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(store?.initialized || false);
  const pageSize = query.pageSize || 10;

  useEffect(() => {
    if (!store || !initialized) {
      return;
    }

    if (!store.initialized) {
      setInitialized(false);
      _fetchApi(query)
      return;
    }

    setTotal(store.total)
    setPage(store.page)
    setHasNext(store.hasNext)
    setData(store.data)
    setInitialized(store.initialized);
  }, [cacheKey])

  const _fetchApi = (query: Partial<Query>) => {
    fetchApi(query).then((res) => {
      if (store) {
        store.data = res.data;
        store.page = res.page;
        store.initialized = true;
        store.hasNext = res.hasNext;
        store.total = res.totalCount;
        store.lastQuery = query;
      }
      setData(res.data);
      setPage(res.page);
      setInitialized(true);
      setHasNext(res.hasNext);
      setTotal(res.totalCount);
      setLastQuery(query);
    });
  }

  useEffect(() => {
    if (initialized) {
      return;
    }

    _fetchApi(query)
  }, []);

  useEffect(() => {
    if (!initialized) {
      return;
    }

    if (store && _.isEqual(query, toJS(store.lastQuery))) {
      return;
    }

    if (_.isEqual(query, lastQuery)) {
      return;
    }

    setLastQuery(query);
    _fetchApi(query)
  }, [query])

  async function loadNext() {
    if (loading || !hasNext) {
      return;
    }

    const innerQuery: any = {
      ...query,
      page: page + 1,
      pageSize,
    };

    setLoading(true);
    return fetchApi(innerQuery)
      .then((res) => {
        if (store) {
          store.data = [...store.data.concat(res.data)];
          store.page = res.page;
          store.hasNext = res.hasNext;
          store.total = res.totalCount;
        }
        setData((preData) => {
          return [...preData.concat(res.data)];
        });
        setPage(res.page);
        setHasNext(res.hasNext);
        setTotal(res.totalCount);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  async function refresh() {
    setInitialized(false);
    console.log('refresh')
    _fetchApi(query)
  }

  function forceUpdate(updateDto: IForceUpdateDto<DTO>) {
    if (store) {
      store.data = updateDto.data || data;
      store.page = updateDto.page || page;
      store.initialized = updateDto.initialized || initialized;
      store.hasNext = updateDto.hasNext || hasNext;
      store.total = updateDto.total || total;
      store.lastQuery = updateDto.lastQuery || query;
    }
    updateDto.data && setData(updateDto.data);
    updateDto.page && setPage(updateDto.page);
    updateDto.initialized && setInitialized(updateDto.initialized);
    updateDto.hasNext && setHasNext(updateDto.hasNext);
    updateDto.total && setTotal(updateDto.total);
    updateDto.lastQuery && setLastQuery(updateDto.lastQuery);
  }

  function getData() {
    return {
      data,
      page,
      initialized,
      hasNext,
      total,
      lastQuery,
    }
  }

  function remove(index: number) {
    if (store) {
      store.data.splice(index, 1);
      store.data = [...store.data];
    }
    setData((preData) => {
      preData.splice(index, 1);
      return [...preData];
    });
  }

  useImperativeHandle(ref, () => ({
    refresh,
    remove,
    forceUpdate,
    getData,
  }));

  const renderEmpty = () => {
    if (empty) {
      return empty
    }

    return (
      <Empty emptyImageUrl={notAuthSVG} emptyText={"暂无内容"} />
    )
  }

  return (
    <InfiniteScroll
      initialLoad={false}
      pageStart={0}
      loadMore={() => loadNext()}
      hasMore={hasNext}
    >
      {!initialized ? (
        <div className={styles.loadingPage}>
          <Spin size="large" />
        </div>
      ) : total === 0 
          ? renderEmpty()
          : renderList(data)
      }
      {initialized && loading && (
        <div className={styles.scrollLoading}>
          <Spin size={"large"} />
        </div>
      )}
    </InfiniteScroll>
  );
};

const InfiniteScrollWrapper = observer(React.forwardRef(InfiniteScrollWrapperInner)) as <D extends Object = {}, Q extends PageableQuery = PageableQuery>(
  props: InfiniteScrollWrapperProps<D, Q> & { ref?: React.ForwardedRef<ISW<D>> }
) => ReturnType<typeof InfiniteScrollWrapperInner>;

export default InfiniteScrollWrapper;
