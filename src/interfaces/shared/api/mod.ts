import { PaginatedResponse, Operation, SortOrder } from './base';

export enum ModSortKey {
  // ID = '_id',
  RELEASE_DATE = 'releaseDate',
  RATE_COUNT = 'rateCount',
  RATE_AVG = 'rateAvg',
  LAST_RATE_AT = 'lastRateAt',
  LAST_EDIT_AT = 'lastEditAt',
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
}

export enum ModOrigin {
  CNMODS = 'cnmods',
  BOOTH = 'booth',
  SELF = '',
}

export enum TagFilterMode {
  ALL = 'all',
  IN = 'in',
}

export enum ModRateInfoKey {
  ONE = '1',
  TWO = '2',
  THREE = '3',
  FOUR = '4',
  FIVE = '5',
}

export interface IModDto {
  _id: string,
  title: string,
  originTitle: string,
  alias: string,
  description: string,
  origin: string,
  originUrl: string,
  isForeign: boolean,
  canDownload: boolean,
  coverUrl: string,
  moduleRule: string,
  playerNumber: [number, number],
  languages: Array<string>,
  relatedLinks: Array<{
    name: string;
    url: string;
    clickCount: number;
  }>;
  imageUrls: Array<string>,
  tags:  Array<string>,
  boothAliaseId?: number;
  cnmodsAliaseId?: number;
  releaseDate: Date;
  lastEditAt: Date;
  contributors: Array<{
    _id: string;
    nickName: string;
    avatarUrl: string;
  }>;
  author: {
    isForeign: true;
    nickName: string;
    avatarUrl: string;
  } | {
    isForeign: false;
    _id: string;
    nickName: string;
    avatarUrl: string;

  }
  modFiles: Array<{
    name: string;
    size: number;
    url: string;
    type: string;
    clickCount: number;
  }>;
  rateAvg: number;
  rateCount: number;
  topicCount: number;
  validRateCount: number;
  markCount: number;
  rateInfo: { [key in ModRateInfoKey]: number };
  isRated: boolean;
  canEdit: boolean;
}

export interface IModFilter {
  origin: ModOrigin,
  moduleRule: string,
  rateCount: Partial<{ [key in Operation]: number }>,
  author: string,
  isForeign: boolean,
  updatedAt: Partial<{ [key in Operation]: Date }>,
}

export type IModSort = {
  [key in ModSortKey]: SortOrder;
}

export interface IModListQuery {
  keyword: string;
  tags: string[];
  ids: Array<string>,
  origins: Array<string>,
  tagsMode: TagFilterMode;
  languages: Array<string>;
  pageSize: number;
  page: number;
  sort: Partial<IModSort>;
  filter: Partial<IModFilter>;
  minPlayer: number,
  maxPlayer: number,
}

export type ModListApiResponse = PaginatedResponse<IModDto>;

export type ModRetrieveApiResponse = IModDto;