import React, { useEffect, useState } from "react";
import { observer } from "mobx-react";
import { Select } from '@/lib/antd';
import {
  IRateListQuery,
  SortOrder,
  RateSortKey,
  RateView,
} from "interfaces/shared/api";
import { RateType } from '@/rate/interfaces';
import { STORAGE_KEYS } from "shared/constants/storage";
import RateStore from "@/rate/stores/RateStore";
import SettingStore from '@/shared/stores/SettingStore';
import styles from "./RateFilter.module.less";

const { Option } = Select;

export const RateSortKeyMap: {
  [key: string]: string
} = {
  // [ModSortKey.ID]: '编号',
  [RateSortKey.HAPPY_COUNT]: "欢乐",
  [RateSortKey.RATE_AT]: "评价时间",
  [RateSortKey.LIKE_COUNT]: "点赞数",
  [RateSortKey.RATE]: "分数",
};

export const RATE_VIEW_MAP = {
  [RateView.PL]: "玩家视角",
  [RateView.KP]: "主持人视角",
  [RateView.OB]: "观战视角",
};

export enum RemarkType {
  All = 0,
  Short = 1,
  Long = 2,
}

export const RemarkTypeMap = {
  // [ModSortKey.ID]: '编号',
  [RemarkType.All]: "带字评价",
  [RemarkType.Short]: "短评",
  [RemarkType.Long]: "长评",
};

export enum RateHierarchy {
  Low = 0,
  Mid = 1,
  High = 2,
}

export const RateHierarchyMap = {
  // [ModSortKey.ID]: '编号',
  [RateHierarchy.Low]: "差评",
  [RateHierarchy.Mid]: "中评",
  [RateHierarchy.High]: "好评",
};

interface IProps {
  onChange: (query: Partial<IRateListQuery>) => any;
}

const RateFilter: React.FC<IProps> = observer(({ ...props }) => {
  const [type, setType] = useState(RateType.Rate);
  const [sortKey, setSortKey] = useState<RateSortKey>(
    (localStorage.getItem(STORAGE_KEYS.RateSortKey) as RateSortKey) ||
      RateSortKey.LIKE_COUNT
  );
  const [sortOrder, setSortOrder] = useState<SortOrder>(
    (parseInt(
      localStorage.getItem(STORAGE_KEYS.RateSortOrder) || "-1"
    ) as SortOrder) || SortOrder.DESC
  );
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(
    parseInt(localStorage.getItem(STORAGE_KEYS.RatePageSize) || "10")
  );

  const [view, setView] = useState<RateView | undefined>(undefined);

  const defaultRemarkType = (() => {
    const storage = localStorage.getItem(STORAGE_KEYS.RateRemarkType)
    if (!storage || storage === '') {
      return RemarkType.All
    }

    return parseInt(storage)
  })()

  const [remarkType, setRemarkType] = useState<RemarkType | undefined>(defaultRemarkType);
  const [hierarchy, setHierarchy] =
    useState<RateHierarchy | undefined>(undefined);

  useEffect(() => {
    const pageChanged = RateStore.ratesPage !== page;
    const query: Partial<IRateListQuery> = {
      sort: { [sortKey]: sortOrder },
      page: pageChanged ? page : 1,
      pageSize,
      filter: {
        view,
        type,
        rate: getHierarchyFilter(hierarchy),
        remarkLength: getRemarkFilter(remarkType),
      },
    };
    props.onChange(query)
  }, [
    sortKey,
    sortOrder,
    type,
    page,
    pageSize,
    view,
    hierarchy,
    remarkType,
  ]);

  const getHierarchyFilter = (hierarchy?: RateHierarchy) => {
    if (hierarchy === undefined) {
      return undefined;
    }
    if (hierarchy === RateHierarchy.Low) {
      return { $lt: 4 };
    }
    if (hierarchy === RateHierarchy.High) {
      return { $gt: 6 };
    }
    return { $gte: 4, $lte: 6 };
  };

  const getRemarkFilter = (remarkType?: RemarkType) => {
    if (remarkType === undefined) {
      return undefined;
    }
    if (remarkType === RemarkType.Short) {
      return { $gt: 1, $lte: 140 };
    }
    if (remarkType === RemarkType.Long) {
      return { $gt: 140 };
    }
    return { $gt: 1 };
  };

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.RateRemarkType, remarkType ? remarkType.toString() : "");
  }, [remarkType]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.RateSortKey, sortKey);
    localStorage.setItem(STORAGE_KEYS.RateSortOrder, sortOrder.toString());
    localStorage.setItem(STORAGE_KEYS.RatePageSize, pageSize.toString());
  }, [sortKey, sortOrder, pageSize]);

  return (
    <React.Fragment>
      <Select
        allowClear
        placeholder="筛选评价类型"
        value={remarkType}
        onChange={(value) => setRemarkType(value)}
        className={styles.filterItem}
      >
        {(
          Object.keys(RemarkTypeMap).map((key) =>
            parseInt(key)
          ) as Array<RemarkType>
        ).map((option) => (
          <Option key={option} value={option}>
            {RemarkTypeMap[option]}
          </Option>
        ))}
      </Select>
      {SettingStore.rateScoreAvailable && type === RateType.Rate && 
        <Select
          allowClear
          placeholder="筛选评分"
          value={hierarchy}
          onChange={(value) => setHierarchy(value)}
          className={styles.filterItem}
        >
          {(
            Object.keys(RateHierarchyMap).map((key) =>
              parseInt(key)
            ) as Array<RateHierarchy>
          ).map((option) => (
            <Option key={option} value={option}>
              {RateHierarchyMap[option]}
            </Option>
          ))}
        </Select>
      }
      {type === RateType.Rate && 
        <Select
          allowClear
          placeholder="筛选视角"
          value={view}
          onChange={(view) => setView(view)}
          className={styles.filterItem}
        >
          {(
            Object.keys(RATE_VIEW_MAP).map((key) =>
              parseInt(key)
            ) as Array<RateView>
          ).map((option) => (
            <Option key={option} value={option}>
              {RATE_VIEW_MAP[option]}
            </Option>
          ))}
        </Select>
      }
    </React.Fragment>
  );
});
export default RateFilter;
