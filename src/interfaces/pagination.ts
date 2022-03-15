export interface PaginatedResponse<T = any> {
  totalCount: number;
  page: number;
  pageSize: number;
  data: Array<T>;
  hasNext: boolean;
}