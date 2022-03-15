import React, { useEffect, useRef, useState, HTMLAttributes } from "react";
import { observer } from "mobx-react";
import { useLocalStorageState } from 'ahooks';
import { useIsMounted } from "react-tidy";
import { Select } from '@/lib/antd';
import {
  Drawer,
  Button,
  Spin,
  Card,
  Pagination,
  Tabs,
} from "antd";
import {
  FilterOutlined,
  EditOutlined,
} from "@ant-design/icons";
import {
  IRateListQuery,
  IRateSort,
  RateSortKey,
  RateView,
} from "interfaces/shared/api";
import { RateType } from '@/rate/interfaces';
import scrollTo from "antd/lib/_util/scrollTo";
import { STORAGE_KEYS } from "shared/constants/storage";
import { IModDto } from "@/module/stores/ModuleStore";
import UIStore from "@/shared/stores/UIStore";
import ModuleRateInfo from "./ModuleRateInfo";
import RateList from "@/rate/components/RateList";
import RateStore, { AccessLevel } from "@/rate/stores/RateStore";
import notAuthSVG from "@/assets/svg/notAuth.svg";
import Empty from "@/shared/components/Empty";
import SettingStore from '@/shared/stores/SettingStore';
import styles from "./ModuleRateList.module.less";

const { Option } = Select;
const { TabPane } = Tabs;

export const RateSortKeyMap: {
  [key: string]: string
} = {
  // [ModSortKey.ID]: '编号',
  [RateSortKey.WILSON_SCORE]: "推荐顺序",
  [RateSortKey.HAPPY_COUNT]: "欢乐",
  [RateSortKey.RATE_AT]: "评价时间",
  [RateSortKey.LIKE_COUNT]: "点赞数",
  [RateSortKey.RATE]: "分数",
};

export const RateSortChoice: Array<{
  key: string;
  label: string;
  value: Partial<IRateSort>;
}> = [
  {
    key: 'recommend',
    label: '推荐顺序',
    value: { [RateSortKey.WILSON_SCORE]: -1 },
  },
  {
    key: 'happy',
    label: '最欢乐评价',
    value: { [RateSortKey.HAPPY_COUNT]: -1 },
  },
  {
    key: 'remark',
    label: '最长评价',
    value: { [RateSortKey.REMARK_LENGTH]: -1 },
  },
  {
    key: 'newest',
    label: '最新评价',
    value: { [RateSortKey.RATE_AT]: -1 },
  },
  {
    key: 'oldest',
    label: '最早评价',
    value: { [RateSortKey.RATE_AT]: 1 },
  },
];

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
  NOT_EMPTY = 0,
  Low = 1,
  Mid = 2,
  High = 3,
}

export const RateHierarchyMap = {
  // [ModSortKey.ID]: '编号',
  [RateHierarchy.NOT_EMPTY]: "有评分",
  [RateHierarchy.Low]: "差评",
  [RateHierarchy.Mid]: "中评",
  [RateHierarchy.High]: "好评",
};

