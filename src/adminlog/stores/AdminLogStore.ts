import { observable, action, computed } from "mobx";
import { PaginatedResponse, SortOrder, PageableQuery } from '@/interfaces/shared/api';
import BaseProvider from "@/utils/BaseProvider";
import qs from 'qs';


export interface BaseAdminLog {
  _id: string,
  operator: {
    _id: string,
    nickName: string,
    avatarUrl: string,
  },
  log: string,
  message: string,
  createdAt: Date,
}

export enum AdminLogType {
  HideRate = 'hide-rate',
}

export interface IHideRateAdminLog extends BaseAdminLog {
  type: AdminLogType.HideRate,
  snapshot: {
    nickname: string,
    remark: string,
    rate: number,
  }
}


export type IAdminLog = IHideRateAdminLog;


export interface AdminLogQuery extends PageableQuery {}



class AdminLogStore {
  @action fetchAdminLogs = (query: Partial<AdminLogQuery>) => {
    return BaseProvider.get<PaginatedResponse<IAdminLog>>(`/api/log/admin?${qs.stringify(query)}`);
  }
}

const AdminLogSingleStore = new AdminLogStore();
export { AdminLogSingleStore };
export { AdminLogStore };
