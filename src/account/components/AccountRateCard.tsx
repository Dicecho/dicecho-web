import React, { useEffect, useRef, useState } from "react";
import { observer } from "mobx-react";
import { Select } from '@/lib/antd';
import InfiniteScroll from "react-infinite-scroller";
import { List, Button, Spin, Card } from "antd";
import { CardProps } from 'antd/lib/card'
import {
  SortAscendingOutlined,
  SortDescendingOutlined,
} from "@ant-design/icons";
import {
  IRateListQuery,
  SortOrder,
  RateSortKey,
  IRateDto,
  RateType,
} from "interfaces/shared/api";
import { STORAGE_KEYS } from "shared/constants/storage";
import RateItem from "@/rate/components/RateItem";
import RateStore from "@/rate/stores/RateStore";
import notAuthSVG from "@/assets/svg/notAuth.svg";
import Empty from "@/shared/components/Empty";
import { IAccountDto } from '../stores/AccountStore';
import styles from './AccountRateCard.module.less';

const { Option } = Select;

interface IProps extends CardProps {
  user: IAccountDto,
  isMark?: boolean,
}

export const RateSortKeys = [RateSortKey.RATE_AT, RateSortKey.LIKE_COUNT, RateSortKey.RATE];

export const RateSortKeyMap: {
  [key: string]: string
} = {
  // [ModSortKey.ID]: '编号',
  [RateSortKey.RATE_AT]: "评价时间",
  [RateSortKey.LIKE_COUNT]: "点赞数",
  [RateSortKey.RATE]: "分数",
};

const AccountRateCard: React.FC<IProps> = observer(({ user, isMark = false, ...props }) => {
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1);
  const [rates, setRates] = useState<Array<IRateDto>>([])
  const [sortKey, setSortKey] = useState<RateSortKey>(
    (localStorage.getItem(STORAGE_KEYS.AccountRateSortKey) as RateSortKey) ||
      RateSortKey.RATE_AT
  );
  const [sortOrder, setSortOrder] = useState<SortOrder>(
    (parseInt(
      localStorage.getItem(STORAGE_KEYS.AccountRateSortOrder) || "-1"
    ) as SortOrder) || SortOrder.DESC
  );

  const [initialized, setInitialized] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasNext, setHasNext] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);

  const pageSize = 10;

  useEffect(() => {
    const query: Partial<IRateListQuery> = {
      userId: user._id,
      pageSize,
      filter: {
        type: isMark ? RateType.Mark : RateType.Rate,
      },
      sort: { [sortKey]: sortOrder },
    };

    setLoading(true);
    RateStore.fetchModuleRateListApi(query).then((res) => {
      setRates(res.data)
      setPage(res.page);
      setHasNext(res.hasNext);
      setTotal(res.totalCount)
      setInitialized(true);
    }).finally(() => {
      setLoading(false);
    });
  }, [user._id, sortKey, sortOrder]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.AccountRateSortKey, sortKey);
    localStorage.setItem(STORAGE_KEYS.AccountRateSortOrder, sortOrder.toString());
  }, [sortKey, sortOrder])

  async function loadNext() {
    if (loading) {
      return;
    }

    const query: Partial<IRateListQuery> = {
      userId: user._id,
      page: page + 1,
      pageSize,
      filter: {
        type: isMark ? RateType.Mark : RateType.Rate,
      },
      sort: { [sortKey]: sortOrder },
    };

    setLoading(true);
    return RateStore.fetchModuleRateListApi(query).then((res) => {
      setRates((preData) => {
        return [...preData.concat(res.data)];
      });
      setPage(res.page);
      setHasNext(res.hasNext);
      setTotal(res.totalCount)
      setInitialized(true);
    }).finally(() => {
      setLoading(false);
    });
  }

  const renderContent = () => {
    return (
      <InfiniteScroll
        initialLoad={false}
        pageStart={0}
        loadMore={() => loadNext()}
        hasMore={hasNext}
      >
        {!initialized ? (
          <div className={styles.loadingPage}>
            <Spin size='large' />
          </div>
        ) : total === 0 ? (
          <Empty emptyImageUrl={notAuthSVG} emptyText={"暂无评价"} />
        ) : (
          <List
            dataSource={rates}
            rowKey="_id"
            renderItem={(item, index) => (
              <RateItem
                showMod
                rate={item}
                onRemoved={() => {
                  let nRates = rates;
                  nRates.splice(index, 1)
                  setRates([...nRates])
                }}
              />
            )}
          />
        )}
        {initialized && loading && (
          <div className={styles.scrollLoading}>
            <Spin size={"large"} />
          </div>
        )}
      </InfiniteScroll>
    );
  };

  return (
    <React.Fragment>
      <div ref={headerRef} />
      <Card
        {...props}
        bordered={false}
        title={(
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ margin: '0px 4px' }}>
              {initialized 
                ? total
                : <Spin style={{ display: 'flex' }} />
              }
            </span>
            {isMark ? '想玩' : '评价'}
            <div className={styles.sortSelectorGroup} style={{ marginLeft: 'auto' }}>
              <Select
                className={styles.sortSelector}
                value={sortKey}
                onChange={(value) => setSortKey(value)}
                placeholder="排序"
              >
                {RateSortKeys.map((option) => (
                  <Option key={option} value={option}>
                    {RateSortKeyMap[option] || ''}
                  </Option>
                ))}
              </Select>
              <Button
                className={styles.sortSelectorBtn}
                onClick={() =>
                  setSortOrder(
                    sortOrder === SortOrder.ASC ? SortOrder.DESC : SortOrder.ASC
                  )
                }
                icon={
                  sortOrder === SortOrder.ASC ? (
                    <SortAscendingOutlined />
                  ) : (
                    <SortDescendingOutlined />
                  )
                }
              />
            </div>
          </div>
        )}
      >
        {renderContent()}
      </Card>
    </React.Fragment>
  );
});
export default AccountRateCard;
