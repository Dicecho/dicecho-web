import React, { useEffect, useState } from "react";
import { observer } from "mobx-react";
import { Select } from '@/lib/antd';
import { Button } from "antd";
import {
  SortAscendingOutlined,
  SortDescendingOutlined,
} from "@ant-design/icons";
import { STORAGE_KEYS } from "shared/constants/storage";
import ModuleStore from "@/module/stores/ModuleStore";
import TagSelect from "@/shared/components/TagSelect";
import { IModListQuery } from "@/interfaces/shared/api";
import {
  ModSortKey,
  SortOrder,
  IModFilter,
  ModSortKeyMap,
  TagFilterMode,
} from "../interfaces/ApiResponse";
import _ from 'lodash';
import SettingStore from "@/shared/stores/SettingStore";
import TagStore from "@/shared/stores/TagStore";
import styles from "./ModuleFilter.module.less";
import { LanguageCodes_MAP } from "@/utils/language";

const { Option } = Select;


function range(size: number, startAt: number = 0) {
  return [...Array(size).keys()].map((i) => i + startAt);
}

function playersToQuery(players: Array<number>) {
  const sortedList = players.sort((a, b) => a - b);
  return {
    minPlayer: sortedList[0],
    maxPlayer: sortedList[sortedList.length - 1],
  };
}

function queryToPlayers(query: {
  minPlayer: number | string;
  maxPlayer?: number | string;
}) {
  const { minPlayer, maxPlayer } = query;
  const min = parseInt(`${minPlayer}`);
  const max = parseInt(`${maxPlayer || minPlayer}`);
  const size = max - min + 1;
  return range(size, min);
}


export function getDefaultQuery(initQuery: Partial<IModListQuery>): Partial<IModListQuery> {
  const sortKey = (Object.keys(initQuery.sort || {}) as Array<ModSortKey>)[0] ||
    localStorage.getItem(STORAGE_KEYS.ModuleSortKey) ||
    ModSortKey.LAST_RATE_AT;
  const sortOrder = (Object.values(initQuery.sort || {}) as Array<SortOrder>)[0] ||
    parseInt(localStorage.getItem(STORAGE_KEYS.ModuleSortOrder) || "-1") ||
    SortOrder.DESC;

  return {
    pageSize: initQuery.pageSize || 12,
    sort: { [sortKey]: sortOrder },
    filter: initQuery.filter,
    tags: initQuery.tags || [],
    origins: initQuery.origins || [],
    tagsMode: initQuery.tagsMode || TagFilterMode.ALL,
    minPlayer: initQuery.minPlayer,
    maxPlayer: initQuery.maxPlayer,
    ...initQuery
  }
}

interface IFilterProps {
  loading?: boolean;
  defaultQuery?: Partial<IModListQuery>;
  onChange?: (query: Partial<IModListQuery>) => any;
  onClear?: () => any;
}

