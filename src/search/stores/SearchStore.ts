import { action, computed, observable } from "mobx";
import { PaginatedResponse, IUserDto, IModDto } from "interfaces/shared/api";
import BaseProvider from "@/utils/BaseProvider";
import { ITopicDto } from "@/forum/stores/TopicStore";
import TagStore, { ITag, TagQuery } from "@/shared/stores/TagStore";
import ModuleStore, { IModListQuery } from '@/module/stores/ModuleStore';
import qs from "qs";


interface SearchQuery {
  keyword: string;
  pageSize: number;
  page: number;
}

interface ISearchResult<T> {
  datas: Array<T>;
  total: number;
}


class SearchStore {
  @observable lastSearchKeyword: string = '';
  @observable mods: ISearchResult<IModDto> = {
    datas: [],
    total: 0,
  };
  @observable tags: ISearchResult<ITag> = {
    datas: [],
    total: 0,
  };
  @observable topics: ISearchResult<ITopicDto> = {
    datas: [],
    total: 0,
  };
  @observable users: ISearchResult<IUserDto> = {
    datas: [],
    total: 0,
  };
  @observable loading: boolean = false;
  @observable initialzed: boolean = false;

  @computed get isReady() {
    return this.initialzed && !this.loading;
  }

  @computed get isEmpty() {
    return this.mods.total === 0 
      && this.tags.total === 0 
      && this.topics.total === 0 
      && this.users.total === 0;
  }


  @action fetchCollectDatas = async (keyword: string) => {
    if (keyword === this.lastSearchKeyword) {
      return Promise.resolve()
    }
    this.loading = true;
    const datas = await Promise.all([
      singleSearchStore.searchMod({ keyword }),
      singleSearchStore.searchTag({ keyword }),
      singleSearchStore.searchTopic({ keyword }),
      singleSearchStore.searchUser({ keyword }),
    ])
    this.loading = false;
    this.initialzed = true;
    this.lastSearchKeyword = keyword;
    this.mods = {
      datas: datas[0].data,
      total: datas[0].totalCount,
    }
    this.tags = {
      datas: datas[1].data.data,
      total: datas[1].data.totalCount,
    }
    this.topics = {
      datas: datas[2].data.data,
      total: datas[2].data.totalCount,
    }
    this.users = {
      datas: datas[3].data.data,
      total: datas[3].data.totalCount,
    }
  }

  @action searchMod = (query: Partial<IModListQuery>) => {
    return ModuleStore.fetchModuleList(query)
  }

  @action searchTag = (query: Partial<TagQuery>) => {
    return TagStore.fetchTag(query)
  }

  @action searchTopic = (query: Partial<SearchQuery>) => {
    return BaseProvider.get<PaginatedResponse<ITopicDto>>(`/api/topic/search?${qs.stringify(query)}`)
  }

  @action searchUser = (query: Partial<SearchQuery>) => {
    return BaseProvider.get<PaginatedResponse<IUserDto>>(`/api/user/search?${qs.stringify(query)}`)
  }
}

const singleSearchStore = new SearchStore();

export { SearchStore, singleSearchStore };