const getHierarchyFilter = (hierarchy?: RateHierarchy) => {
  if (hierarchy === undefined) {
    return undefined;
  }
  if (hierarchy === RateHierarchy.NOT_EMPTY) {
    return { $gte: 1 };
  }
  if (hierarchy === RateHierarchy.Low) {
    return { $gte: 1, $lt: 4 };
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

interface IProps {
  module: IModDto;
}

const ModuleRateList: React.FC<IProps> = observer(({ module, ...props }) => {
  const [type, setType] = useState(RateType.Rate);
  const [sortChoice, setSortChoice] = useLocalStorageState(STORAGE_KEYS.ModuleRateSort, { defaultValue: 'recommend' })
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useLocalStorageState(STORAGE_KEYS.RatePageSize, { defaultValue: 10 });
  const [view, setView] = useState<RateView | undefined>(undefined);
  const [remarkType, setRemarkType] = useLocalStorageState<RemarkType | undefined>(STORAGE_KEYS.RateRemarkType, { defaultValue: RemarkType.All });
  const [hierarchy, setHierarchy] = useState<RateHierarchy | undefined>(undefined);

  const [initialized, setInitialized] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);
  const isMounted = useIsMounted();

  useEffect(() => {
    RateStore.initStore(module._id);
  }, [module._id]);

  useEffect(() => {
    const sort = (() => {
      const choice = RateSortChoice.find(choice => choice.key === sortChoice) || RateSortChoice[0];
      return choice.value;
    })()

    const pageChanged = RateStore.ratesPage !== page;
    const query: Partial<IRateListQuery> = {
      sort,
      page: pageChanged ? page : 1,
      pageSize,
      filter: {
        view,
        type,
        rate: getHierarchyFilter(hierarchy),
        remarkLength: getRemarkFilter(remarkType),
        accessLevel: AccessLevel.Public,
      },
    };
    RateStore.initModuleRateList(module._id, query).then(() => {
      if (!isMounted()) {
        return;
      }
      setInitialized(true);
      if (headerRef.current && pageChanged) {
        scrollTo(headerRef.current.getBoundingClientRect().y + window.scrollY);
      }
    });
  }, [
    isMounted,
    module._id,
    sortChoice,
    type,
    page,
    pageSize,
    view,
    hierarchy,
    remarkType,
  ]);

  const renderSort = (wrapProps?: HTMLAttributes<HTMLDivElement>) => {
    return (
      <Select
        className={styles.sortSelector}
        value={sortChoice}
        onChange={(value) => setSortChoice(value)}
        placeholder="排序"
      >
        {RateSortChoice.map((option) => (
          <Option key={option.key} value={option.key}>
            {option.label}
          </Option>
        ))}
      </Select>
    );
  };

  const renderFilter = () => {
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
  };

  const renderContent = () => {
    if (!initialized) {
      return (
        <div
          style={{
            width: "100%",
            minHeight: 200,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Spin />
        </div>
      );
    }

    if (RateStore.rates.length === 0) {
      return (
        <Empty emptyImageUrl={notAuthSVG} emptyText={"暂时还没有评价"}>
          <Button
            type="primary"
            className={styles.rateListHeaderBtn}
            onClick={() => RateStore.openRatesPostModal()}
          >
            来留下一篇评价吧！
          </Button>
        </Empty>
      );
    }

    return (
      <React.Fragment>
      {RateStore.ratesTotal > pageSize && (
          <Pagination
            style={{ marginBottom: 8 }}
            // responsive
            defaultCurrent={RateStore.ratesPage}
            current={RateStore.ratesPage}
            pageSize={pageSize}
            total={RateStore.ratesTotal}
            showSizeChanger
            onChange={(p, pageSize) => {
              setPage(p);
              setPageSize(pageSize || 10);
            }}
          />
        )}
        <RateList
          rates={RateStore.rates}
          onRemovedRate={(rateId) => RateStore.onRemoveRate(rateId)}
          listProps={{
            style: UIStore.isMobile ? {} : { marginTop: 16 },
            className: styles.list,
            pagination:
              RateStore.ratesTotal < pageSize
                ? false
                : {
                    defaultCurrent: RateStore.ratesPage,
                    current: RateStore.ratesPage,
                    pageSize,
                    total: RateStore.ratesTotal,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    onChange: (p, pageSize) => {
                      setPage(p);
                      setPageSize(pageSize || 10);
                    },
                  },
          }}
        />
      </React.Fragment>
    );
  };

  return (
    <React.Fragment>
      <div ref={headerRef} />
      <Card
        bordered={false}
        className={styles.rateList}
        title={
          <Tabs
            className={styles.rateTabs}
            defaultActiveKey={type.toString()}
            activeKey={type.toString()}
            onChange={(key) => {
              setType(parseInt(key) as RateType)
              setView(undefined)
              setHierarchy(undefined)
            }}
            tabBarExtraContent={
              UIStore.isMobile ? (
                <div style={{ display: "flex", alignItems: "center" }}>
                  {renderSort()}
                  <Button
                    style={{ marginLeft: 8 }}
                    icon={<FilterOutlined />}
                    onClick={() => setDrawerVisible(true)}
                  />
                </div>
              ) : (
                <Button
                  type={RateStore.currentModuleHasRated ? "default" : "primary"}
                  className={styles.rateListHeaderBtn}
                  onClick={() => RateStore.openRatesPostModal()}
                >
                  {RateStore.currentModuleHasRated ? "修改评价" : "撰写新评价"}
                </Button>
              )
            }
          >
            <TabPane tab={`${module.rateCount} 评价`} key={RateType.Rate} />
            <TabPane tab={`${module.markCount} 想玩`} key={RateType.Mark} />
          </Tabs>
        }
      >
        {SettingStore.rateAvailable && SettingStore.rateScoreAvailable && module.rateAvg > 0 && !UIStore.isMobile && type === RateType.Rate && (
          <ModuleRateInfo mod={module} style={{ marginBottom: 16 }} />
        )}

        {!UIStore.isMobile && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              margin: "-4px",
              marginBottom: 4,
            }}
          >
            {renderFilter()}
            {renderSort()}
          </div>
        )}
        {renderContent()}
      </Card>

      <Drawer
        title="筛选"
        placement="right"
        closable={true}
        onClose={() => setDrawerVisible(false)}
        visible={drawerVisible}
      >
        {renderFilter()}
      </Drawer>

      {UIStore.isMobile && (
        <div className={`ant-back-top`}>
          <div
            className={`${styles.backTop}`}
            onClick={() => RateStore.openRatesPostModal()}
          >
            <EditOutlined />
          </div>
        </div>
      )}
    </React.Fragment>
  );
});
export default ModuleRateList;
