import { observable, action } from "mobx";
import { PaginatedResponse, PageableQuery } from "interfaces/shared/api";
import BaseProvider from "@/utils/BaseProvider";
import qs from "qs";

export interface IReplayDto {
  bvid: string,
  videos: number,// 有多少个视频，多个为合集
  coverUrl: string, // 封面
  title: string,
  description: string,
  duration: number,
  owner: {
    mid: number,
    name: string,
    face: string,
  },
  pages: Array<{
    page: number;
    part: string;
    duration: number;
  }>;
  mod?: {
    _id: string;
    title: string;
    coverUrl: string;
    description: string;
    rateAvg: number;
    rateCount: number;
  }
}

export interface IReplayFilter {
  isRecommend: boolean;
}

export interface IReplayListQuery extends PageableQuery {
  filter: Partial<IReplayFilter>;
}

class ReplayStore {
  @observable recommends: Array<IReplayDto> = [];
  @observable datas: Array<IReplayDto> = [];
  @observable datasTotal: number = 0;
  @observable datasHasNext: boolean = false;
  @observable datasPage: number = 1;
  prefix = "/api";
  key = "replay";

  @action initRecommend = () => {
    return this.fetchList({ filter: { isRecommend: true } }).then((res) => {
      this.recommends = res.data;
    });
  };

  @action initList = (query: Partial<IReplayListQuery>) => {
    return this.fetchList(query).then((res) => {
      this.datas = res.data;
      this.datasTotal = res.totalCount;
      this.datasPage = res.page;
      this.datasHasNext = res.hasNext;
    });
  };

  @action loadNext = (query: Partial<IReplayListQuery>) => {
    query.page = this.datasPage + 1;
    return this.fetchList(query).then((res) => {
      this.datas = [...this.datas.concat(res.data)];
      this.datasPage = res.page;
      this.datasHasNext = res.hasNext;
    });
  };

  @action fetchList = (
    query: Partial<IReplayListQuery> = {}
  ): Promise<PaginatedResponse<IReplayDto>> => {
    return BaseProvider.get<PaginatedResponse<IReplayDto>>(
      `${this.prefix}/${this.key}?${qs.stringify(query)}`
    ).then((res) => {
      return res.data;
    });
  };

  @action fetchDetail<T = IReplayDto>(uuid: string) {
    return BaseProvider.get<T>(
      `${this.prefix}/${this.key}/${uuid}/`
    );
  };

  @action resetStore = () => {
    this.datas = [];
    this.datasTotal = 0;
    this.datasHasNext = false;
    this.datasPage = 1;
  };

  @action addReplay = (bvid: string, modId?: string) => {
    
  }
}

const singleReplayStore = new ReplayStore();

export { ReplayStore, singleReplayStore };
