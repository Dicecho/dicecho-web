import { action, observable } from 'mobx';
import { PaginatedResponse } from "interfaces/shared/api";
import BaseProvider from '@/utils/BaseProvider';
import { IRateDto } from "@/rate/stores/RateStore";
import { IModDto } from "@/module/stores/ModuleStore";
import { SortOrder } from "interfaces/shared/api";
import qs from 'qs';

export class BlockFilter {
  readonly targetName?: string;
}

export enum BlockSortKey {
  CREATED_AT = 'createdAt',
}

export interface BlockQuery {
  pageSize: number;
  page: number;
  sort: Partial<Record<BlockSortKey, SortOrder>>;
  filter?: Partial<BlockFilter>;
}

export enum BlockTargetName {
  Mod = 'Mod',
  User = 'User',
  Rate = 'Rate',
}

interface BaseBlock {
  _id: string;
  targetName: BlockTargetName;
}

interface ModBlock extends BaseBlock {
  targetName: BlockTargetName.Mod;
  target: IModDto;
}

interface RateBlock extends BaseBlock {
  targetName: BlockTargetName.Rate;
  target: IRateDto;
}

interface UserBlock extends BaseBlock {
  targetName: BlockTargetName.User;
  target: {
    _id: string;
    nickName: string;
    avatarUrl: string;
  };
}

export type IBlockDto = ModBlock | RateBlock | UserBlock;


class BlockStore {
  @observable initialized: boolean = false;
  @observable blockCount: Record<BlockTargetName, number> = {
    [BlockTargetName.Mod]: 0,
    [BlockTargetName.Rate]: 0,
    [BlockTargetName.User]: 0,
  };

  @action fetBlockCount = () => {
    return BaseProvider.get<PaginatedResponse<IBlockDto>>(`/api/block/count`)
  }

  @action fetchSelfBlockList = (query: Partial<BlockQuery>) => {
    return BaseProvider.get<PaginatedResponse<IBlockDto>>(`/api/block/self?${qs.stringify(query)}`)
  }

  @action cancelBlock = (targetName: string, targetId: string) => {
    return BaseProvider.post(`/api/block/cancel`, { targetName, targetId });
  }

  @action block = (targetName: string, targetId: string) => {
    return BaseProvider.post(`/api/block`, { targetName, targetId });
  }
}

export default new BlockStore();
