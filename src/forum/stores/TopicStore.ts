import { observable, action } from "mobx";
import {
  ISimpleUserDto,
  SortOrder,
} from "interfaces/shared/api";
import { GenericStore } from './GenericStore';


export enum TopicSortKey {
  LIKE_COUNT = 'likeCount',
  COMMENT_COUNT = 'commentCount',
  CREATED_AT = 'createdAt',
  LAST_COMMENTED_AT = 'lastCommentedAt',
}

export interface TopcFilter {
  domain: string;
  author: string;
}

export interface TopicListQuery {
  pageSize: number;
  page: number;
  modId: string;
  sort: Partial<Record<TopicSortKey, SortOrder>>;
  filter: Partial<TopcFilter>;
}

export interface CreateTopicDto {
  domainId?: string;
  modId?: string;
  title: string;
  content: string;
  isSpoiler: boolean;
  relatedModIds?: string[];
}

export interface UpdateTopicDto {
  title: string;
  content: string;
  isSpoiler: boolean;
}


export interface ITopicDto {
  _id: string;
  isLiked: boolean;
  disLiked: boolean;
  likeCount: number;
  commentCount: number;
  createdAt: Date;
  lastCommentedAt: Date;
  title: string;
  content: string;
  readCount: number;
  isHighlight: boolean;
  isSpoiler: boolean;
  canEdit: boolean;
  // mod?: {
  //   _id: string;
  //   title: string,
  //   coverUrl: string,
  //   description: string,
  //   rateAvg: number,
  //   rateCount: number,
  // };
  relatedMods: Array<{
    _id: string;
    title: string,
    coverUrl: string,
    description: string,
    rateAvg: number,
    rateCount: number,
  }>;
  domain: {
    _id: string;
    title: string;
    coverUrl: string;
  }
  author: ISimpleUserDto;
}


class TopicStore extends GenericStore<
  ITopicDto,
  TopicSortKey,
  TopicListQuery,
  CreateTopicDto,
  UpdateTopicDto
> {
  key='topic';

}

const TopicSingleStore = new TopicStore();
export { TopicSingleStore };
export { TopicStore };
