import { action } from 'mobx';
import BaseProvider from '@/utils/BaseProvider';
import { PaginatedResponse, PageableQuery } from "interfaces/shared/api";
import qs from 'qs';

export interface ILogQuery extends PageableQuery {
  filter: Partial<{
    targetName: string;
    targetId: string;
    action: string;
    changedKey: string;
  }>
}

export interface ILogDto {
  _id: string;
  before: any;
  after: any;
  createdAt: Date;
  action: string;
  changedKeys: Array<string>;
  targetId: string;
  targetName: string;
  operator: {
    _id: string;
    nickName: string;
    avatarUrl: string;
  };
}

class LogStore {

  @action fetchLogs = (targetName: string, targetId: string, query: Partial<ILogQuery> = {}) => {
    return BaseProvider.get<PaginatedResponse<ILogDto>>(`/api/log/${targetName}/${targetId}/?${qs.stringify(query)}`);
  }


  @action fetchLogListApi = (targetName: string, targetId: string, query: Partial<ILogQuery> = {}) => {
    return BaseProvider.get<PaginatedResponse<ILogDto>>(`/api/log/${targetName}/${targetId}/?${qs.stringify(query)}`);
  }
}

export default new LogStore();
