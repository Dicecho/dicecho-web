import { observable, action } from "mobx";
import { SortOrder, PaginatedResponse } from "interfaces/shared/api";
import BaseProvider from "@/utils/BaseProvider";
import qs from "qs";

interface BaseDto {
  _id: string;
}

interface BaseQuery<SortKey extends string> {
  pageSize: number;
  page: number;
  sort: Partial<Record<SortKey, SortOrder>>;
}

class GenericStore<
  DTO extends BaseDto,
  Sortkey extends string,
  Query extends BaseQuery<Sortkey>,
  CDTO = any,
  UDTO = any,
> {
  @observable datas: Array<DTO> = [];
  @observable datasTotal: number = 0;
  @observable datasHasNext: boolean = false;
  @observable datasPage: number = 1;
  @observable lastQuery: Partial<Query> = {};

  prefix = "/api";
  key = "";

  @action initList = (query: Partial<Query>) => {
    return this.fetchList(query).then((res) => {
      this.datas = res.data;
      this.datasTotal = res.totalCount;
      this.datasPage = res.page;
      this.datasHasNext = res.hasNext;
    });
  };

  @action loadNext = (query: Partial<Query>) => {
    query.page = this.datasPage + 1;
    return this.fetchList(query).then((res) => {
      this.datas = [...this.datas.concat(res.data)];
      this.datasPage = res.page;
      this.datasHasNext = res.hasNext;
    });
  };

  @action fetchList = (
    query: Partial<Query> = {}
  ): Promise<PaginatedResponse<DTO>> => {
    return BaseProvider.get<PaginatedResponse<DTO>>(
      `${this.prefix}/${this.key}?${qs.stringify(query)}`
    ).then((res) => {
      this.lastQuery = query;
      return res.data;
    });
  };

  @action fetchDetail<T = DTO>(uuid: string) {
    return BaseProvider.get<T>(
      `${this.prefix}/${this.key}/${uuid}/`
    );
  };

  @action createObj = (dto: CDTO) => {
    return BaseProvider.post<DTO>(`${this.prefix}/${this.key}`, dto).then((res) => {
      return res.data;
    });
  };

  @action insertObj = (dto: DTO) => {
    this.datas.unshift(dto)
    this.datas = [...this.datas]
    this.datasTotal = this.datasTotal + 1;
  }

  @action updateObj = (uuid: string, dto: Partial<UDTO>) => {
    return BaseProvider.put<DTO>(`${this.prefix}/${this.key}/${uuid}`, dto).then(
      (res) => {
        const index = this.datas.findIndex((obj) => obj._id === res.data._id);
        if (index !== -1) {
          this.datas[index] = res.data;
          this.datas = [...this.datas];
        }
        return res.data;
      }
    );
  };

  @action deleteObj = (uuid: string) => {
    return BaseProvider.delete(`${this.prefix}/${this.key}/${uuid}`).then(() => {
      const index = this.datas.findIndex((obj) => obj._id === uuid);
      if (index !== -1) {
        this.datas.splice(index, 1);
        this.datas = [...this.datas];
      }
    });
  };

  @action resetStore = () => {
    this.datas = [];
    this.datasTotal = 0;
    this.datasHasNext = false;
    this.datasPage = 1;
  };
}

export { GenericStore };
