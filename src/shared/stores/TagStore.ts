import { action, observable } from 'mobx';
import BaseProvider from '@/utils/BaseProvider';
import { PaginatedResponse } from "interfaces/shared/api";
import qs from 'qs';


export interface ITag {
  _id: string;
  name: string;
  coverUrl: string;
  description: string;
  modCount: number;
  topicCount: number;
  parents: Array<string>;
  children: Array<string>;
  alias: Array<string>;
}

export interface UpdateTagDto {
  coverUrl: string;
  description: string;
  children: Array<string>;
}

export interface TagQuery {
  keyword: string;
  pageSize: number;
  page: number;
}


class TagStore {
  @observable initialized: boolean = false;
  @observable recommendTags: Array<string> = [];
  @observable ruleTags: Array<ITag> = [];

  @action initStore() {
    if (this.initialized) {
      return Promise.resolve();
    }

    return Promise.all([
      BaseProvider.get<Array<ITag>>(`/api/tag/modRecommend`).then((res) => {
        this.recommendTags = res.data.map((tag) => tag.name);
      }),
      BaseProvider.get<PaginatedResponse<ITag>>(`/api/tag?${qs.stringify({ parent: ['规则'], pageSize: 100 })}`).then((res) => {
        this.ruleTags = res.data.data
      })
    ]).then(() => {
      this.initialized = true;
    })
  }

  @action fetchTag(query: Partial<TagQuery>) {
    return BaseProvider.get<PaginatedResponse<ITag>>(`/api/tag?${qs.stringify(query)}`)
  }

  @action createTag(name: string) {
    return BaseProvider.post<ITag>(`/api/tag`, { name })
  }

  @action fetchTagDetail(name: string) {
    return BaseProvider.get<ITag>(`/api/tag/${name}`)
  }

  @action updateTag(name: string, dto: Partial<UpdateTagDto>) {
    return BaseProvider.put<ITag>(`/api/tag/${name}`, dto)
  }
}

export default new TagStore();
