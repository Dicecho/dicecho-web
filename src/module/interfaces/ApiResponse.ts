import { ModOrigin, ModSortKey } from '@/interfaces/shared/api';
export * from '@/interfaces/shared/api';

export const ModOriginMap = {
  [ModOrigin.SELF]: '本站',
  [ModOrigin.CNMODS]: '魔都(cnmods.net)',
  [ModOrigin.BOOTH]: 'Booth(booth.pm)',
}

export const ModSortKeyMap = {
  // [ModSortKey.ID]: '编号',
  [ModSortKey.RATE_AVG]: '评分',
  [ModSortKey.RATE_COUNT]: '评价人数',
  [ModSortKey.RELEASE_DATE]: '发布时间',
  [ModSortKey.LAST_RATE_AT]: '最后评价时间',
  [ModSortKey.LAST_EDIT_AT]: '最后编辑时间',
  [ModSortKey.CREATED_AT]: '创建时间',
  [ModSortKey.UPDATED_AT]: '更新时间',
}

export enum ModRule {
  COC = 'COC',
  DND = 'DND',
}

export const ModRuleMap = {
  [ModRule.COC]: 'COC',
  [ModRule.DND]: 'DND',
}


