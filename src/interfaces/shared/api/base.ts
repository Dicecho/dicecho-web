export interface Response<D = any> {
  success: boolean;
  code: number;
  data: D;
  detail?: string;
  [filed: string]: any;
};

export interface Error {
  success: boolean;
  code: number;
  detail: string;
  data?: any;
};

export interface PaginatedResponse<T = any> {
  totalCount: number;
  page: number;
  pageSize: number;
  data: Array<T>;
  hasNext: boolean;
}

export enum Operation {
  GT = '$gt',
  GTE = '$gte',
  LT = '$lt',
  LTE = '$lte',
}

export enum LogicOperation {
  NE = '$ne',
}

export enum SortOrder {
  ASC = 1,
  DESC = -1,
}

export interface PageableQuery<SortKey extends string = any> {
  pageSize: number;
  page: number;
  sort: Partial<Record<SortKey, SortOrder>>;
}
