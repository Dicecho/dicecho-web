import { observable, action } from "mobx";
import { PaginatedResponse, PageableQuery } from "interfaces/shared/api";
import { IPendantDto } from '@/shared/hooks/useSelfPendant';
import BaseProvider from "@/utils/BaseProvider";
import qs from "qs";


export interface IAccountDto {
  _id: string;
  nickName: string;
  avatarUrl: string;
  pendantUrl: string;
  backgroundUrl: string;
  note: string;
  notice: string;
  likedCount: number;
  rateCount: number,
  contributionCount: number,
  followerCount: number,
  followingCount: number,
  isFollowed: boolean,
}


class AccountStore {
  @observable initialized = false;
  @observable loading = false;


  @action fetchAccount = (uuid: string) => {
    return BaseProvider.get<IAccountDto>(`/api/user/${uuid}/profile`);
  }

  @action follow = (uuid: string) => {
    return BaseProvider.post<IAccountDto>(`/api/user/${uuid}/follow`);
  }

  @action unfollow = (uuid: string) => {
    return BaseProvider.post<IAccountDto>(`/api/user/${uuid}/unfollow`);
  }

  @action fetchFollowers = (uuid: string, query: Partial<PageableQuery> = {}) => {
    return BaseProvider.get<PaginatedResponse<IAccountDto>>(`/api/user/${uuid}/followers?${qs.stringify(query)}`);
  }

  @action fetchFollowings = (uuid: string, query: Partial<PageableQuery> = {}) => {
    return BaseProvider.get<PaginatedResponse<IAccountDto>>(`/api/user/${uuid}/followings?${qs.stringify(query)}`);
  }

  @action activePendant = (uuid: string) => {
    return BaseProvider.put(`/api/pendant/${uuid}/active`);
  }

  @action inactivePendant = () => {
    return BaseProvider.put(`/api/pendant/inactive`);
  }

  @action receiveGift = () => {
    return BaseProvider.get<Array<IPendantDto>>(`/api/pendant/christmas_gift`);
  }

  @action receiveHLDXYA = () => {
    return BaseProvider.get<Array<IPendantDto>>(`/api/pendant/hldxya`);
  }
}

const store = new AccountStore();

export default store;