const ModuleFilter: React.FC<IFilterProps> = observer(({
  loading = false,
  defaultQuery = {},
  onChange = () => {},
  onClear = () => {},
  ...props
}) => {

  const FilterSortKeys = [
    ModSortKey.CREATED_AT,
    ModSortKey.LAST_EDIT_AT,
    ModSortKey.RELEASE_DATE,
    ...(SettingStore.rateAvailable 
      ? [
        ModSortKey.RATE_COUNT,
        ModSortKey.LAST_RATE_AT,
      ]
      : []),
    ...(SettingStore.rateAvailable && SettingStore.rateScoreAvailable
      ? [
        ModSortKey.RATE_AVG,
      ]
      : []),
  ];

  const [pageSize, setPageSize] = useState<number>(defaultQuery.pageSize || 12);
  const [origins, setOrigins] = useState<Array<string>>(
    defaultQuery.origins || []
  );
  const [players, setPlayers] = useState<Array<number>>(
    defaultQuery.minPlayer
      ? queryToPlayers({
          minPlayer: defaultQuery.minPlayer,
          maxPlayer: defaultQuery.maxPlayer,
        })
      : []
  );
  const [languages, setLanguages] = useState<Array<string>>(defaultQuery.languages || []);
  const [tags, setTags] = useState<Array<string>>(defaultQuery.tags || []);
  const [tagsMode, setTagsMode] = useState<TagFilterMode>(
    defaultQuery.tagsMode || TagFilterMode.ALL
  );
  const [sortKey, setSortKey] = useState<ModSortKey>(
    (Object.keys(defaultQuery.sort || {}) as Array<ModSortKey>)[0] ||
      localStorage.getItem(STORAGE_KEYS.ModuleSortKey) ||
      ModSortKey.LAST_RATE_AT
  );
  const [sortOrder, setSortOrder] = useState<SortOrder>(
    (Object.values(defaultQuery.sort || {}) as Array<SortOrder>)[0] ||
      parseInt(localStorage.getItem(STORAGE_KEYS.ModuleSortOrder) || "-1") ||
      SortOrder.DESC
  );
  const [filter, setFilter] = useState<Partial<IModFilter> | undefined>(
    defaultQuery.filter
  );

  useEffect(() => {
    const playerQuery = playersToQuery(players);
    const innerQuery: Partial<IModListQuery> = {
      pageSize,
      sort: { [sortKey]: sortOrder },
      filter,
      tags,
      origins,
      tagsMode,
      languages,
      ...playerQuery,
    };

    onChange(innerQuery);
    localStorage.setItem(STORAGE_KEYS.ModuleSortKey, sortKey);
    localStorage.setItem(STORAGE_KEYS.ModuleSortOrder, sortOrder.toString());
  }, [
    pageSize,
    sortKey,
    sortOrder,
    filter,
    tags,
    languages,
    origins,
    players,
    tagsMode,
  ]);

  return (
    <React.Fragment>
      <Select
        allowClear
        value={filter?.moduleRule}
        onChange={(value) => setFilter({ ...filter, moduleRule: value })}
        placeholder="应用规则"
        loading={loading}
        style={{ width: "100%" }}
      >
        {ModuleStore.rules.map((rule) => (
          <Option key={rule.key} value={rule.key}>
            {rule.key}（{rule.count}）
          </Option>
        ))}
      </Select>
      <Select
        allowClear
        value={languages}
        onChange={(value) => setLanguages(value)}
        mode='multiple'
        placeholder="语言"
        loading={loading}
        style={{ width: "100%", marginTop: 16 }}
      >
        {ModuleStore.languages.map((language) => (
          <Option key={language.key} value={language.key}>
            {LanguageCodes_MAP[language.key]}（{language.count}）
          </Option>
        ))}
      </Select>
      <Select
        allowClear
        value={players}
        onChange={(value) => setPlayers(value)}
        mode="multiple"
        placeholder="筛选玩家数"
        loading={loading}
        style={{ width: "100%", marginTop: 16 }}
      >
        {range(10, 1).map((value) => (
          <Option key={value} value={value}>
            {value}人
          </Option>
        ))}
      </Select>

      <div className={styles.sortSelectorGroup} style={{ marginTop: 16 }}>
        <Select
          className={styles.sortSelector}
          value={sortKey}
          onChange={(value) => setSortKey(value)}
          placeholder="排序"
          loading={loading}
        >
          {FilterSortKeys.map((option) => (
            <Option key={option} value={option}>
              {ModSortKeyMap[option]}
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

      <div className={styles.sortSelectorGroup} style={{ marginTop: 16 }}>
        <TagSelect
          value={tags}
          onChange={(value) => setTags(value)}
          style={{ width: "100%" }}
          placeholder="筛选标签"
          recommendTagOptions={TagStore.recommendTags}
        />
        <Button
          className={styles.sortSelectorBtn}
          onClick={() => setTagsMode(premode => premode === TagFilterMode.IN ? TagFilterMode.ALL : TagFilterMode.IN)}
        >
          {tagsMode === TagFilterMode.IN ? '或' : '且'}
        </Button>
      </div>
      <Button
        block
        ghost
        style={{ marginTop: 16 }}
        onClick={() => {
          setFilter({});
          setPlayers([]);
          setOrigins([]);
          setTags([]);
          onClear();
        }}
      >
        清空筛选
      </Button>
    </React.Fragment>
  );
});
export default ModuleFilter;
