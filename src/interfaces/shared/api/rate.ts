import { PaginatedResponse, Operation, SortOrder } from './base';
import { ISimpleUserDto } from './user';

export enum RateView {
  PL = 0,
  KP = 1,
  OB = 2,
}

export enum RateType {
  Rate = 0,
  Mark = 1,
}

export enum AccessLevel {
  Public = 'public',
  Private = 'private',
}

export enum RateSortKey {
  RATE_AT = 'rateAt',
  LIKE_COUNT = 'likeCount',
  RATE = 'rate',
  WILSON_SCORE = 'wilsonScore',
  CREATED_AT = 'createdAt',
  REMARK_LENGTH = 'remarkLength',
  HAPPY_COUNT = 'declareCounts.happy',
}

export enum RemarkContentType {
  Markdown = 'markdown',
  Richtext = 'richtext',
}

export interface IRateFilter {
  view: RateView,
  type: RateType,
  accessLevel: AccessLevel;
  rate: Partial<{ [key in Operation]: number }>,
  remarkLength: Partial<{ [key in Operation]: any }>,
  isAnonymous: boolean,
}

export type IRateSort = {
  [key in RateSortKey]: SortOrder;
}

export interface IRateListQuery {
  pageSize: number;
  page: number;
  sort: Partial<IRateSort>;
  filter: Partial<IRateFilter>;
  modId: string;
  userId: string;
}

export interface IRateModQuery {
  pageSize: number;
  page: number;
}

export interface IRateDto {
  _id: string;
  user: ISimpleUserDto;
  mod: {
    _id: string;
    title: string,
    coverUrl: string,
    description: string,
    rateAvg: number,
    rateCount: number,
  };
  type: RateType;
  rate: number;
  view: RateView;
  remark: string;
  remarkLength: number;
  richTextState: Array<any>;
  remarkType: RemarkContentType;
  rateAt: Date;
  createdAt: Date;
  isLiked: boolean;
  disLiked: boolean;
  reportedCount: number;
  reportedReason: string;
  likeCount: number;
  commentCount: number;
  spoilerCount: number;
  isAnonymous: boolean;
  canEdit: boolean;
  accessLevel: AccessLevel;
  declareCounts: Record<string, number>;
  declareStatus: Record<string, boolean>;
}

export interface IRatePostApiResponse extends IRateDto {}
export interface IRateListApiResponse extends PaginatedResponse<IRateDto> {}
