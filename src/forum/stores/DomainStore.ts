import { observable, action, computed } from "mobx";
import { PageableQuery, PaginatedResponse } from '@/interfaces/shared/api';
import BaseProvider from "@/utils/BaseProvider";
import qs from 'qs';

export interface IDomainQuery extends PageableQuery {
  isJoined: boolean;
  filter?: Partial<{
    isRecommend: boolean;
    isModDefault: boolean;
  }>;
}


export interface IDomainDto {
  _id: string;
  title: string;
  coverUrl: string;
  description: string;
  isNSFW: boolean;
  joined: boolean;
  memberCount: number;
  topicCount: number;
  moderators: Array<any>;
  createdAt: Date;
}


class DomainStore {
  @observable joinedDomain: Array<IDomainDto> = [];
  @observable recommendDomain: Array<IDomainDto> = [];
  @observable defaultModDomain?: IDomainDto;
  @observable initialized: boolean = false;

  @computed get suggestionDomains() {
    const result: Record<string, IDomainDto> = {};
    this.recommendDomain.map((domain) => Object.assign(result, { [domain._id]: domain }))
    this.joinedDomain.map((domain) => Object.assign(result, { [domain._id]: domain }))
    return Object.values(result)
  }

  @action initStore = (force: boolean = false) => {
    if (this.initialized && !force) {
      return Promise.resolve()
    }

    return Promise.all([
      this.fetchJoinedDomainList(),
      this.fetchRecommendDomainList(),
    ]).then(() => {
      this.initialized = true;
    })
  }

  @action getDefaultModDomain = () => {
    if (this.defaultModDomain) {
      return Promise.resolve(this.defaultModDomain)
    }

    return this.fetchDomainList({ filter: { isModDefault: true } }).then((res) => {
      this.defaultModDomain = res.data.data[0];
      return this.defaultModDomain;
    })
  }

  @action fetchJoinedDomainList = () => {
    return this.fetchDomainList({ isJoined: true, pageSize: 100 }).then((res) => {
      this.joinedDomain = res.data.data
    })
  }

  @action clearJoinedDomainList = () => {
    this.joinedDomain = []
  }

  @action fetchRecommendDomainList = () => {
    return this.fetchDomainList({ filter: { isRecommend: true }, pageSize: 100 }).then((res) => {
      this.recommendDomain = res.data.data
    })
  }

  @action fetchDomainList = (query: Partial<IDomainQuery>) => {
    return BaseProvider.get<PaginatedResponse<IDomainDto>>(`/api/domain?${qs.stringify(query)}`);
  }

  @action fetchDomainDetail = (uuid: string) => {
    return BaseProvider.get<IDomainDto>(`/api/domain/${uuid}`);
  }

  @action fetchModDomainDetail = (modId: string) => {
    return BaseProvider.get<IDomainDto>(`/api/domain/mod/${modId}`);
  }

  @action joinDomain = (domainId: string) => {
    return BaseProvider.post<IDomainDto>(`/api/domain/${domainId}/join`);
  }

  @action exitDomain = (domainId: string) => {
    return BaseProvider.post<IDomainDto>(`/api/domain/${domainId}/exit`);
  }
}

const DomainSingleStore = new DomainStore();
export { DomainSingleStore };
export { DomainStore };
